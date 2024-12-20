# 📝 notepad-server MCP 服务器

[英文版](README.md)

🤖 一个基于 TypeScript 的 MCP 服务器

🛠️ 本项目实现了一个简单的笔记系统，并通过提供以下核心 MCP 概念来演示：

- 创建新笔记的工具
- 生成笔记摘要的提示

## 🌟 功能

## 🛠️ 工具

### `addNotepad`
- **描述**: 添加一个新的笔记
- **参数**:
  - `name` (string): 笔记的名称
  - `content` (string): 笔记的内容

### `delNotepad`
- **描述**: 删除一个笔记
- **参数**:
  - `id` (number): 要删除的笔记的 ID

### `updateNotepad`
- **描述**: 更新一个笔记
- **参数**:
  - `id` (number): 要更新的笔记的 ID
  - `content` (string): 笔记的新内容

### `listNotepads`
- **描述**: 列出所有笔记
- **参数**: 无

### `useNotepad`
- **描述**: 使用特定的笔记
- **参数**:
  - `id` (number): 要使用的笔记的 ID

## 🛠️ 开发

安装依赖：
```bash
npm install
```

构建服务器：
```bash
npm run build
```

开发时自动重建：
```bash
npm run watch
```

## 📥 安装

要在 Claude Desktop 中使用，添加服务器配置：

在 MacOS 上：`~/Library/Application Support/Claude/claude_desktop_config.json`
在 Windows 上：`%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notepad-server": {
      "command": "/path/to/notepad-server/build/index.js"
    }
  }
}
```

## 🔍 调试

由于 MCP 服务器通过 stdio 进行通信，调试可能会比较困难。我们推荐使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)，它作为包脚本提供：

```bash
npm run inspector
```

Inspector 将会提供一个 URL 来访问浏览器中的调试工具。
