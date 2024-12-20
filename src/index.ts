#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import path from 'path';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import sqlite3 from 'sqlite3';
import fs from 'fs';

interface Notepad {
  id: number;
  name: string;
  content: string;
}

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'notepads.db');

const tools: Tool[] = [{
  name: 'addNotepad',
  description: 'Add a new notepad',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the notepad',
      },
      content: {
        type: 'string',
        description: 'Content of the notepad',
      },
    },
    required: ['name', 'content'],
  },
},
{
  name: 'delNotepad',
  description: 'Delete a notepad',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the notepad to delete',
      },
    },
    required: ['id'],
  },
},
{
  name: 'updateNotepad',
  description: 'Update a notepad',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the notepad to update',
      },
      content: {
        type: 'string',
        description: 'New content for the notepad',
      },
    },
    required: ['id', 'content'],
  },
},
{
  name: 'listNotepads',
  description: 'List all notepads',
  inputSchema: {
    type: "object"
  },
},
{
  name: 'useNotepad',
  description: 'Use a specific notepad',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the notepad to use',
      },
    },
    required: ['id'],
  },
}]
class NotepadServer {
  private server: Server;
  private db: sqlite3.Database;

  constructor() {
    this.server = new Server(
      {
        name: 'notepad-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    if (!fs.existsSync(dbPath)) {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error creating database:', err);
        } else {
          this.db.serialize(() => {
            this.db.run("CREATE TABLE notepads (id INTEGER PRIMARY KEY, name TEXT, content TEXT)", (err) => {
              if (err) {
                console.error('Error creating table:', err);
              } else {
                console.log('Database and table created successfully');
              }
            });
          });
        }
      });
    } else {
      this.db = new sqlite3.Database(dbPath);
    }

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'addNotepad': {
          const { name, content }: { name: string; content: string } = request.params.arguments as { name: string; content: string };
          return new Promise((resolve, reject) => {
            this.db.run("INSERT INTO notepads (name, content) VALUES (?, ?)", [name, content], function (err) {
              if (err) {
                reject(new McpError(ErrorCode.InternalError, err.message));
              } else {
                resolve({
                  content: [
                    {
                      type: 'text',
                      text: `Notepad added with ID ${this.lastID}`,
                    },
                  ],
                });
              }
            });
          });
        }
        case 'delNotepad': {
          const { id }: { id: number } = request.params.arguments as { id: number };
          return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM notepads WHERE id = ?", [id], function (err) {
              if (err) {
                reject(new McpError(ErrorCode.InternalError, err.message));
              } else {
                resolve({
                  content: [
                    {
                      type: 'text',
                      text: `Notepad with ID ${id} deleted`,
                    },
                  ],
                });
              }
            });
          });
        }
        case 'updateNotepad': {
          const { id, content }: { id: number; content: string } = request.params.arguments as { id: number; content: string };
          return new Promise((resolve, reject) => {
            this.db.run("UPDATE notepads SET content = ? WHERE id = ?", [content, id], function (err) {
              if (err) {
                reject(new McpError(ErrorCode.InternalError, err.message));
              } else {
                resolve({
                  content: [
                    {
                      type: 'text',
                      text: `Notepad with ID ${id} updated`,
                    },
                  ],
                });
              }
            });
          });
        }
        case 'listNotepads': {
          return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM notepads", [], (err, rows: Notepad[]) => {
              if (err) {
                reject(new McpError(ErrorCode.InternalError, err.message));
              } else {
                resolve({
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(rows, null, 2),
                    },
                  ],
                });
              }
            });
          });
        }
        case 'useNotepad': {
          const { id }: { id: number } = request.params.arguments as { id: number };
          return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM notepads WHERE id = ?", [id], (err, row: Notepad | undefined) => {
              if (err) {
                reject(new McpError(ErrorCode.InternalError, err.message));
              } else if (!row) {
                reject(new McpError(ErrorCode.InternalError, `Notepad with ID ${id} not found`));
              } else {
                resolve({
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(row, null, 2),
                    },
                  ],
                });
              }
            });
          });
        }
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new NotepadServer();
server.run().catch(console.error);
