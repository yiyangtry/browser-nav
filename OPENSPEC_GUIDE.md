# OpenSpec 学习与使用指南

## 项目概述

本文档记录了在浏览器导航项目中使用 OpenSpec 进行规范驱动开发（SDD）的学习过程和实践经验。

## OpenSpec 简介

OpenSpec 是一个**规范驱动开发（SDD）框架**，专为 AI 编程助手设计。核心理念是在编写代码之前，让人类和 AI 对需求达成一致，从而提高开发效率和代码质量。

### 核心哲学

- **灵活而非僵化**：适应不同项目需求
- **迭代而非瀑布**：支持渐进式开发
- **简单而非复杂**：保持工具简洁易用
- **支持现有项目**：适用于现有代码库
- **可扩展**：从个人项目到企业级应用

## 安装与初始化

### 1. 系统要求

- Node.js 20.19.0 或更高版本

### 2. 安装 OpenSpec CLI

```bash
npm install -g @fission-ai/openspec@latest
```

验证安装：

```bash
openspec --version
# 输出: 1.2.0
```

### 3. 初始化项目

```bash
cd /Users/yiyang/work/project/others/browser-nav
openspec init
```

初始化后创建的目录结构：

```
openspec/
├── changes/          # 活跃的变更
│   └── archive/      # 已完成的变更
└── specs/            # 规格说明

.claude/
├── commands/         # 自定义命令
│   └── opsx/         # OpenSpec 命令
├── skills/           # 自定义技能
│   ├── openspec-propose/
│   ├── openspec-apply-change/
│   ├── openspec-archive-change/
│   └── openspec-explore/
└── settings.local.json
```

## OpenSpec 工作流程

### 完整开发流程

```
1. /opsx:propose "功能描述"
   ↓ 创建变更文件夹
   openspec/changes/<feature-name>/
   ├── proposal.md   — 为什么要做、要改变什么
   ├── specs/        — 需求和场景
   ├── design.md     — 技术方案
   └── tasks.md      — 实现清单

2. /opsx:apply
   ↓ AI 实施任务
   逐个完成 tasks.md 中的任务

3. /opsx:archive
   ↓ 归档完成的变更
   移动到 openspec/changes/archive/日期-功能名/
```

### 工作流程详解

#### 阶段一：提议阶段（Propose）

使用 `/opsx:propose` 创建新功能提案：

```bash
# 或者在 Claude Code 中使用
/opsx:propose "add-search-functionality"
```

这个阶段会创建以下工件：

1. **proposal.md** - 提案文档
   - **Why**：为什么需要这个功能
   - **What Changes**：具体要改变什么
   - **Capabilities**：新增或修改的功能规格
   - **Impact**：对代码、API、依赖的影响

2. **specs/** - 功能规格说明
   - 使用 ADDED/MODIFIED/REMOVED/RENAMED 操作
   - 每个需求包含多个场景（Scenario）
   - 使用 WHEN/THEN 格式描述场景

3. **design.md** - 技术设计文档
   - **Context**：背景和当前状态
   - **Goals/Non-Goals**：目标和非目标
   - **Decisions**：关键技术决策
   - **Risks/Trade-offs**：风险和权衡

4. **tasks.md** - 实现任务清单
   - 按功能分组的任务列表
   - 使用 `- [ ]` 格式的任务项
   - 任务间有明确的依赖关系

#### 阶段二：实施阶段（Apply）

使用 `/opsx:apply` 开始实施：

```bash
/opsx:apply add-search-functionality
```

实施阶段的工作流程：

1. 读取上下文文件（proposal、specs、design）
2. 显示当前进度
3. 逐个实现任务
4. 每完成一个任务，更新 tasks.md 中的复选框
5. 所有任务完成后，建议归档

#### 阶段三：归档阶段（Archive）

使用 `/opsx:archive` 归档完成的功能：

```bash
/opsx:archive add-search-functionality
```

归档后会：

1. 检查工件和任务完成状态
2. 评估 Delta Spec 同步状态
3. 移动到 `openspec/changes/archive/YYYY-MM-DD-功能名/`

## 实践案例：添加搜索功能

### 项目背景

浏览器导航项目是一个纯前端应用，用户网站数量增加后，快速找到特定网站变得困难。

### 使用 OpenSpec 实现搜索功能

#### 1. 创建变更

```bash
openspec new change "add-search-functionality"
```

#### 2. 生成的工件

**proposal.md** 示例内容：

```markdown
## Why

随着网站数量增加，用户在导航页上快速找到特定网站变得困难。

## What Changes

- **新增搜索输入框**：在导航页顶部添加搜索输入框
- **实时搜索结果**：输入时实时过滤显示匹配的网站
- **搜索高亮**：在搜索结果中高亮显示匹配的文字
- **键盘快捷键**：支持 "/" 键快速聚焦到搜索框

## Capabilities

### New Capabilities
- `site-search`: 提供网站搜索功能

## Impact

- 代码变更：主要修改 `index.html` 和 `app.js`
- 样式变更：修改 `style.css`
- 无依赖变更：使用纯JavaScript实现
```

**specs/site-search/spec.md** 示例：

```markdown
## ADDED Requirements

### Requirement: 搜索输入框显示
系统必须在导航页面顶部提供一个搜索输入框。

#### Scenario: 搜索框可见性
- **WHEN** 用户访问导航页面
- **THEN** 系统必须在页面顶部显示搜索输入框
```

**design.md** 示例：

```markdown
## Context

当前浏览器导航项目是一个纯前端应用，使用 HTML、CSS 和 JavaScript。

## Goals / Non-Goals

**Goals:**
- 提供实时搜索功能
- 实现搜索结果高亮
- 支持键盘快捷键

**Non-Goals:**
- 不实现模糊搜索
- 不改变数据存储结构

## Decisions

### 实时搜索实现方式
使用 input 事件监听器配合 Array.filter() 进行数据过滤。

**理由：**
- input 事件提供即时反馈
- Array.filter() 性能良好
- 数据量不大，不需要防抖
```

**tasks.md** 示例：

```markdown
## 1. HTML 结构修改

- [ ] 1.1 在 index.html 添加搜索输入框容器
- [ ] 1.2 添加搜索输入框元素
- [ ] 1.3 添加无障碍属性

## 2. CSS 样式实现

- [ ] 2.1 添加搜索框容器样式
- [ ] 2.2 实现响应式设计
- [ ] 2.3 添加搜索高亮样式
```

#### 3. 实施过程

按照 tasks.md 中的任务列表，依次完成：

1. 修改 HTML 结构，添加搜索框
2. 添加 CSS 样式，包括响应式设计
3. 实现 JavaScript 搜索逻辑
4. 添加事件监听器
5. 进行集成测试

每完成一个任务，在 tasks.md 中将 `- [ ]` 改为 `- [x]`。

#### 4. 实施结果

成功实现了以下功能：

- ✅ 实时搜索过滤
- ✅ 搜索结果高亮
- ✅ 键盘快捷键（/ 键）
- ✅ 响应式设计
- ✅ XSS 防护
- ✅ 空结果状态提示

## OpenSpec 关键概念

### 工件（Artifacts）

OpenSpec 中的工件是项目的核心文档：

1. **proposal.md**：提案文档
   - 定义"为什么"要做这个功能
   - 描述"要改变"什么
   - 识别影响范围

2. **specs/**：规格说明
   - 定义"系统应该"做什么
   - 使用 SHALL/MUST 表示规范要求
   - 每个需求包含可测试的场景

3. **design.md**：设计文档
   - 定义"如何"实现功能
   - 记录技术决策和理由
   - 识别风险和权衡

4. **tasks.md**：任务清单
   - 将实施工作分解为小任务
   - 使用复选框格式跟踪进度
   - 任务按依赖关系排序

### Delta Spec 操作

在规格说明中，使用以下操作：

- **ADDED**：新增需求
- **MODIFIED**：修改现有需求（必须包含完整更新内容）
- **REMOVED**：删除需求（必须包含原因和迁移方案）
- **RENAMED**：重命名需求（使用 FROM:/TO: 格式）

### 状态管理

OpenSpec 使用 JSON 状态文件跟踪：

- 工件状态（ready, blocked, done）
- 工件依赖关系
- 应用前置条件
- 变更完成状态

## 最佳实践

### 1. 提案编写

- 保持简洁（1-2 页）
- 专注于"为什么"而非"如何"
- 详细说明影响范围
- 正确识别功能规格

### 2. 规格说明

- 使用 SHALL/MUST 而非 should/may
- 每个需求必须有至少一个场景
- 场景使用 WHEN/THEN 格式
- 保持可测试性

### 3. 设计文档

- 记录决策理由
- 考虑备选方案
- 识别风险和缓解措施
- 包含迁移计划

### 4. 任务分解

- 任务应该足够小（一节课完成）
- 按依赖关系排序
- 每个任务应该可验证
- 使用精确的复选框格式

### 5. 实施建议

- 先阅读所有上下文文件
- 按顺序完成任务
- 完成后立即更新复选框
- 遇到问题及时暂停和沟通

## 常见问题

### Q: OpenSpec 适合什么类型的项目？

A: OpenSpec 适合各种规模的项目，特别是：
- 需要与 AI 协作的项目
- 需要清晰需求管理的项目
- 团队协作项目
- 长期维护的项目

### Q: 是否必须在开始前完成所有工件？

A: 不必须。OpenSpec 支持流体工作流：
- 可以在实施过程中更新工件
- 可以在工件未完全完成时开始实施
- 支持迭代和增量开发

### Q: 如何处理需求变更？

A: OpenSpec 支持灵活变更：
- 更新相关工件
- 在 specs 中使用 MODIFIED 操作
- 调整 tasks.md 中的任务
- 保持变更历史的可追溯性

### Q: OpenSpec 与传统开发流程的关系？

A: OpenSpec 不是替代品，而是增强：
- 可以与敏捷开发结合
- 可以与现有 CI/CD 集成
- 可以与代码审查流程配合
- 专注于需求到实现的桥梁

## 项目特定配置

### 浏览器导航项目的 OpenSpec 配置

本项目使用 OpenSpec 的 spec-driven 模式，包含：

1. **变更目录**：`openspec/changes/`
   - 存储活跃的功能变更
   - 归档完成的功能

2. **规格目录**：`openspec/specs/`
   - 存储系统级功能规格
   - 支持 Delta Spec 机制

3. **自定义命令**：`.claude/commands/opsx/`
   - propose.md：创建新变更
   - apply.md：实施变更
   - archive.md：归档变更
   - explore.md：探索变更

4. **自定义技能**：`.claude/skills/`
   - openspec-propose：提议技能
   - openspec-apply-change：应用技能
   - openspec-archive-change：归档技能
   - openspec-explore：探索技能

## 下一步

### 推荐的后续功能

基于 OpenSpec 的学习，可以考虑为浏览器导航项目添加：

1. **网站图标功能**
   - 自动获取网站 favicon
   - 图标缓存策略
   - 降级处理方案

2. **导出/导入功能**
   - JSON 格式数据导出
   - 数据导入和验证
   - 备份和恢复

3. **主题切换功能**
   - 明暗主题切换
   - 主题持久化
   - 平滑过渡效果

4. **网站分组管理**
   - 拖拽排序
   - 分组折叠/展开
   - 分组图标设置

### 深入学习资源

- **OpenSpec GitHub**：https://github.com/Fission-AI/OpenSpec
- **文档**：https://github.com/Fission-AI/OpenSpec#docs
- **Discord 社区**：https://discord.gg/openspec

## 总结

通过在浏览器导航项目中使用 OpenSpec，我们体会到：

1. **需求清晰化**：在编码前明确需求，减少返工
2. **决策可追溯**：所有技术决策都有记录和理由
3. **进度可视化**：任务清单让进度一目了然
4. **协作更顺畅**：AI 和人类对需求有一致理解
5. **维护更容易**：完整的文档体系支持长期维护

OpenSpec 的规范驱动开发方法特别适合与 AI 编程助手协作，能够显著提高开发效率和代码质量。对于希望提升开发流程规范性的项目，强烈推荐尝试 OpenSpec。
