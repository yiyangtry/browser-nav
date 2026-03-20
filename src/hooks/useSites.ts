import { useState, useEffect, useCallback } from 'react';
import { Site } from '@/types';
import { loadSites, saveSites, normalizeSite, normalizeUrl, normalizeCategory, mergeRequiredSites, defaultSites } from '@/utils/normalization';

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const loaded = loadSites();
    setSites(loaded);
  }, []);

  const addSite = useCallback((site: Omit<Site, 'url'> & { url: string }) => {
    try {
      const normalized = {
        name: site.name.trim(),
        url: normalizeUrl(site.url),
        category: normalizeCategory(site.category)
      };
      const newSites = [normalized, ...sites];
      setSites(newSites);
      saveSites(newSites);
      return true;
    } catch {
      return false;
    }
  }, [sites]);

  const updateSite = useCallback((index: number, site: Site) => {
    if (index < 0 || index >= sites.length) return false;

    try {
      const normalized = normalizeSite(site);
      const newSites = [...sites];
      newSites[index] = normalized;
      setSites(newSites);
      saveSites(newSites);
      return true;
    } catch {
      return false;
    }
  }, [sites]);

  const deleteSite = useCallback((index: number) => {
    if (index < 0 || index >= sites.length) return;

    const newSites = sites.filter((_, i) => i !== index);
    setSites(newSites);
    saveSites(newSites);
  }, [sites]);

  const reorderSites = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= sites.length || toIndex < 0 || toIndex >= sites.length) {
      return;
    }

    const newSites = [...sites];
    const [removed] = newSites.splice(fromIndex, 1);
    newSites.splice(toIndex, 0, removed);
    setSites(newSites);
    saveSites(newSites);
  }, [sites]);

  const updateSiteCategory = useCallback((index: number, category: string) => {
    if (index < 0 || index >= sites.length) return;

    const newSites = [...sites];
    newSites[index] = { ...newSites[index], category: normalizeCategory(category) };
    setSites(newSites);
    saveSites(newSites);
  }, [sites]);

  const refreshSites = useCallback(() => {
    const loaded = loadSites();
    setSites(loaded);
  }, []);

  const mergeDefaultSites = useCallback(() => {
    const merged = mergeRequiredSites(defaultSites);
    setSites(merged);
    saveSites(merged);
  }, []);

  return {
    sites,
    addSite,
    updateSite,
    deleteSite,
    reorderSites,
    updateSiteCategory,
    refreshSites,
    mergeDefaultSites
  };
}
