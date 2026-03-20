import {
  Site,
  Group,
  STORAGE_KEY,
  GROUP_STORAGE_KEY,
  DEFAULT_CATEGORY,
  defaultSites,
  defaultGroups
} from "@/types";

export { defaultSites, defaultGroups } from "@/types";

export function normalizeUrl(rawUrl: string): string {
  const trimmed = String(rawUrl || "").trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withProtocol).toString();
}

export function normalizeCategory(rawCategory: string): string {
  return rawCategory && String(rawCategory).trim()
    ? String(rawCategory).trim()
    : DEFAULT_CATEGORY;
}

export function normalizeGroupName(rawName: string): string {
  return normalizeCategory(rawName);
}

export function normalizeSite(site: Partial<Site> | undefined): Site {
  return {
    name: String(site?.name || "").trim() || "未命名",
    url: normalizeUrl(site?.url || ""),
    category: normalizeCategory(site?.category || "")
  };
}

export function uniqueGroups(inputGroups: Group[]): Group[] {
  const seen = new Set<string>();
  const result: Group[] = [];

  inputGroups.forEach((group) => {
    const name = normalizeGroupName(group);
    if (!seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  });

  if (!seen.has(DEFAULT_CATEGORY)) {
    result.push(DEFAULT_CATEGORY);
  }

  return result;
}

export function mergeRequiredSites(inputSites: Site[]): Site[] {
  const normalizedSet = new Set<string>();
  const merged: Site[] = [];

  inputSites.forEach((site) => {
    try {
      const normalizedSite = normalizeSite(site);
      if (!normalizedSet.has(normalizedSite.url)) {
        normalizedSet.add(normalizedSite.url);
        merged.push(normalizedSite);
      }
    } catch {
      // Skip malformed entries from localStorage.
    }
  });

  defaultSites.forEach((site) => {
    const normalizedSite = normalizeSite(site);
    if (!normalizedSet.has(normalizedSite.url)) {
      normalizedSet.add(normalizedSite.url);
      merged.push(normalizedSite);
    }
  });

  return merged;
}

export function normalizeAndDedupeSites(inputSites: Site[]): Site[] {
  const normalizedSet = new Set<string>();
  const normalized: Site[] = [];

  inputSites.forEach((site) => {
    try {
      const normalizedSite = normalizeSite(site);
      if (!normalizedSet.has(normalizedSite.url)) {
        normalizedSet.add(normalizedSite.url);
        normalized.push(normalizedSite);
      }
    } catch {
      // Skip malformed entries from localStorage.
    }
  });

  return normalized;
}

export function loadSites(): Site[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return normalizeAndDedupeSites(defaultSites);
  }
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return normalizeAndDedupeSites(defaultSites);
    }
    return normalizeAndDedupeSites(parsed);
  } catch {
    return normalizeAndDedupeSites(defaultSites);
  }
}

export function saveSites(sites: Site[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export function extractGroupsFromSites(sites: Site[]): Group[] {
  return sites.map((site) => normalizeCategory(site.category));
}

export function loadGroups(): Group[] {
  const saved = localStorage.getItem(GROUP_STORAGE_KEY);
  if (!saved) {
    return uniqueGroups(defaultGroups);
  }
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return uniqueGroups(defaultGroups);
    }
    return uniqueGroups(parsed);
  } catch {
    return uniqueGroups(defaultGroups);
  }
}

export function saveGroups(groups: Group[]): void {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(uniqueGroups(groups)));
}

export function syncGroupsWithSites(groups: Group[], sites: Site[]): Group[] {
  return uniqueGroups([...groups, ...extractGroupsFromSites(sites)]);
}

export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
