import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  TaskPriority,
} from './store.js';

const server = new McpServer({
  name: 'task-manager-server',
  version: '1.0.0',
});

// Tool: add_task
server.registerTool(
  'add_task',
  {
    description: 'Add a new task with an optional priority (high, medium, low). Use @tags in the text for categorization (e.g. @work).',
    inputSchema: z.object({
      text: z.string().describe('The task description'),
      priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Task priority'),
    }).shape,
  },
  async ({ text, priority }) => {
    try {
      const task = addTask(text, priority as TaskPriority);
      return {
        content: [
          {
            type: 'text',
            text: `Successfully added task: ${task.text} [${task.priority}]`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to add task: ${error.message}` }],
      };
    }
  }
);

// Tool: list_tasks
server.registerTool(
  'list_tasks',
  {
    description: 'List all current tasks, showing their completion status and priority.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    const tasks = getTasks();
    if (tasks.length === 0) {
      return {
        content: [{ type: 'text', text: 'No tasks found.' }],
      };
    }

    const taskList = tasks
      .map((t, i) => `${i + 1}. [${t.completed ? '✔' : ' '}] ${t.text} (${t.priority}) - ID: ${t.id}`)
      .join('\n');

    return {
      content: [{ type: 'text', text: `--- Current Tasks ---\n${taskList}` }],
    };
  }
);

// Tool: toggle_task
server.registerTool(
  'toggle_task',
  {
    description: 'Toggle the completion status of a task by its ID.',
    inputSchema: z.object({
      id: z.string().describe('The unique ID of the task'),
    }).shape,
  },
  async ({ id }) => {
    try {
      toggleTask(id);
      return {
        content: [{ type: 'text', text: `Toggled status for task ${id}.` }],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to toggle task: ${error.message}` }],
      };
    }
  }
);

// Tool: delete_task
server.registerTool(
  'delete_task',
  {
    description: 'Delete a task by its ID.',
    inputSchema: z.object({
      id: z.string().describe('The unique ID of the task'),
    }).shape,
  },
  async ({ id }) => {
    try {
      deleteTask(id);
      return {
        content: [{ type: 'text', text: `Deleted task ${id}.` }],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to delete task: ${error.message}` }],
      };
    }
  }
);

// Tool: clear_completed
server.registerTool(
  'clear_completed',
  {
    description: 'Remove all tasks that are marked as completed.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      clearCompleted();
      return {
        content: [{ type: 'text', text: 'Cleared all completed tasks.' }],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to clear completed tasks: ${error.message}` }],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
