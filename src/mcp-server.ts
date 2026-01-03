import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getTasks,
  getAllTags,
  searchTasks,
  addTask,
  addTasks,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  TaskPriority,
  TaskStatus,
} from './store/store.js';
import { parseDate, formatDate } from './utils/dateUtils.js';
import { scanDirectory } from './utils/fileScanner.js';
import { slugify } from './utils/stringUtils.js';
import { findActionsSection } from './utils/meetingParser.js';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const server = new McpServer({
  name: 'task-manager-server',
  version: '1.0.0',
});

// Tool: read_meeting_actions
server.registerTool(
  'read_meeting_actions',
  {
    description:
      'Read a file (e.g., meeting notes) and extract the "Actions" or "Action Items" section to facilitate task creation. If no specific section is found, it returns the full content.',
    inputSchema: z.object({
      file_path: z.string().describe('The path to the file to read'),
    }).shape,
  },
  async ({ file_path }) => {
    try {
      const fullPath = path.resolve(process.cwd(), file_path);
      if (!fs.existsSync(fullPath)) {
        return {
          isError: true,
          content: [{ type: 'text', text: `File not found: ${file_path}` }],
        };
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const actionsSection = findActionsSection(content);

      if (actionsSection) {
        return {
          content: [
            {
              type: 'text',
              text: `Extracted Actions Section:\n\n${actionsSection.trim()}`,
            },
          ],
        };
      }

      // Fallback: return full content (truncated if necessary)
      const truncated =
        content.length > 10000
          ? content.slice(0, 10000) + '... [truncated]'
          : content;
      return {
        content: [
          {
            type: 'text',
            text: `No specific "Actions" section found. Returning full content:\n\n${truncated}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          { type: 'text', text: `Failed to read file: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: git_branch_from_task
server.registerTool(
  'git_branch_from_task',
  {
    description:
      'Create a git branch based on a task ID. Uses the task description to generate a kebab-case branch name.',
    inputSchema: z.object({
      id: z.string().describe('The unique ID of the task'),
    }).shape,
  },
  async ({ id }) => {
    try {
      const tasks = getTasks();
      const task = tasks.find((t) => t.id === id);

      if (!task) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Task with ID ${id} not found.` }],
        };
      }

      const branchName = slugify(task.text);
      if (!branchName) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Could not generate a valid branch name from task text: "${task.text}"`,
            },
          ],
        };
      }

      // Check if inside a git repo (simple check)
      try {
        await execAsync('git rev-parse --is-inside-work-tree');
      } catch {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Current directory is not a git repository.',
            },
          ],
        };
      }

      await execAsync(`git checkout -b ${branchName}`);

      return {
        content: [
          {
            type: 'text',
            text: `Successfully created and checked out branch: ${branchName}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          { type: 'text', text: `Failed to create branch: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: search_tasks
server.registerTool(
  'search_tasks',
  {
    description:
      'Search for tasks by text or tag. Useful for finding specific tasks without listing everything.',
    inputSchema: z.object({
      query: z.string().describe('Search query (text substring or @tag)'),
    }).shape,
  },
  async ({ query }) => {
    const tasks = searchTasks(query);
    if (tasks.length === 0) {
      return {
        content: [
          { type: 'text', text: `No tasks found matching "${query}".` },
        ],
      };
    }

    const taskList = tasks
      .map(
        (t, i) =>
          `${i + 1}. [${t.completed ? '✔' : ' '}] ${t.text} (${t.priority}) - ID: ${t.id}`
      )
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `--- Search Results ("${query}") ---\n${taskList}`,
        },
      ],
    };
  }
);

// Tool: get_all_tags
server.registerTool(
  'get_all_tags',
  {
    description:
      'Get a list of all tags currently used in the task list. Useful for maintaining consistent categorization.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    const tags = getAllTags();
    return {
      content: [
        {
          type: 'text',
          text:
            tags.length > 0
              ? `Current Tags: ${tags.map((t) => `@${t}`).join(', ')}`
              : 'No tags found.',
        },
      ],
    };
  }
);

// Tool: set_task_status
server.registerTool(
  'set_task_status',
  {
    description:
      'Explicitly set the status of a task (pending, in_progress, completed).',
    inputSchema: z.object({
      id: z.string().describe('The unique ID of the task'),
      status: z
        .enum(['pending', 'in_progress', 'completed'])
        .describe('The new status for the task'),
    }).shape,
  },
  async ({ id, status }) => {
    try {
      const updated = updateTask(id, { status: status as TaskStatus });
      if (!updated) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Task with ID ${id} not found.` }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: `Successfully set task ${id} status to ${status}.`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          { type: 'text', text: `Failed to set task status: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: update_task
server.registerTool(
  'update_task',
  {
    description:
      'Update an existing task by its ID. You can change text, priority, or due date.',
    inputSchema: z.object({
      id: z.string().describe('The unique ID of the task'),
      text: z.string().optional().describe('New description for the task'),
      priority: z
        .enum(['low', 'medium', 'high'])
        .optional()
        .describe('New priority'),
      due_date: z
        .string()
        .optional()
        .describe(
          'New due date (natural language or ISO). Use "none" to clear.'
        ),
    }).shape,
  },
  async ({ id, text, priority, due_date }) => {
    try {
      let parsedDueDate: string | undefined | null = undefined;
      if (due_date) {
        if (due_date.toLowerCase() === 'none') {
          parsedDueDate = null; // Signal to clear it
        } else {
          parsedDueDate = parseDate(due_date);
          if (!parsedDueDate) {
            return {
              isError: true,
              content: [
                { type: 'text', text: `Failed to parse due date: ${due_date}` },
              ],
            };
          }
        }
      }

      const updated = updateTask(id, {
        text,
        priority: priority as TaskPriority | undefined,
        dueDate: parsedDueDate || undefined,
      });

      if (!updated) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Task with ID ${id} not found.` }],
        };
      }

      return {
        content: [{ type: 'text', text: `Successfully updated task ${id}.` }],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          { type: 'text', text: `Failed to update task: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: scan_todos
server.registerTool(
  'scan_todos',
  {
    description:
      'Scan the codebase (or specific directory) for TODO, FIXME, and BUG comments.',
    inputSchema: z.object({
      path: z
        .string()
        .optional()
        .describe('Relative path to scan (defaults to current directory)'),
    }).shape,
  },
  async ({ path: relPath }) => {
    try {
      const targetPath = relPath
        ? path.resolve(process.cwd(), relPath)
        : process.cwd();
      const todos = scanDirectory(targetPath);

      if (todos.length === 0) {
        return {
          content: [
            { type: 'text', text: 'No TODOs found in the scanned path.' },
          ],
        };
      }

      const formattedTodos = todos
        .map((t) => `[${t.type}] ${t.text} (${t.file}:${t.line})`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${todos.length} items:\n${formattedTodos}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          { type: 'text', text: `Failed to scan for todos: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: bulk_add_tasks
server.registerTool(
  'bulk_add_tasks',
  {
    description:
      'Add multiple tasks at once. Useful when converting found TODOs into tasks.',
    inputSchema: z.object({
      tasks: z
        .array(
          z.object({
            text: z.string(),
            priority: z.enum(['low', 'medium', 'high']).default('medium'),
            due_date: z.string().optional(),
          })
        )
        .describe('List of tasks to add'),
    }).shape,
  },
  async ({ tasks }) => {
    try {
      const tasksToAdd = tasks.map((t) => ({
        text: t.text,
        priority: t.priority as TaskPriority,
        dueDate: t.due_date ? parseDate(t.due_date) || undefined : undefined,
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
        content: [
          { type: 'text', text: `Failed to bulk add tasks: ${error.message}` },
        ],
      };
    }
  }
);

// Tool: add_task
server.registerTool(
  'add_task',
  {
    description:
      'Add a new task with an optional priority (high, medium, low) and optional due date (e.g. "tomorrow", "2025-12-25"). Use @tags in the text for categorization.',
    inputSchema: z.object({
      text: z.string().describe('The task description'),
      priority: z
        .enum(['low', 'medium', 'high'])
        .default('medium')
        .describe('Task priority'),
      due_date: z
        .string()
        .optional()
        .describe('Optional due date in natural language or ISO format'),
    }).shape,
  },
  async ({ text, priority, due_date }) => {
    try {
      const parsedDueDate = due_date ? parseDate(due_date) : undefined;
      const task = addTask(
        text,
        priority as TaskPriority,
        parsedDueDate || undefined
      );

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
        content: [
          { type: 'text', text: `Failed to add task: ${error.message}` },
        ],
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
      due_before: z
        .string()
        .optional()
        .describe('Filter tasks due before this date'),
      due_after: z
        .string()
        .optional()
        .describe('Filter tasks due after this date'),
    }).shape,
  },
  async ({ due_before, due_after }) => {
    let tasks = getTasks();

    if (due_before) {
      const beforeDate = parseDate(due_before);
      if (beforeDate) {
        const beforeTime = new Date(beforeDate).getTime();
        tasks = tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate).getTime() < beforeTime
        );
      }
    }

    if (due_after) {
      const afterDate = parseDate(due_after);
      if (afterDate) {
        const afterTime = new Date(afterDate).getTime();
        tasks = tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate).getTime() > afterTime
        );
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
        content: [
          { type: 'text', text: `Failed to toggle task: ${error.message}` },
        ],
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
        content: [
          { type: 'text', text: `Failed to delete task: ${error.message}` },
        ],
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
        content: [
          {
            type: 'text',
            text: `Failed to clear completed tasks: ${error.message}`,
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
