const siteList = document.querySelector("#siteList");
const refreshBtn = document.querySelector("#refreshBtn");

let sites = window.NavData.loadSites();
window.NavData.saveSites(sites);

function render() {
  siteList.innerHTML = "";
  if (!sites.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "还没有网址，请先去管理页添加。";
    siteList.appendChild(empty);
    return;
  }

  const groupedSites = new Map();

  sites.forEach((site) => {
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
      name.textContent = site.name;

      const url = document.createElement("p");
      url.className = "site-url";
      url.textContent = site.url;
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

render();
