# 📝 notepad-server MCP Server

[中文版](README_zh-CN.md)

🤖 A Model Context Protocol server

🛠️ This project implements a simple notes system and demonstrates core MCP concepts by providing:

- Tools for creating new notes
- Prompts for generating summaries of notes

## 🌟 Features

## 🛠️ Tools

### `addNotepad`
- **Description**: Add a new notepad
- **Parameters**:
  - `name` (string): Name of the notepad
  - `content` (string): Content of the notepad

### `delNotepad`
- **Description**: Delete a notepad
- **Parameters**:
  - `id` (number): ID of the notepad to delete

### `updateNotepad`
- **Description**: Update a notepad
- **Parameters**:
  - `id` (number): ID of the notepad to update
  - `content` (string): New content for the notepad

### `listNotepads`
- **Description**: List all notepads
- **Parameters**: None

### `useNotepad`
- **Description**: Use a specific notepad
- **Parameters**:
  - `id` (number): ID of the notepad to use

## 🛠️ Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## 📥 Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notepad-server": {
      "command": "/path/to/notepad-server/build/index.js"
    }
  }
}
```

### 🔍 Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
