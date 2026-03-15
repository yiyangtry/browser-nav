const siteList = document.querySelector("#siteList");
const refreshBtn = document.querySelector("#refreshBtn");
const searchInput = document.querySelector("#searchInput");

let sites = window.NavData.loadSites();
let currentSearchTerm = "";
window.NavData.saveSites(sites);

// HTML 转义函数，防止 XSS 攻击
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 高亮搜索关键词
function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) {
    return escapeHtml(text);
  }

  const escapedText = escapeHtml(text);
  const escapedSearchTerm = escapeHtml(searchTerm);

  try {
    const regex = new RegExp(`(${escapedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  } catch {
    return escapedText;
  }
}

// 过滤网站列表
function filterSites(sites, searchTerm) {
  if (!searchTerm) {
    return sites;
  }

  const term = searchTerm.toLowerCase().trim();
  return sites.filter(site => {
    const name = site.name.toLowerCase();
    const url = site.url.toLowerCase();
    return name.includes(term) || url.includes(term);
  });
}

function render() {
  siteList.innerHTML = "";

  // 根据搜索词过滤网站
  const filteredSites = filterSites(sites, currentSearchTerm);

  if (!filteredSites.length) {
    if (currentSearchTerm) {
      const noResults = document.createElement("p");
      noResults.className = "no-results";
      noResults.textContent = "未找到匹配的网站";
      siteList.appendChild(noResults);
    } else {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "还没有网址，请先去管理页添加。";
      siteList.appendChild(empty);
    }
    return;
  }

  const groupedSites = new Map();

  filteredSites.forEach((site) => {
    const category = window.NavData.normalizeCategory(site.category);
    if (!groupedSites.has(category)) {
      groupedSites.set(category, []);
    }
    groupedSites.get(category).push(site);
  });

  groupedSites.forEach((items, category) => {
    const group = document.createElement("section");
    group.className = "site-group";

    const groupHead = document.createElement("div");
    groupHead.className = "group-head";

    const groupTitle = document.createElement("h3");
    groupTitle.className = "group-title";
    groupTitle.textContent = category;

    const groupCount = document.createElement("span");
    groupCount.className = "group-count";
    groupCount.textContent = `${items.length} 个`;

    groupHead.appendChild(groupTitle);
    groupHead.appendChild(groupCount);
    group.appendChild(groupHead);

    const list = document.createElement("ul");
    list.className = "site-list";

    items.forEach((site) => {
      const item = document.createElement("li");
      item.className = "site-item";

      const main = document.createElement("div");
      main.className = "site-main";

      const name = document.createElement("p");
      name.className = "site-name";
      name.innerHTML = highlightSearchTerm(site.name, currentSearchTerm);

      const url = document.createElement("p");
      url.className = "site-url";
      url.innerHTML = highlightSearchTerm(site.url, currentSearchTerm);
      item.classList.add("site-item-clickable");
      item.tabIndex = 0;
      item.setAttribute("role", "link");
      item.setAttribute("aria-label", `${site.name}，打开网站`);

      const openSite = () => {
        window.open(site.url, "_blank", "noopener,noreferrer");
      };

      item.addEventListener("click", openSite);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openSite();
        }
      });

      main.appendChild(name);
      main.appendChild(url);
      item.appendChild(main);
      list.appendChild(item);
    });

    group.appendChild(list);
    siteList.appendChild(group);
  });
}

refreshBtn.addEventListener("click", () => {
  sites = window.NavData.loadSites();
  window.NavData.saveSites(sites);
  render();
});

// 搜索输入事件监听
searchInput.addEventListener("input", (event) => {
  currentSearchTerm = event.target.value;
  render();
});

// 键盘快捷键 "/" 聚焦搜索框
document.addEventListener("keydown", (event) => {
  // 只在没有焦点在输入框时触发
  if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    searchInput.focus();
  }
});

render();
