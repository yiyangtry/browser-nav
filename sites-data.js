const STORAGE_KEY = "my-nav-sites-v1";
const GROUP_STORAGE_KEY = "my-nav-groups-v1";
const DEFAULT_CATEGORY = "未分组";

const defaultSites = [
  { name: "Gemini", url: "https://gemini.google.com", category: "AI 工具" },
  { name: "NotebookLM", url: "https://notebooklm.google.com", category: "AI 工具" },
  { name: "DeepSeek", url: "https://www.deepseek.com", category: "AI 工具" },
  { name: "千问", url: "https://tongyi.aliyun.com/qianwen/", category: "AI 工具" },
  { name: "智谱", url: "https://chatglm.cn", category: "AI 工具" },
  { name: "GitHub", url: "https://github.com", category: "开发" },
  { name: "掘金", url: "https://juejin.cn", category: "开发" },
  { name: "MDN", url: "https://developer.mozilla.org", category: "开发" },
  { name: "Bilibili", url: "https://www.bilibili.com", category: "娱乐" }
];

const defaultGroups = ["AI 工具", "开发", "学习", "资讯", "娱乐", DEFAULT_CATEGORY];

function normalizeUrl(rawUrl) {
  const trimmed = String(rawUrl || "").trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withProtocol).toString();
}

function normalizeCategory(rawCategory) {
  return rawCategory && String(rawCategory).trim()
    ? String(rawCategory).trim()
    : DEFAULT_CATEGORY;
}

function normalizeGroupName(rawName) {
  return normalizeCategory(rawName);
}

function normalizeSite(site) {
  return {
    name: String(site?.name || "").trim() || "未命名",
    url: normalizeUrl(site?.url || ""),
    category: normalizeCategory(site?.category)
  };
}

function uniqueGroups(inputGroups) {
  const seen = new Set();
  const result = [];

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

function mergeRequiredSites(inputSites) {
  const normalizedSet = new Set();
  const merged = [];

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

function normalizeAndDedupeSites(inputSites) {
  const normalizedSet = new Set();
  const normalized = [];

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

function loadSites() {
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

function saveSites(sites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

function extractGroupsFromSites(sites) {
  return sites.map((site) => normalizeCategory(site.category));
}

function loadGroups() {
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

function saveGroups(groups) {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(uniqueGroups(groups)));
}

function syncGroupsWithSites(groups, sites) {
  return uniqueGroups([...groups, ...extractGroupsFromSites(sites)]);
}

window.NavData = {
  DEFAULT_CATEGORY,
  defaultSites,
  defaultGroups,
  normalizeUrl,
  normalizeCategory,
  normalizeGroupName,
  normalizeSite,
  uniqueGroups,
  mergeRequiredSites,
  loadSites,
  saveSites,
  loadGroups,
  saveGroups,
  syncGroupsWithSites
};
