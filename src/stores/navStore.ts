import { create } from 'zustand';
import { Site, Group, DEFAULT_CATEGORY } from '@/types';
import {
  loadSites,
  saveSites,
  loadGroups,
  saveGroups,
  normalizeCategory,
  normalizeGroupName,
  normalizeSite,
  syncGroupsWithSites,
  uniqueGroups,
  mergeRequiredSites,
  defaultGroups,
  defaultSites
} from '@/utils/normalization';

interface NavStore {
  sites: Site[];
  groups: Group[];
  isInitialized: boolean;

  // Initialization
  initialize: () => void;

  // Site operations
  addSite: (site: Omit<Site, 'url'> & { url: string }) => boolean;
  updateSite: (index: number, site: Site) => boolean;
  deleteSite: (index: number) => void;
  reorderSites: (fromIndex: number, toIndex: number) => void;
  updateSiteCategory: (index: number, category: string) => void;
  refreshSites: () => void;
  mergeDefaultSites: () => void;

  // Group operations
  addGroup: (name: string) => boolean;
  renameGroup: (oldName: string, newName: string) => { success: boolean; error: string | null };
  deleteGroup: (name: string) => void;
  resetDefaultGroups: () => void;
}

export const useNavStore = create<NavStore>((set, get) => ({
  sites: [],
  groups: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;

    const sites = loadSites();
    const groups = syncGroupsWithSites(loadGroups(), sites);

    set({ sites, groups, isInitialized: true });
  },

  addSite: (site) => {
    try {
      const normalized = normalizeSite(site);
      const newSites = [normalized, ...get().sites];
      set({ sites: newSites });
      saveSites(newSites);

      // Sync groups
      const syncedGroups = syncGroupsWithSites(get().groups, newSites);
      if (syncedGroups.length !== get().groups.length) {
        set({ groups: syncedGroups });
        saveGroups(syncedGroups);
      }

      return true;
    } catch {
      return false;
    }
  },

  updateSite: (index, site) => {
    const { sites } = get();
    if (index < 0 || index >= sites.length) return false;

    try {
      const normalized = normalizeSite(site);
      const newSites = [...sites];
      newSites[index] = normalized;
      set({ sites: newSites });
      saveSites(newSites);

      // Sync groups
      const syncedGroups = syncGroupsWithSites(get().groups, newSites);
      if (syncedGroups.length !== get().groups.length || syncedGroups.some((g, i) => g !== get().groups[i])) {
        set({ groups: syncedGroups });
        saveGroups(syncedGroups);
      }

      return true;
    } catch {
      return false;
    }
  },

  deleteSite: (index) => {
    const { sites } = get();
    if (index < 0 || index >= sites.length) return;

    const newSites = sites.filter((_, i) => i !== index);
    set({ sites: newSites });
    saveSites(newSites);
  },

  reorderSites: (fromIndex, toIndex) => {
    const { sites } = get();
    if (fromIndex < 0 || fromIndex >= sites.length || toIndex < 0 || toIndex >= sites.length) {
      return;
    }

    const newSites = [...sites];
    const [removed] = newSites.splice(fromIndex, 1);
    newSites.splice(toIndex, 0, removed);
    set({ sites: newSites });
    saveSites(newSites);
  },

  updateSiteCategory: (index, category) => {
    const { sites } = get();
    if (index < 0 || index >= sites.length) return;

    const newSites = [...sites];
    newSites[index] = { ...newSites[index], category: normalizeCategory(category) };
    set({ sites: newSites });
    saveSites(newSites);

    // Sync groups
    const syncedGroups = syncGroupsWithSites(get().groups, newSites);
    if (syncedGroups.length !== get().groups.length) {
      set({ groups: syncedGroups });
      saveGroups(syncedGroups);
    }
  },

  refreshSites: () => {
    const sites = loadSites();
    set({ sites });
  },

  mergeDefaultSites: () => {
    const merged = mergeRequiredSites(defaultSites);
    set({ sites: merged });
    saveSites(merged);
  },

  addGroup: (name) => {
    const normalized = normalizeGroupName(name);
    if (!normalized || get().groups.includes(normalized)) {
      return false;
    }

    const newGroups = uniqueGroups([...get().groups, normalized]);
    set({ groups: newGroups });
    saveGroups(newGroups);
    return true;
  },

  renameGroup: (oldName, newName) => {
    const normalized = normalizeGroupName(newName);
    const { groups } = get();

    if (!normalized) {
      return { success: false, error: '分组名不能为空。' };
    }

    if (groups.includes(normalized) && normalized !== oldName) {
      return { success: false, error: '分组已存在。' };
    }

    const newGroups = groups.map(g => g === oldName ? normalized : g);

    // Update sites with old category
    const newSites = get().sites.map(site =>
      site.category === oldName ? { ...site, category: normalized } : site
    );

    set({ groups: newGroups, sites: newSites });
    saveGroups(newGroups);
    saveSites(newSites);

    return { success: true, error: null };
  },

  deleteGroup: (name) => {
    if (name === DEFAULT_CATEGORY) return;

    const newGroups = get().groups.filter(g => g !== name);
    const unique = uniqueGroups(newGroups);

    // Move sites from deleted group to DEFAULT_CATEGORY
    const newSites = get().sites.map(site =>
      site.category === name ? { ...site, category: DEFAULT_CATEGORY } : site
    );

    set({ groups: unique, sites: newSites });
    saveGroups(unique);
    saveSites(newSites);
  },

  resetDefaultGroups: () => {
    set({ groups: defaultGroups });
    saveGroups(defaultGroups);
  },
}));
