import { useState, useEffect, useCallback } from 'react';
import { SIDEBAR_STORAGE_KEY } from '@/types/menu';

/**
 * Interface for sidebar state
 */
interface SidebarState {
  isCollapsed: boolean;
  mobileOpen: boolean;
  expandedGroups: Record<string, boolean>;
}

/**
 * Interface for the return value of useSidebarState hook
 */
interface UseSidebarStateReturn {
  // State values
  isCollapsed: boolean;
  mobileOpen: boolean;
  expandedGroups: Record<string, boolean>;

  // State updater functions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleGroup: (groupId: string) => void;
  setExpandedGroups: (groups: Record<string, boolean>) => void;
}

/**
 * Custom hook for managing sidebar state with localStorage persistence
 *
 * This hook manages:
 * - Sidebar collapse/expand state for desktop
 * - Mobile menu open/close state
 * - Expanded/collapsed state of menu groups
 *
 * All state is persisted to localStorage and restored on mount.
 *
 * @example
 * ```tsx
 * const { isCollapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebarState();
 *
 * return (
 *   <button onClick={toggleSidebar}>
 *     {isCollapsed ? 'Expand' : 'Collapse'}
 *   </button>
 * );
 * ```
 */
export function useSidebarState(): UseSidebarStateReturn {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<SidebarState>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load sidebar state from localStorage:', error);
    }
    return {
      isCollapsed: false,
      mobileOpen: false,
      expandedGroups: {},
    };
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save sidebar state to localStorage:', error);
    }
  }, [state]);

  // Toggle sidebar collapse state
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  // Set sidebar collapse state
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, isCollapsed: collapsed }));
  }, []);

  // Set mobile menu open state
  const setMobileOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, mobileOpen: open }));
  }, []);

  // Toggle a specific menu group's expanded state
  const toggleGroup = useCallback((groupId: string) => {
    setState(prev => ({
      ...prev,
      expandedGroups: {
        ...prev.expandedGroups,
        [groupId]: !prev.expandedGroups[groupId],
      },
    }));
  }, []);

  // Set all expanded groups at once
  const setExpandedGroups = useCallback((groups: Record<string, boolean>) => {
    setState(prev => ({ ...prev, expandedGroups: groups }));
  }, []);

  return {
    isCollapsed: state.isCollapsed,
    mobileOpen: state.mobileOpen,
    expandedGroups: state.expandedGroups,
    toggleSidebar,
    setSidebarCollapsed,
    setMobileOpen,
    toggleGroup,
    setExpandedGroups,
  };
}
