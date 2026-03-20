## Context

当前项目是一个浏览器导航网站，使用原生 HTML/CSS/JavaScript 实现，包含以下主要功能：
- 网站导航列表展示（按分组）
- 搜索功能（按名称和 URL）
- 网站管理（添加、编辑、删除、拖拽排序）
- 分组管理（新增、改名、删除）
- 数据持久化到 localStorage

现有代码结构：
- `index.html` + `app.js` - 主导航页
- `manage.html` + `manage.js` - 管理页
- `sites-data.js` - 数据持久化层
- `style.css` - 全局样式
- `game.js` - 小游戏（可选保留）

## Goals / Non-Goals

**Goals:**
- 使用 React 重写整个应用，保留所有现有功能
- 建立清晰的组件层次和代码组织
- 实现类型安全（使用 TypeScript）
- 保持数据格式兼容，确保用户数据不丢失
- 保留现有的 UI/UX 设计和样式

**Non-Goals:**
- 重新设计 UI 或改变用户体验
- 引入服务端或数据库
- 实现用户认证系统
- 移除小游戏功能（可选保留）

## Decisions

### 构建工具：Vite
**选择理由：**
- 快速的冷启动和热模块替换（HMR）
- 原生 ESM 支持，无需打包配置
- 内置 TypeScript 支持
- 与 React 生态完美集成

**替代方案考虑：**
- Next.js：过于重量级，不需要 SSR
- Create React App：配置较重，开发体验不如 Vite
- Webpack：配置复杂，上手成本高

### 状态管理：Zustand
**选择理由：**
- 轻量级（~1KB），学习成本低
- 基于 Hook，与 React 配合良好
- 无需 Provider 包裹，使用简洁
- 支持 DevTools

**替代方案考虑：**
- React Context：性能较差，容易导致不必要的重渲染
- Redux：过于重量级，项目规模不需要
- Jotai/Recoil：API 较复杂，学习成本高

### 路由：React Router v7
**选择理由：**
- React 生态标准路由库
- 支持嵌套路由和布局
- 良好的 TypeScript 支持

### 样式方案：保留全局 CSS + CSS Modules
**选择理由：**
- 现有样式已完善，无需重写
- CSS Modules 用于组件级样式隔离
- 无需引入额外的样式库，减少依赖

### 类型安全：TypeScript
**选择理由：**
- 提供类型检查，减少运行时错误
- 更好的 IDE 支持和代码提示
- 便于重构和维护

### 组件层次结构
```
App
├── Router
    ├── Layout (公共布局)
    │   ├── NavigationPage (导航页)
    │   │   ├── SearchBar
    │   │   ├── SiteGroups
    │   │   │   └── SiteGroup
    │   │   │       └── SiteList
    │   │   │           └── SiteItem
    │   │   └── Toolbar
    │   └── ManagementPage (管理页)
    │       ├── SiteForm
    │       ├── GroupManager
    │       └── SiteManager
    │           └── SiteCard (带拖拽)
```

### 数据持久化策略
保留现有 localStorage 方案，创建 React Hook 封装：
- `useSites()` - 网站列表 CRUD
- `useGroups()` - 分组管理
- `useSearch()` - 搜索功能

数据格式保持兼容，确保现有用户数据无缝迁移。

## Risks / Trade-offs

**风险 1：用户数据兼容性**
- 描述：localStorage 数据格式变更可能导致用户数据丢失
- 缓解：保持数据格式完全一致，使用相同的 key 和结构

**风险 2：构建流程增加复杂度**
- 描述：从纯静态文件变为需要构建的单页应用
- 缓解：提供清晰的构建和部署文档

**风险 3：小游戏迁移**
- 描述：game.js 使用 Canvas，可能需要特殊处理
- 缓解：保留为独立模块或 iframe 嵌入

**风险 4：性能回退**
- 描述：React 运行时可能增加初始加载时间
- 缓解：使用 Vite 的代码分割和懒加载优化

## Migration Plan

1. **第一阶段：项目初始化**
   - 创建 Vite + React + TypeScript 项目
   - 配置开发环境和构建流程

2. **第二阶段：核心功能迁移**
   - 实现数据持久化层（hooks）
   - 创建导航页组件
   - 创建管理页组件

3. **第三阶段：路由和样式**
   - 集成 React Router
   - 迁移现有样式

4. **第四阶段：测试和优化**
   - 功能测试
   - 性能优化
   - 数据兼容性验证

## Open Questions

1. 是否需要保留小游戏功能？ → 建议作为可选功能或独立页面
2. 是否需要引入 UI 组件库（如 shadcn/ui）？ → 暂不引入，保持轻量
3. 是否需要支持主题切换？ → 当前不需求，保留现有深色主题
