import { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarState } from '@/hooks/useSidebarState';
import { SidebarConfig } from '@/types';
import { SidebarMenu } from './SidebarMenu';
import './SidebarLayout.css';

interface SidebarLayoutProps {
  children: ReactNode;
  menuConfig: SidebarConfig;
}

/**
 * Responsive breakpoint constants
 */
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

/**
 * SidebarLayout - Main layout component with collapsible sidebar
 *
 * Provides a responsive layout with:
 * - Collapsible sidebar on desktop
 * - Drawer-style menu on mobile
 * - Smooth transitions and animations
 * - localStorage persistence for user preferences
 *
 * @example
 * ```tsx
 * <SidebarLayout menuConfig={menuConfig}>
 *   <YourContent />
 * </SidebarLayout>
 * ```
 */
export function SidebarLayout({ children, menuConfig }: SidebarLayoutProps) {
  const location = useLocation();
  const {
    isCollapsed,
    mobileOpen,
    toggleSidebar,
    setMobileOpen,
    expandedGroups,
    toggleGroup,
  } = useSidebarState();

  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and update responsive state
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS.MOBILE);

      // Auto-collapse sidebar on small screens
      if (width < BREAKPOINTS.TABLET && !isCollapsed) {
        toggleSidebar();
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed, toggleSidebar]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile, mobileOpen, setMobileOpen]);

  // Handle backdrop click (close mobile menu)
  const handleBackdropClick = () => {
    setMobileOpen(false);
  };

  // Handle keyboard shortcut for sidebar toggle (Cmd/Ctrl + B)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        if (!isMobile) {
          toggleSidebar();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMobile, toggleSidebar]);

  const sidebarWidth = isCollapsed
    ? (menuConfig.collapsedWidth || 64)
    : (menuConfig.expandedWidth || 256);

  return (
    <div className="sidebar-layout">
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${
          isMobile ? 'sidebar--mobile' : ''
        } ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        style={{
          width: isMobile ? (menuConfig.expandedWidth || 256) : sidebarWidth,
          transform: isMobile
            ? mobileOpen
              ? 'translateX(0)'
              : 'translateX(-100%)'
            : undefined,
        }}
      >
        {/* Sidebar Header */}
        {menuConfig.header && (
          <div className="sidebar__header">
            {menuConfig.header}
          </div>
        )}

        {/* Toggle Button (Desktop) */}
        {!isMobile && (
          <button
            className="sidebar__toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            className="sidebar__mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Sidebar Content - Menu will be rendered here */}
        <div className="sidebar__content">
          {menuConfig.items && (
            <nav
              className="sidebar__nav"
              role="navigation"
              aria-label="Main navigation"
            >
              <SidebarMenu
                items={menuConfig.items}
                isCollapsed={isCollapsed}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
              />
            </nav>
          )}
        </div>

        {/* Sidebar Footer */}
        {menuConfig.footer && (
          <div className="sidebar__footer">
            {menuConfig.footer}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className="sidebar-layout__main"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
        }}
      >
        {/* Mobile Hamburger Button */}
        {isMobile && (
          <button
            className="sidebar__hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
