## Why

当前项目是一个基于 React + Vite 的浏览器导航应用，需要部署到 GitHub Pages 以便公开访问。目前缺少自动化部署流程，每次更新都需要手动操作，效率低下且容易出错。

## What Changes

- 添加 GitHub Actions 工作流配置文件 (`.github/workflows/deploy.yml`)
- 配置 Vite 构建输出路径为 GitHub Pages 兼容格式
- 设置 GitHub Actions 权限以支持 Pages 部署
- 实现推送代码到 main 分支时自动构建并部署

## Capabilities

### New Capabilities
- `github-actions-deployment`: 使用 GitHub Actions 自动部署到 GitHub Pages 的能力，包括构建流程、权限配置和部署触发条件

### Modified Capabilities
- 无

## Impact

- 新增 `.github/workflows/deploy.yml` 工作流配置文件
- 可能需要修改 `vite.config.ts` 中的 `base` 配置以适配 GitHub Pages 路径
- 在 GitHub 仓库设置中需要启用 GitHub Pages 并选择 GitHub Actions 作为部署源
- 需要授予 GitHub Actions 必要的权限 (contents: read, pages: write, id-token: write)
