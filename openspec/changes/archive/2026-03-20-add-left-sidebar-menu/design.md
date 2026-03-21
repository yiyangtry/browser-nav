## Context

当前项目是一个基于 React + TypeScript + Vite 的浏览器导航应用，使用 React Router DOM v6 进行路由管理。现有功能使用 Zustand 进行状态管理（navStore），但为了帮助初学者学习 React 基础，左侧菜单功能将使用原生 React hooks（useState、useEffect）实现。现有的 Layout 组件非常简单，仅通过 `<Outlet />` 渲染子路由内容。应用有两个主要页面：导航页（NavigationPage）和管理页（ManagementPage）。

为了提升用户体验和功能可扩展性，需要引入一个持久化的左侧菜单系统，支持多级结构、图标、徽章等丰富展示形式，并具备响应式设计和状态持久化能力。

## Goals / Non-Goals

**Goals:**
- 创建可复用的左侧菜单组件系统（SidebarMenu 和 SidebarLayout）
- 支持多级菜单结构、图标、徽章、展开/收起等交互
- 实现响应式设计，适配桌面端和移动端
- 使用 localStorage 持久化用户的菜单偏好设置
- 集成到现有的路由系统，支持菜单项的激活状态高亮
- 预留扩展插槽，便于后续添加搜索、历史记录、工具箱等功能

**Non-Goals:**
- 实现具体的菜单内容（这将在后续集成阶段根据实际需求配置）
- 后端服务集成（菜单配置完全基于前端）
- 复杂的权限控制（当前版本不涉及用户权限）
- 主题切换功能（使用项目现有样式）

## Decisions

### 1. 图标库选择：Lucide React

**决策：** 使用 Lucide React 作为图标库

**理由：**
- 轻量级， Tree-shakable，只打包使用的图标
- 提供 consistent design 风格
- 良好的 TypeScript 支持
- 社区活跃，持续维护

**备选方案：**
- Heroicons：由 Tailwind 团队维护，但图标数量相对较少
- React Icons：打包了多个图标库，但体积较大

### 2. 状态管理：原生 React Hooks

**决策：** 使用原生 React hooks（useState、useEffect）管理菜单状态

**理由：**
- 适合初学者学习 React 基础概念（state、props、hooks 生命周期）
- 左侧菜单状态相对简单，不需要复杂的状态管理
- 避免 Context API 的性能问题和复杂性
- 使用 useEffect + localStorage 实现持久化，展示 React 数据流

**实现要点：**
- 使用 useState 管理菜单展开/收起状态
- 使用 useState 管理移动端菜单开关状态
- 使用 useState 管理各菜单组的展开状态
- 使用 useEffect + localStorage 实现状态持久化
- 通过 props 传递状态和更新函数给子组件

### 3. 组件架构：复合组件模式 + Props 传递

**决策：** 采用复合组件模式，通过 props 传递状态和更新函数

**理由：**
- 提高组件复用性和灵活性
- 便于初学者理解 React 数据流（props down, events up）
- 清晰的组件职责划分
- 避免引入 Context 的复杂性

**组件结构：**
```
SidebarLayout (使用 useSidebarState)
  ├── SidebarHeader (optional)
  ├── Sidebar
  │   ├── SidebarMenu (接收 state & setState props)
  │   │   ├── MenuItem
  │   │   ├── SubMenu (接收 groupState & toggleGroup props)
  │   │   └── MenuDivider
  │   └── SidebarFooter (optional)
  ├── MainContent
  └── MobileBackdrop
```

**数据流示例：**
```typescript
// SidebarLayout 中
const { isCollapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebarState();

// 传递给子组件
<Sidebar isCollapsed={isCollapsed}>
  <SidebarMenu items={menuItems} />
</Sidebar>

// SubMenu 中
const toggleGroup = () => {
  setExpandedGroups(prev => ({
    ...prev,
    [groupId]: !prev[groupId]
  }));
};
```

### 4. 路由集成策略

**决策：** 在 Layout 组件中集成 SidebarLayout，并通过路由配置自动生成菜单

**理由：**
- 利用 React Router 的现有能力
- 菜单配置与路由配置保持一致
- 自动支持激活状态高亮

**实现方式：**
- 创建菜单配置数组，包含路径、标签、图标等信息
- 使用 `useLocation()` hook 获取当前路由，匹配激活状态
- 支持手动配置菜单项，便于添加非路由的功能入口

### 5. 响应式断点策略

**决策：** 使用 Tailwind CSS 断点系统（sm: 640px, md: 768px, lg: 1024px）

**理由：**
- 行业标准，一致的用户体验预期
- 便于媒体查询编写
- 如项目后续引入 Tailwind，可无缝迁移

**断点行为：**
- Desktop (≥1024px)：持久显示侧边栏，支持折叠
- Tablet (768px-1024px)：侧边栏可折叠，带遮罩
- Mobile (<768px)：默认隐藏，抽屉式显示

### 6. 动画实现：CSS Transitions

**决策：** 使用 CSS transitions 实现菜单展开/收起动画

**理由：**
- 性能优于 JavaScript 动画
- 利用 GPU 加速（transform 和 opacity）
- 遵循 `prefers-reduced-motion` 无障碍标准

**关键属性：**
- `transition: width 300ms ease, transform 300ms ease`
- 移动端使用 `transform: translateX()` 实现滑动效果

### 7. TypeScript 类型定义

**决策：** 定义严格的 TypeScript 接口，确保类型安全

**核心类型：**
```typescript
interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  type?: 'link' | 'action' | 'divider' | 'custom';
  path?: string;
  onClick?: () => void;
  children?: MenuItem[];
  badge?: number | string;
  disabled?: boolean;
  visible?: boolean;
}
```

## Risks / Trade-offs

### Risk 1: 移动端体验可能不如原生应用
**描述：** 纯 CSS/JS 实现的移动端菜单可能在某些低性能设备上出现卡顿

**缓解措施：**
- 使用 CSS transforms 而非 width/height 动画
- 减少重排和重绘
- 在低端设备上自动禁用动画（检测 `navigator.hardwareConcurrency`）

### Risk 2: localStorage 容量限制
**描述：** 如果菜单配置过大，可能超出 5MB 限制

**缓解措施：**
- 仅存储用户偏好设置，不存储完整菜单配置
- 菜单配置硬编码或从 API 获取
- 实现 localStorage 错误处理，降级到内存存储

### Risk 3: 与现有样式冲突
**描述：** 新组件可能与现有页面样式产生冲突

**缓解措施：**
- 使用 CSS Modules 或 scoped styles
- 定义统一的 CSS 变量（colors, spacing, borders）
- 避免过于具体的选择器，保持样式可覆盖性

### Trade-off 1: 灵活性 vs 复杂度
**选择：** 提供合理的默认配置，同时支持高度自定义

**权衡：**
- 预设菜单样式减少配置负担
- 支持自定义组件和样式覆盖满足特殊需求
- 文档清晰说明自定义方式

### Trade-off 2: 包体积 vs 功能完整性
**选择：** 按需加载图标和功能模块

**权衡：**
- 使用动态导入减少初始包体积
- Tree-shaking 确保未使用代码不打包
- 接受轻微的运行时开销换取更快的首次加载

## Migration Plan

### 阶段 1：基础组件开发（不影响现有功能）
1. 创建 SidebarLayout 和 SidebarMenu 基础组件
2. 实现核心功能（展开/收起、响应式、持久化）
3. 编写单元测试和 Storybook stories

### 阶段 2：集成到现有应用
1. 更新 Layout 组件，集成 SidebarLayout
2. 配置菜单项（导航页、管理页）
3. 调整现有页面样式，适配新布局

### 阶段 3：测试和优化
1. 跨浏览器测试（Chrome, Firefox, Safari, Edge）
2. 移动端设备测试（iOS Safari, Android Chrome）
3. 性能优化和 accessibility 改进

### 阶段 4：部署和监控
1. 灰度发布到生产环境
2. 监控用户反馈和使用数据
3. 快速回滚机制（通过 feature flag）

### Rollback 策略
- 使用 feature flag 控制新菜单功能
- 保留原有 Layout 组件作为备份
- 如果出现严重问题，可立即切换回旧版本

## Open Questions

1. **菜单配置方式**
   - 问题：菜单配置是硬编码、存储在 localStorage，还是从 API 获取？
   - 影响：开发复杂度和后续维护成本
   - 建议：初期硬编码，后续支持 API 配置

2. **图标库 CDN vs NPM**
   - 问题：通过 CDN 引入 Lucide 图标还是使用 NPM 包？
   - 影响：构建体积和加载性能
   - 建议：使用 NPM 包，支持 Tree-shaking

3. **移动端交互方式**
   - 问题：小屏幕是否使用底部导航替代侧边栏？
   - 影响：用户体验和开发工作量
   - 建议：使用抽屉式侧边栏，保持一致性

4. **无障碍标准支持程度**
   - 问题：需要支持哪些 ARIA 属性和键盘操作？
   - 影响：开发时间和用户体验
   - 建议：实现基础无障碍（ARIA labels、键盘导航、焦点管理）
