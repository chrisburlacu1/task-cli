import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getTasks,
  addTask,
  addTasks,
  toggleTask,
  deleteTask,
  clearCompleted,
  TaskPriority,
} from './store.js';
import { parseDate, formatDate } from './utils/dateUtils.js';
import { scanDirectory } from './utils/fileScanner.js';
import path from 'path';

const server = new McpServer({
  name: 'task-manager-server',
  version: '1.0.0',
});

// Tool: scan_todos
server.registerTool(
  'scan_todos',
  {
    description: 'Scan the codebase (or specific directory) for TODO, FIXME, and BUG comments.',
    inputSchema: z.object({
      path: z.string().optional().describe('Relative path to scan (defaults to current directory)'),
    }).shape,
  },
  async ({ path: relPath }) => {
    try {
      const targetPath = relPath ? path.resolve(process.cwd(), relPath) : process.cwd();
      const todos = scanDirectory(targetPath);
      
      if (todos.length === 0) {
        return {
          content: [{ type: 'text', text: 'No TODOs found in the scanned path.' }],
        };
      }

      const formattedTodos = todos
        .map(t => `[${t.type}] ${t.text} (${t.file}:${t.line})`)
        .join('\n');

      return {
        content: [{ type: 'text', text: `Found ${todos.length} items:\n${formattedTodos}` }],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to scan for todos: ${error.message}` }],
      };
    }
  }
);

// Tool: bulk_add_tasks
server.registerTool(
  'bulk_add_tasks',
  {
    description: 'Add multiple tasks at once. Useful when converting found TODOs into tasks.',
    inputSchema: z.object({
      tasks: z.array(z.object({
        text: z.string(),
        priority: z.enum(['low', 'medium', 'high']).default('medium'),
        due_date: z.string().optional(),
      })).describe('List of tasks to add'),
    }).shape,
  },
  async ({ tasks }) => {
    try {
      const tasksToAdd = tasks.map(t => ({
        text: t.text,
        priority: t.priority as TaskPriority,
        dueDate: t.due_date ? parseDate(t.due_date) || undefined : undefined
      }));
      
      const added = addTasks(tasksToAdd);
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully added ${added.length} tasks.`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Failed to bulk add tasks: ${error.message}` }],
      };
    }
  }
);

// Tool: add_task
server.registerTool(
  'add_task',
  {
    description: 'Add a new task with an optional priority (high, medium, low) and optional due date (e.g. "tomorrow", "2025-12-25"). Use @tags in the text for categorization.',
    inputSchema: z.object({
      text: z.string().describe('The task description'),
      priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Task priority'),
      due_date: z.string().optional().describe('Optional due date in natural language or ISO format'),
    }).shape,
  },
  async ({ text, priority, due_date }) => {
    try {
      const parsedDueDate = due_date ? parseDate(due_date) : undefined;
      const task = addTask(text, priority as TaskPriority, parsedDueDate || undefined);
      
      let responseText = `Successfully added task: ${task.text} [${task.priority}]`;
      if (task.dueDate) {
        responseText += ` (Due: ${formatDate(task.dueDate)})`;
      }

      return {
        content: [
          {
            type: 'text',
            text: responseText,
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
    description: 'List current tasks with optional due date filtering.',
    inputSchema: z.object({
      due_before: z.string().optional().describe('Filter tasks due before this date'),
      due_after: z.string().optional().describe('Filter tasks due after this date'),
    }).shape,
  },
  async ({ due_before, due_after }) => {
    let tasks = getTasks();
    
    if (due_before) {
      const beforeDate = parseDate(due_before);
      if (beforeDate) {
        const beforeTime = new Date(beforeDate).getTime();
        tasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() < beforeTime);
      }
    }

    if (due_after) {
      const afterDate = parseDate(due_after);
      if (afterDate) {
        const afterTime = new Date(afterDate).getTime();
        tasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() > afterTime);
      }
    }

    if (tasks.length === 0) {
      return {
        content: [{ type: 'text', text: 'No tasks found matching criteria.' }],
      };
    }

    const taskList = tasks
      .map((t, i) => {
        const dueStr = t.dueDate ? ` - Due: ${formatDate(t.dueDate)}` : '';
        return `${i + 1}. [${t.completed ? '✔' : ' '}] ${t.text} (${t.priority})${dueStr} - ID: ${t.id}`;
      })
      .join('\n');

    return {
      content: [{ type: 'text', text: `--- Tasks ---\n${taskList}` }],
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
