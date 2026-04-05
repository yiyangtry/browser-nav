import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CompassOutlined, FolderOpenOutlined, GlobalOutlined } from '@ant-design/icons';
import { Card, Flex, Space, Typography } from 'antd';
import { useNavStore } from '@/stores/navStore';
import { SearchBar } from '@/components/navigation/SearchBar';
import { SiteGroups } from '@/components/navigation/SiteGroups';
import { Toolbar } from '@/components/navigation/Toolbar';
import { type Site } from '@/types';

export function NavigationPage() {
  const { sites, initialize, refreshSites } = useNavStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredSites = useMemo(() => {
    if (!searchTerm) {
      return sites;
    }

    const term = searchTerm.toLowerCase().trim();
    return sites.filter((site) => {
      const name = site.name.toLowerCase();
      const url = site.url.toLowerCase();
      return name.includes(term) || url.includes(term);
    });
  }, [searchTerm, sites]);

  const handleSiteClick = (site: Site) => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  const groupCount = useMemo(
    () => new Set(filteredSites.map((site) => site.category || '未分组')).size,
    [filteredSites]
  );

  return (
    <div className="page-shell">
      <Card className="page-hero" bordered={false}>
        <Flex vertical gap={24}>
          <Flex justify="space-between" align="flex-start" gap={24} wrap="wrap">
            <Space direction="vertical" size={10}>
              <span className="page-hero__eyebrow">Daily Workspace</span>
              <Typography.Title level={1} className="page-hero__title">
                我的导航
              </Typography.Title>
              <Typography.Text type="secondary" className="page-hero__description">
                用统一的轻量工作台整理常用网站，按分组筛选、搜索并快速打开。
              </Typography.Text>
            </Space>

            <div className="page-hero__stats">
              <StatChip icon={<GlobalOutlined />} label="网站总数" value={filteredSites.length} />
              <StatChip icon={<FolderOpenOutlined />} label="当前分组" value={groupCount} />
              <StatChip icon={<CompassOutlined />} label="搜索状态" value={searchTerm ? '筛选中' : '全部'} />
            </div>
          </Flex>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </Flex>
      </Card>

      <Card className="dashboard-panel" bordered={false}>
        <Flex justify="space-between" align="center" gap={16} wrap="wrap" style={{ marginBottom: 20 }}>
          <Space direction="vertical" size={2}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              网站列表
            </Typography.Title>
            <Typography.Text type="secondary">
              按分类浏览你的收藏站点，并保持搜索结果实时过滤。
            </Typography.Text>
          </Space>

          <Toolbar onRefresh={refreshSites} />
        </Flex>

        <SiteGroups sites={filteredSites} searchTerm={searchTerm} onSiteClick={handleSiteClick} />
      </Card>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="page-stat-chip">
      <div style={{ fontSize: 20, color: '#1768ac' }}>{icon}</div>
      <div>
        <span className="page-stat-chip__label">{label}</span>
        <span className="page-stat-chip__value">{value}</span>
      </div>
    </div>
  );
}

export default NavigationPage;
