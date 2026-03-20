## 1. 项目初始化

- [x] 1.1 创建 Vite + React + TypeScript 项目
- [x] 1.2 安装依赖：React Router、Zustand
- [x] 1.3 配置 TypeScript 严格模式
- [x] 1.4 配置 ESLint 和 Prettier
- [x] 1.5 设置项目目录结构（src/components, src/hooks, src/stores, src/types, src/utils）

## 2. 数据层实现

- [x] 2.1 创建类型定义（Site, Group, NavData 接口）
- [x] 2.2 实现 useSites hook（加载、保存、增删改）
- [x] 2.3 实现 useGroups hook（加载、保存、增删改、同步）
- [x] 2.4 创建数据工具函数（normalizeUrl, normalizeCategory 等）
- [x] 2.5 实现 Zustand store（可选，或使用 hooks）
- [x] 2.6 测试数据持久化与现有 localStorage 格式兼容

## 3. 导航页组件

- [x] 3.1 创建 NavigationPage 主组件
- [x] 3.2 实现 SearchBar 组件（输入框、快捷键提示）
- [x] 3.3 实现 SiteGroups 组件（分组列表容器）
- [x] 3.4 实现 SiteGroup 组件（单个分组）
- [x] 3.5 实现 SiteList 组件（网站卡片网格）
- [x] 3.6 实现 SiteItem 组件（单个网站卡片）
- [x] 3.7 实现 Toolbar 组件（刷新按钮、管理页链接）
- [x] 3.8 实现搜索过滤和高亮逻辑
- [x] 3.9 实现键盘快捷键（/ 聚焦搜索）
- [x] 3.10 实现空状态和无结果状态

## 4. 管理页组件

- [x] 4.1 创建 ManagementPage 主组件
- [x] 4.2 实现 SiteForm 组件（添加新网站）
- [x] 4.3 实现 EditModal 组件（编辑网站弹窗）
- [x] 4.4 实现 GroupManager 组件（分组管理）
- [x] 4.5 实现 SiteManager 组件（网站管理列表）
- [x] 4.6 实现 SiteCard 组件（带拖拽的网站卡片）
- [x] 4.7 实现拖拽排序功能（使用 react-dnd 或 @dnd-kit）
- [x] 4.8 实现内联分类选择器
- [x] 4.9 实现确认对话框（删除确认）
- [x] 4.10 实现表单验证和错误提示
- [x] 4.11 实现恢复默认数据功能

## 5. 路由配置

- [x] 5.1 安装并配置 React Router
- [x] 5.2 创建 App 组件和 Router 配置
- [x] 5.3 设置根路由（/）指向 NavigationPage
- [x] 5.4 设置管理页路由（/manage）指向 ManagementPage
- [x] 5.5 实现 404 重定向到首页
- [x] 5.6 实现路由懒加载（React.lazy + Suspense）
- [x] 5.7 配置页面标题（使用 document.title 或 react-helmet）

## 6. 样式迁移

- [x] 6.1 复制现有 style.css 到项目
- [x] 6.2 配置 Vite 导入 CSS
- [x] 6.3 调整组件类名以匹配现有样式
- [ ] 6.4 设置 CSS Modules（可选，用于组件特定样式）
- [x] 6.5 确保响应式设计正常工作

## 7. 主入口和布局

- [x] 7.1 创建 main.tsx 入口文件
- [x] 7.2 创建 index.html（替换现有）
- [x] 7.3 实现 Layout 组件（公共布局容器）
- [x] 7.4 配置 Vite 构建输出

## 8. 测试与优化

- [x] 8.1 功能测试：导航页所有功能
- [x] 8.2 功能测试：管理页所有功能
- [x] 8.3 数据兼容性测试（迁移现有 localStorage 数据）
- [x] 8.4 浏览器兼容性测试（Chrome, Firefox, Safari, Edge）
- [x] 8.5 响应式设计测试（移动端、桌面端）
- [x] 8.6 性能优化：代码分割检查
- [x] 8.7 性能优化：React DevTools 分析不必要渲染

## 9. 文档和部署

- [ ] 9.1 更新 README.md（新的构建和运行说明）
- [x] 9.2 添加 package.json 脚本（dev, build, preview）
- [x] 9.3 配置 Vite base 路径（如需部署到子目录）
- [x] 9.4 测试生产构建（npm run build + preview）
- [x] 9.5 清理旧文件（备份或删除旧的 HTML/JS 文件）

## 10. 可选功能

- [ ] 10.1 保留 game.js 小游戏（作为独立页面或组件）
- [ ] 10.2 添加 PWA 支持（可选）
- [ ] 10.3 添加单元测试（可选）
