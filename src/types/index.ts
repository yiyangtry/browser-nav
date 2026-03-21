export interface Site {
  name: string;
  url: string;
  category: string;
}

export type Group = string;

export const STORAGE_KEY = "my-nav-sites-v1";
export const GROUP_STORAGE_KEY = "my-nav-groups-v1";
export const DEFAULT_CATEGORY = "未分组";

export const defaultSites: Site[] = [
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

export const defaultGroups: Group[] = ["AI 工具", "开发", "学习", "资讯", "娱乐", DEFAULT_CATEGORY];

// Export menu types
export * from './menu';
