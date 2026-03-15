const siteForm = document.querySelector("#siteForm");
const nameInput = document.querySelector("#nameInput");
const urlInput = document.querySelector("#urlInput");
const categoryInput = document.querySelector("#categoryInput");
const siteList = document.querySelector("#siteList");
const clearBtn = document.querySelector("#clearBtn");
const messageEl = document.querySelector("#message");

const groupForm = document.querySelector("#groupForm");
const groupInput = document.querySelector("#groupInput");
const groupList = document.querySelector("#groupList");
const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editForm");
const editNameInput = document.querySelector("#editNameInput");
const editUrlInput = document.querySelector("#editUrlInput");
const editCategoryInput = document.querySelector("#editCategoryInput");
const cancelEditBtn = document.querySelector("#cancelEditBtn");

let sites = window.NavData.loadSites();
let groups = window.NavData.syncGroupsWithSites(window.NavData.loadGroups(), sites);
let editingIndex = null;
let draggedIndex = null;
let draggedCategory = null;
window.NavData.saveSites(sites);
window.NavData.saveGroups(groups);

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#ff8d8d" : "#a6b0c3";
}

function saveAll() {
  groups = window.NavData.syncGroupsWithSites(groups, sites);
  window.NavData.saveSites(sites);
  window.NavData.saveGroups(groups);
}

function buildGroupSelect(selectedCategory) {
  const select = document.createElement("select");
  select.className = "inline-group-select";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    if (group === selectedCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  return select;
}

function renderCategoryOptions() {
  const current = window.NavData.normalizeCategory(categoryInput.value);
  categoryInput.innerHTML = "";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    if (group === current) {
      option.selected = true;
    }
    categoryInput.appendChild(option);
  });

  if (![...categoryInput.options].some((opt) => opt.selected)) {
    categoryInput.value = groups.includes("AI 工具") ? "AI 工具" : groups[0];
  }
}

function renderEditCategoryOptions(selectedCategory) {
  editCategoryInput.innerHTML = "";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    if (group === selectedCategory) {
      option.selected = true;
    }
    editCategoryInput.appendChild(option);
  });
}

function openEditModal(index) {
  const site = sites[index];
  if (!site) {
    return;
  }

  editingIndex = index;
  editNameInput.value = site.name;
  editUrlInput.value = site.url;
  renderEditCategoryOptions(window.NavData.normalizeCategory(site.category));
  editModal.classList.remove("hidden");
  editModal.setAttribute("aria-hidden", "false");
  editNameInput.focus();
}

function closeEditModal() {
  editingIndex = null;
  editModal.classList.add("hidden");
  editModal.setAttribute("aria-hidden", "true");
}

function renderGroupManager() {
  groupList.innerHTML = "";

  groups.forEach((group) => {
    const row = document.createElement("div");
    row.className = "group-manage-item";

    const name = document.createElement("span");
    name.className = "group-manage-name";
    name.textContent = group;

    const actions = document.createElement("div");
    actions.className = "group-manage-actions";

    const renameBtn = document.createElement("button");
    renameBtn.type = "button";
    renameBtn.className = "ghost-btn mini-btn";
    renameBtn.textContent = "改名";
    renameBtn.addEventListener("click", () => {
      const next = prompt("请输入新分组名", group);
      if (!next) {
        return;
      }
      const nextGroup = window.NavData.normalizeGroupName(next);
      if (group === window.NavData.DEFAULT_CATEGORY && nextGroup !== window.NavData.DEFAULT_CATEGORY) {
        setMessage("“未分组”不能改名。", true);
        return;
      }
      if (groups.includes(nextGroup) && nextGroup !== group) {
        setMessage("分组已存在。", true);
        return;
      }

      groups = groups.map((item) => (item === group ? nextGroup : item));
      sites = sites.map((site) => {
        if (window.NavData.normalizeCategory(site.category) === group) {
          return { ...site, category: nextGroup };
        }
        return site;
      });

      saveAll();
      render();
      setMessage("分组已改名。", false);
    });

    actions.appendChild(renameBtn);

    if (group !== window.NavData.DEFAULT_CATEGORY) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "mini-delete-btn";
      deleteBtn.textContent = "删除";
      deleteBtn.addEventListener("click", () => {
        const confirmed = confirm(`确认删除分组“${group}”吗？该分组网站会移动到“未分组”。`);
        if (!confirmed) {
          return;
        }
        groups = groups.filter((item) => item !== group);
        sites = sites.map((site) => {
          if (window.NavData.normalizeCategory(site.category) === group) {
            return { ...site, category: window.NavData.DEFAULT_CATEGORY };
          }
          return site;
        });

        saveAll();
        render();
        setMessage(`已删除分组“${group}”，其网站已移到“未分组”。`, false);
      });
      actions.appendChild(deleteBtn);
    }

    row.appendChild(name);
    row.appendChild(actions);
    groupList.appendChild(row);
  });
}

function renderSites() {
  siteList.innerHTML = "";
  if (!sites.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "还没有网址，先添加一个吧。";
    siteList.appendChild(empty);
    return;
  }

  const groupedSites = new Map();

  sites.forEach((site, index) => {
    const category = window.NavData.normalizeCategory(site.category);
    if (!groupedSites.has(category)) {
      groupedSites.set(category, []);
    }
    groupedSites.get(category).push({ site, index });
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

    items.forEach(({ site, index }) => {
      const item = document.createElement("li");
      item.className = "site-item";
      item.draggable = true;
      item.dataset.index = index;
      item.dataset.category = category;

      // 拖拽开始
      item.addEventListener("dragstart", (e) => {
        draggedIndex = index;
        draggedCategory = category;
        item.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });

      // 拖拽结束
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggedIndex = null;
        draggedCategory = null;
        document.querySelectorAll(".site-item").forEach(el => {
          el.classList.remove("drag-over");
        });
      });

      // 拖拽经过
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (item.dataset.index != draggedIndex) {
          item.classList.add("drag-over");
        }
      });

      // 拖拽离开
      item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over");
      });

      // 放置
      item.addEventListener("drop", (e) => {
        e.preventDefault();
        item.classList.remove("drag-over");

        const targetIndex = parseInt(item.dataset.index);
        const targetCategory = item.dataset.category;

        // 只在同一分组内排序
        if (draggedCategory !== targetCategory || draggedIndex === null || draggedIndex === targetIndex) {
          return;
        }

        // 重新排序 sites 数组
        const draggedSite = sites[draggedIndex];
        sites.splice(draggedIndex, 1);

        // 计算在原数组中的正确插入位置
        let actualTargetIndex = targetIndex;
        if (draggedIndex < targetIndex) {
          actualTargetIndex = targetIndex - 1;
        }
        sites.splice(actualTargetIndex, 0, draggedSite);

        saveAll();
        render();
      });

      const main = document.createElement("div");
      main.className = "site-main";

      const name = document.createElement("p");
      name.className = "site-name";
      name.textContent = site.name;

      const url = document.createElement("p");
      url.className = "site-url";
      url.textContent = site.url;

      const groupSelect = buildGroupSelect(window.NavData.normalizeCategory(site.category));
      groupSelect.addEventListener("change", (event) => {
        sites[index].category = window.NavData.normalizeCategory(event.target.value);
        saveAll();
        render();
      });

      main.appendChild(name);
      main.appendChild(url);
      main.appendChild(groupSelect);

      const actions = document.createElement("div");
      actions.className = "actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "编辑";
      edit.addEventListener("click", () => {
        openEditModal(index);
      });

      const open = document.createElement("a");
      open.href = site.url;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
      open.textContent = "打开";

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.addEventListener("click", () => {
        const confirmed = confirm(`确认删除网站“${site.name}”吗？`);
        if (!confirmed) {
          return;
        }
        sites.splice(index, 1);
        saveAll();
        render();
      });

      actions.appendChild(edit);
      actions.appendChild(open);
      actions.appendChild(remove);
      item.appendChild(main);
      item.appendChild(actions);
      list.appendChild(item);
    });

    group.appendChild(list);
    siteList.appendChild(group);
  });
}

function render() {
  renderCategoryOptions();
  renderGroupManager();
  renderSites();
}

siteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const rawUrl = urlInput.value.trim();
  const category = window.NavData.normalizeCategory(categoryInput.value);

  if (!name || !rawUrl) {
    setMessage("请填写完整名称和网址。", true);
    return;
  }

  try {
    const url = window.NavData.normalizeUrl(rawUrl);
    sites.unshift({ name, url, category });
    saveAll();
    render();
    siteForm.reset();
    categoryInput.value = groups.includes("AI 工具") ? "AI 工具" : groups[0];
    setMessage("添加成功。", false);
  } catch {
    setMessage("网址格式不正确，请检查后重试。", true);
  }
});

groupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newGroup = window.NavData.normalizeGroupName(groupInput.value);
  if (!newGroup) {
    setMessage("分组名不能为空。", true);
    return;
  }
  if (groups.includes(newGroup)) {
    setMessage("分组已存在。", true);
    return;
  }

  groups.push(newGroup);
  saveAll();
  render();
  groupForm.reset();
  setMessage("分组添加成功。", false);
});

clearBtn.addEventListener("click", () => {
  sites = window.NavData.mergeRequiredSites(window.NavData.defaultSites);
  groups = window.NavData.uniqueGroups(window.NavData.defaultGroups);
  saveAll();
  render();
  setMessage("已恢复默认网站和分组。", false);
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (editingIndex === null || !sites[editingIndex]) {
    closeEditModal();
    return;
  }

  const nextName = editNameInput.value.trim();
  const nextUrlInput = editUrlInput.value.trim();
  const nextCategory = window.NavData.normalizeCategory(editCategoryInput.value);

  if (!nextName || !nextUrlInput) {
    setMessage("请填写完整名称和网址。", true);
    return;
  }

  try {
    const nextUrl = window.NavData.normalizeUrl(nextUrlInput);
    sites[editingIndex].name = nextName;
    sites[editingIndex].url = nextUrl;
    sites[editingIndex].category = nextCategory;
    saveAll();
    render();
    closeEditModal();
    setMessage("网站已更新。", false);
  } catch {
    setMessage("网址格式不正确，请检查后重试。", true);
  }
});

cancelEditBtn.addEventListener("click", closeEditModal);
editModal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeEditModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editModal.classList.contains("hidden")) {
    closeEditModal();
  }
});

render();
