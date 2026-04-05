import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebarState } from '@/hooks/useSidebarState';
import { type MenuItem, type SidebarConfig } from '@/types';

interface SidebarLayoutProps {
  children: ReactNode;
  menuConfig: SidebarConfig;
}

const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

type AntdMenuItems = NonNullable<MenuProps['items']>;

type SelectedMenuState = {
  selectedKey?: string;
  openKeys: string[];
};

export function SidebarLayout({ children, menuConfig }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isCollapsed,
    mobileOpen,
    toggleSidebar,
    setMobileOpen,
    expandedGroups,
    setExpandedGroups,
  } = useSidebarState();

  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const isMobile = viewportWidth < BREAKPOINTS.MOBILE;

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);

      if (width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET && !isCollapsed) {
        toggleSidebar();
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed, toggleSidebar]);

  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, location.pathname, mobileOpen, setMobileOpen]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        if (!isMobile) {
          toggleSidebar();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMobile, toggleSidebar]);

  const selectedState = useMemo(
    () => findSelectedMenuState(menuConfig.items, location.pathname),
    [location.pathname, menuConfig.items]
  );

  const persistedOpenKeys = useMemo(
    () =>
      Object.entries(expandedGroups)
        .filter(([, value]) => value)
        .map(([key]) => key),
    [expandedGroups]
  );

  const openKeys = useMemo(
    () => Array.from(new Set([...selectedState.openKeys, ...persistedOpenKeys])),
    [persistedOpenKeys, selectedState.openKeys]
  );

  const menuItems = useMemo(() => buildMenuItems(menuConfig.items), [menuConfig.items]);
  const menuLookup = useMemo(() => createMenuLookup(menuConfig.items), [menuConfig.items]);

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const nextState = keys.reduce<Record<string, boolean>>((acc, key) => {
      acc[String(key)] = true;
      return acc;
    }, {});
    setExpandedGroups(nextState);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const item = menuLookup.get(String(key));
    if (!item || item.disabled) {
      return;
    }

    if (item.type === 'action') {
      item.onClick?.();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  const brand = (
    <div className={`app-shell__brand ${isCollapsed && !isMobile ? 'app-shell__brand--collapsed' : ''}`}>
      <div className="app-shell__brand-emblem">BN</div>
      <div className="app-shell__brand-copy">
        <span className="app-shell__brand-kicker">Browser Nav</span>
        <Typography.Title level={4} className="app-shell__brand-title">
          Navigator
        </Typography.Title>
        <Typography.Text type="secondary" className="app-shell__brand-text">
          用 Ant Design 重做的轻量收藏工作台
        </Typography.Text>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="app-shell__nav">
      {menuConfig.header || brand}
      <Menu
        mode="inline"
        inlineCollapsed={!isMobile && isCollapsed}
        items={menuItems}
        selectedKeys={selectedState.selectedKey ? [selectedState.selectedKey] : []}
        openKeys={!isMobile && isCollapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        className="app-shell__menu"
      />
      {menuConfig.footer || (
        <div className="app-shell__footer">
          <Space size={8} wrap>
            <Tag bordered={false} color="blue">
              / 搜索
            </Tag>
            <Tag bordered={false}>Cmd/Ctrl + B</Tag>
          </Space>
        </div>
      )}
    </div>
  );

  return (
    <Layout className="app-shell">
      {!isMobile ? (
        <Layout.Sider
          width={menuConfig.expandedWidth || 272}
          collapsedWidth={menuConfig.collapsedWidth || 88}
          collapsed={isCollapsed}
          trigger={null}
          className="app-shell__sider"
        >
          <div className="app-shell__sider-topbar">
            <Button
              type="text"
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? '展开侧栏' : '收起侧栏'}
            />
          </div>
          {renderSidebar()}
        </Layout.Sider>
      ) : null}

      <Layout className="app-shell__workspace">
        {isMobile ? (
          <div className="app-shell__mobile-bar">
            <Button
              type="default"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
              aria-label="打开菜单"
            >
              菜单
            </Button>
          </div>
        ) : null}

        <Layout.Content className="app-shell__content">{children}</Layout.Content>
      </Layout>

      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={menuConfig.expandedWidth || 272}
        closable={false}
        className="app-shell__drawer"
        styles={{ body: { padding: 0 } }}
      >
        {renderSidebar()}
      </Drawer>
    </Layout>
  );
}

function findSelectedMenuState(items: MenuItem[], pathname: string, parents: string[] = []): SelectedMenuState {
  for (const item of items) {
    if (item.visible === false) {
      continue;
    }

    const isExactMatch = item.path === pathname;
    const isNestedMatch = Boolean(item.path && item.path !== '/' && pathname.startsWith(item.path));

    if (isExactMatch || isNestedMatch) {
      return { selectedKey: item.id, openKeys: parents };
    }

    if (item.children?.length) {
      const childState = findSelectedMenuState(item.children, pathname, [...parents, item.id]);
      if (childState.selectedKey) {
        return childState;
      }
    }
  }

  return { openKeys: [] };
}

function buildMenuItems(items: MenuItem[]): AntdMenuItems {
  const mappedItems: AntdMenuItems = [];

  items.forEach((item) => {
    if (item.visible === false) {
      return;
    }

    if (item.type === 'divider') {
      mappedItems.push({ type: 'divider' as const });
      return;
    }

    if (item.type === 'custom') {
      return;
    }

    const label = item.badge !== undefined
      ? (
          <Space size={8}>
            <span>{item.label}</span>
            <Tag bordered={false}>{item.badge}</Tag>
          </Space>
        )
      : item.label;

    if (item.children?.length) {
      mappedItems.push({
        key: item.id,
        icon: item.icon,
        label,
        children: buildMenuItems(item.children),
        disabled: item.disabled,
      });
      return;
    }

    mappedItems.push({
      key: item.id,
      icon: item.icon,
      label,
      disabled: item.disabled,
    });
  });

  return mappedItems;
}

function createMenuLookup(items: MenuItem[], lookup = new Map<string, MenuItem>()) {
  items.forEach((item) => {
    if (item.type !== 'divider' && item.type !== 'custom') {
      lookup.set(item.id, item);
    }

    if (item.children?.length) {
      createMenuLookup(item.children, lookup);
    }
  });

  return lookup;
}
