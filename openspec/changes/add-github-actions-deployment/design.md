## Context

当前 browser-nav 项目是一个基于 React + Vite + TypeScript 构建的浏览器导航应用。项目已经开发完成，具备导航页面和管理页面功能，数据存储在浏览器的 localStorage 中。

当前没有自动化部署流程，需要手动构建和部署。项目已有 GitHub 仓库 (git@github.com:yiyangtry/browser-nav.git)，适合使用 GitHub Pages 进行托管。

## Goals / Non-Goals

**Goals:**
- 实现代码推送到 main 分支时自动构建和部署到 GitHub Pages
- 使用 GitHub 官方推荐的 actions/deploy-pages 方案
- 确保部署流程稳定可靠，包含适当的错误处理
- 支持手动触发部署

**Non-Goals:**
- 不涉及后端服务部署（纯静态应用）
- 不涉及自定义域名配置（可后续手动配置）
- 不涉及多环境部署（仅生产环境）

## Decisions

### 使用 GitHub 官方 actions/deploy-pages

**选择理由：**
- GitHub 官方维护，稳定性和持续更新有保障
- 专门为 GitHub Pages 优化，自动处理 HTTPS 和域名配置
- 提供专门的部署环境和 URL 输出
- 2026年主流方案，社区支持良好

**替代方案考虑：**
- peaceiris/actions-gh-pages：社区方案，功能更丰富但非官方维护
- 分支部署：配置简单但无法控制构建过程，不适合 Vite 项目

### 使用单一 Job 的简化工作流

**选择理由：**
- 项目构建时间短（约1-2分钟），无需分离构建和部署
- 减少配置复杂度，便于维护
- 官方示例推荐此方式

**工作流步骤：**
1. Checkout 代码
2. 设置 Pages 环境
3. 上传构建产物
4. 部署到 GitHub Pages

### Node.js 版本选择

**选择理由：**
- 使用 Node.js 20 LTS 版本
- Vite 5.x 推荐 Node.js 18+
- 稳定且性能良好

### 构建命令

**选择理由：**
- 使用现有的 `npm run build` 命令
- 该命令已包含 TypeScript 编译 (`tsc && vite build`)
- 构建产物输出到 `./dist` 目录，符合 Pages 要求

### Concurrency 配置

**选择理由：**
- 设置 `concurrency.group: "pages"` 防止并发冲突
- `cancel-in-progress: false` 确保完整的构建部署流程
- GitHub Pages 推荐配置

## Risks / Trade-offs

### Risk: Vite base 路径配置问题

**问题：** GitHub Pages 默认部署到 `https://username.github.io/repo-name/` 路径下，可能导致资源加载失败。

**缓解措施：**
- 在 design 阶段明确需要配置 `vite.config.ts` 的 `base` 选项
- 使用 `/browser-nav/` 作为 base 路径
- 后续可改用自定义域名或 HashRouter 来解决

### Risk: React Router 在 GitHub Pages 上的 404 问题

**问题：** 使用 BrowserRouter 时，刷新非根路径会导致 404。

**缓解措施：**
- 当前项目已使用 react-router-dom，建议保持现有路由方案
- 用户访问时从首页导航，不直接访问子路径
- 如有问题可后续改用 HashRouter

### Trade-off: 部署时间

**权衡：** 每次 push 都会触发完整构建部署，约需 1-3 分钟。

**接受理由：**
- 个人项目，推送频率不高
- 自动化带来的便利性大于等待成本
- 可通过 workflow_dispatch 手动控制部署时机

## Migration Plan

### 实施步骤

1. **创建 GitHub Actions 工作流文件**
   - 创建 `.github/workflows/deploy.yml`
   - 配置触发条件、权限和部署步骤

2. **更新 Vite 配置**
   - 修改 `vite.config.ts` 添加 `base: '/browser-nav/'`
   - 确保资源路径正确

3. **配置 GitHub 仓库设置**
   - 在仓库 Settings → Pages 中选择 Source 为 "GitHub Actions"
   - 验证 Actions 权限已正确设置

4. **测试部署**
   - 推送代码到 main 分支
   - 检查 Actions 工作流执行情况
   - 验证部署后的网站可正常访问

### 回滚策略

- 如果部署失败，删除 `.github/workflows/deploy.yml` 即可停止自动部署
- 可随时切换回分支部署方式
- 工作流不影响本地开发环境

## Open Questions

无 - 设计方案已明确，可直接实施。
