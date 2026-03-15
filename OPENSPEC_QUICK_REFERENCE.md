# OpenSpec 快速参考指南

## 常用命令

### 初始化项目
```bash
openspec init
```

### 创建新变更
```bash
openspec new change "<feature-name>"
```

### 查看变更状态
```bash
openspec status --change "<feature-name>"
openspec status --change "<feature-name>" --json
```

### 获取工件说明
```bash
openspec instructions <artifact-id> --change "<feature-name>" --json
```

### 列出所有变更
```bash
openspec list --json
```

### Claude Code 命令
```bash
/opsx:propose "功能描述"    # 创建新功能提案
/opsx:apply [feature-name]  # 实施功能
/opsx:archive [feature-name] # 归档完成的功能
```

## 目录结构

```
openspec/
├── changes/                    # 活跃的变更
│   ├── <feature-name>/        # 功能名称
│   │   ├── .openspec.yaml     # 变更配置
│   │   ├── proposal.md        # 提案文档
│   │   ├── design.md          # 设计文档
│   │   ├── tasks.md           # 任务清单
│   │   └── specs/             # 规格说明
│   │       └── <capability>/  # 功能能力
│   │           └── spec.md    # 规格文档
│   └── archive/              # 已归档的变更
│       └── YYYY-MM-DD-<feature-name>/
└── specs/                    # 系统级规格说明
    └── <capability>/
        └── spec.md
```

## 工件模板速查

### proposal.md 结构

```markdown
## Why
<!-- 为什么要做这个功能 -->

## What Changes
<!-- 具体要改变什么，列出主要变更 -->

## Capabilities

### New Capabilities
- `<name>`: <功能描述>

### Modified Capabilities
- `<existing-name>`: <需求变更说明>

## Impact
<!-- 影响的代码、API、依赖等 -->
```

### specs/spec.md 结构

```markdown
## ADDED Requirements

### Requirement: 需求名称
需求描述。

#### Scenario: 场景名称
- **WHEN** <条件>
- **THEN** <预期结果>

## MODIFIED Requirements

### Requirement: 现有需求名称
完整的更新后需求描述。

#### Scenario: 场景名称
- **WHEN** <条件>
- **THEN** <预期结果>

## REMOVED Requirements

### Requirement: 需求名称
**Reason:** 删除原因
**Migration:** 迁移方案
```

### design.md 结构

```markdown
## Context
<!-- 背景和当前状态 -->

## Goals / Non-Goals

**Goals:**
<!-- 目标列表 -->

**Non-Goals:**
<!-- 非目标列表 -->

## Decisions
<!-- 关键技术决策及理由 -->

## Risks / Trade-offs
<!-- 风险和权衡 -->

## Migration Plan
<!-- 部署步骤和回滚策略 -->

## Open Questions
<!-- 待解决的问题 -->
```

### tasks.md 结构

```markdown
## 1. 任务组名称

- [ ] 1.1 任务描述
- [ ] 1.2 任务描述

## 2. 任务组名称

- [ ] 2.1 任务描述
- [ ] 2.2 任务描述
```

## 工作流程图

```
┌─────────────────┐
│  /opsx:propose  │
│   创建变更       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  创建工件        │
│ • proposal.md   │
│ • specs/        │
│ • design.md     │
│ • tasks.md      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /opsx:apply    │
│   实施功能       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 完成任务         │
│ 更新 tasks.md   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /opsx:archive  │
│   归档功能       │
└─────────────────┘
```

## 状态检查清单

### 开始实施前确认

- [ ] proposal.md 已完成
- [ ] specs/ 已完成
- [ ] design.md 已完成
- [ ] tasks.md 已创建
- [ ] 所有 `applyRequires` 工件状态为 `done`

### 实施过程确认

- [ ] 已阅读所有上下文文件
- [ ] 理解需求和设计决策
- [ ] 按任务顺序实施
- [ ] 每完成一个任务更新复选框
- [ ] 遇到问题及时沟通

### 完成后确认

- [ ] 所有 tasks.md 中的任务已完成
- [ ] 功能测试通过
- [ ] 代码已提交
- [ ] 准备归档

## 常见场景处理

### 场景 1：需求变更

1. 更新 proposal.md
2. 更新相关 specs/
3. 更新 design.md（如需要）
4. 调整 tasks.md
5. 继续实施

### 场景 2：实施发现设计问题

1. 暂停当前任务
2. 更新 design.md
3. 调整 tasks.md
4. 继续实施

### 场景 3：部分完成后需要切换

1. 标记当前任务状态
2. 记录暂停位置
3. 可以随时恢复

## 快速技巧

1. **使用 JSON 输出**：添加 `--json` 参数便于解析
2. **检查状态**：实施前检查工件状态
3. **小任务分解**：将大任务分解为小任务
4. **保持同步**：工件间保持一致性
5. **记录决策**：在设计文档中记录理由

## 调试命令

### 检查变更目录
```bash
ls -la openspec/changes/
```

### 查看工件内容
```bash
cat openspec/changes/<feature-name>/proposal.md
```

### 检查任务完成度
```bash
grep -c "\- \[x\]" openspec/changes/<feature-name>/tasks.md
grep -c "\- \[ \]" openspec/changes/<feature-name>/tasks.md
```

### 查看归档变更
```bash
ls -la openspec/changes/archive/
```

## 参考资源

- **OpenSpec GitHub**: https://github.com/Fission-AI/OpenSpec
- **完整文档**: 本项目的 OPENSPEC_GUIDE.md
- **Discord 社区**: https://discord.gg/openspec
