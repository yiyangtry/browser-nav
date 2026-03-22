## 1. GitHub Actions 工作流配置

- [x] 1.1 创建 `.github/workflows` 目录
- [x] 1.2 创建 `deploy.yml` 工作流文件
- [x] 1.3 配置工作流触发条件（push to main, workflow_dispatch）
- [x] 1.4 配置必要权限（contents: read, pages: write, id-token: write）
- [x] 1.5 配置 concurrency 控制防止并发部署

## 2. 构建步骤配置

- [x] 2.1 添加 checkout 步骤获取代码
- [x] 2.2 添加 Setup Pages 步骤配置 Pages 环境
- [x] 2.3 添加 Upload artifact 步骤上传 dist 目录
- [x] 2.4 添加 Deploy to GitHub Pages 步骤完成部署
- [x] 2.5 配置部署环境名称和 URL 输出

## 3. Vite 配置更新

- [x] 3.1 更新 `vite.config.ts` 添加 `base: '/browser-nav/'` 配置
- [x] 3.2 验证配置语法正确性
- [x] 3.3 本地构建测试确保路径正确

## 4. GitHub 仓库配置

- [ ] 4.1 在 GitHub 仓库 Settings → Pages 中启用 Pages
- [ ] 4.2 设置 Source 为 "GitHub Actions"
- [ ] 4.3 验证 Actions 权限已正确授予

## 5. 部署验证

- [ ] 5.1 推送代码触发工作流
- [ ] 5.2 在 Actions 标签页检查工作流执行状态
- [ ] 5.3 验证构建成功完成
- [ ] 5.4 访问 GitHub Pages URL 确认网站正常显示
- [ ] 5.5 测试页面导航和功能是否正常
- [ ] 5.6 检查浏览器控制台无资源加载错误
