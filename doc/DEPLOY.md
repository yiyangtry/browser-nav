# GitHub Pages 部署指南

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

## 部署架构

```
代码推送 → GitHub Actions → 构建 → 部署 → GitHub Pages
```

**工作流程：**
1. 代码推送到 `main` 分支
2. GitHub Actions 自动触发工作流
3. 构建项目（`npm run build`）
4. 部署到 GitHub Pages

## 文件说明

### 1. GitHub Actions 工作流

**文件：** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**关键配置：**
- `on.push.branches: ["main"]` - 推送到 main 分支时触发
- `permissions` - Pages 部署所需权限
- `node-version: '20'` - Node.js 版本
- `npm ci` - 使用 lock file 安装依赖（需要 `package-lock.json` 在仓库中）
- `npm run build` - 构建命令
- `path: './dist'` - 构建产物目录

### 2. Vite 配置

**文件：** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/browser-nav/',  // GitHub Pages 项目路径
  // ...
});
```

**`base` 配置说明：**
- GitHub Pages 默认路径：`https://username.github.io/repo-name/`
- 项目名称为 `browser-nav`，所以设置 `base: '/browser-nav/'`
- 如果使用自定义域名，设置为 `base: './'` 或 `base: '/'`

### 3. 依赖锁文件

**重要：** `package-lock.json` 必须提交到仓库。

**原因：**
- `npm ci` 需要锁文件来确保依赖版本一致
- 比 `npm install` 更快、更可靠

**检查 `.gitignore`：**
```gitignore
# Dependencies
node_modules/
# package-lock.json  ← 不要忽略这一行
yarn.lock
pnpm-lock.yaml
```

## 首次部署设置

### 步骤 1：配置 GitHub 仓库

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 "GitHub Actions"
3. 点击 **Save**

### 步骤 2：配置 Actions 权限

进入 **Settings → Actions → General**：
- **Workflow permissions** 选择 "Read and write permissions"
- 点击 **Save**

### 步骤 3：推送代码

```bash
git add .
git commit -m "feat: xxx"
git push origin main
```

### 步骤 4：等待部署完成

1. 进入 **Actions** 标签页
2. 查看 "Deploy to GitHub Pages" 工作流状态
3. 等待约 1-3 分钟

### 步骤 5：访问网站

```
https://yiyangtry.github.io/browser-nav/
```

## 日常开发流程

**只需推送代码，自动部署：**

```bash
# 1. 修改代码

# 2. 提交并推送
git add .
git commit -m "feat: 新功能"
git push origin main

# 3. 等待 1-3 分钟，自动部署完成
```

**查看部署状态：**
- GitHub 仓库 → Actions 标签页
- 绿色 ✓ = 成功
- 红色 ✗ = 失败（点击查看日志）

## 手动触发部署

如果需要手动触发部署（不推送新代码）：

1. 进入 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 **Run workflow** 按钮
4. 选择 `main` 分支
5. 点击 **Run workflow**

## 常见问题

### Q1: 部署后访问 404

**原因：** `vite.config.ts` 的 `base` 配置不正确

**解决：** 检查 `base` 是否设置为 `/browser-nav/`

### Q2: 资源加载失败（白屏）

**原因：** 静态资源路径不正确

**解决：** 确保使用 `base: '/browser-nav/'`

### Q3: Actions 工作流失败

**常见原因：**
- 缺少 `package-lock.json`
- `vite.config.ts` 配置错误
- 构建命令失败

**解决：** 点击失败的 Actions 运行，查看详细日志

### Q4: 如何修改部署地址

**自定义域名：**
1. 在 **Settings → Pages** 添加自定义域名
2. 修改 `vite.config.ts` 的 `base: './'`
3. 推送代码触发部署

## 本地构建预览

如需本地预览构建结果：

```bash
# 构建
npm run build

# 预览构建产物
npm run preview
```

预览地址：`http://localhost:4173/`

## 相关链接

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Vite 静态部署指南](https://vite.dev/guide/static-deploy)
