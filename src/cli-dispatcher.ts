import { Command } from 'commander';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  clearCompleted,
  getSortedTasks,
  TaskPriority,
  TaskStatus,
} from './store/store.js';
import { getArchivedTasks, archiveTasks } from './store/archive-store.js';
import { THEME_ANSI } from './theme.js';
import { parseDate, formatDate } from './utils/dateUtils.js';
import { resolveTaskId } from './utils/commandUtils.js';
import { formatDistanceToNow } from 'date-fns';

const PRIMARY = THEME_ANSI.primary;
const RESET = THEME_ANSI.reset;
const BOLD = THEME_ANSI.bold;

export interface CommandResult {
  success: boolean;
  messages: string[];
  error?: string;
  exitCode?: number;
}

export const dispatchCommand = (args: string[]): CommandResult => {
  const program = new Command();
  let result: CommandResult = { success: false, messages: [] };

  program
    .name('tasks')
    .description('CLI Task Manager')
    .exitOverride()
    .configureOutput({
      writeOut: (str) => result.messages.push(str.trim()),
      writeErr: (str) => {
        result.error = str.trim();
        result.success = false;
      },
    });

  program
    .command('add <text...>')
    .description('Add a new task')
    .option('--high', 'Set high priority')
    .option('--medium', 'Set medium priority (default)')
    .option('--low', 'Set low priority')
    .option('-d, --due <date>', 'Set a due date')
    .action((textArr, options) => {
      const text = textArr.join(' ');
      let priority: TaskPriority = 'medium';
      if (options.high) priority = 'high';
      if (options.low) priority = 'low';

      let dueDate: string | undefined;
      if (options.due) {
        const parsed = parseDate(options.due);
        if (parsed) {
          dueDate = parsed;
        } else {
          result.messages.push(
            `Warning: Could not parse date "${options.due}". Ignoring due date.`
          );
        }
      }

      addTask(text, priority, dueDate);
      result.success = true;
      result.messages.push(
        `${PRIMARY}✔ Added task:${RESET} ${text} (${priority})${
          dueDate ? ` [Due: ${formatDate(dueDate)}]` : ''
        }`
      );
    });

  program
    .command('list')
    .description('List current tasks')
    .option('--sort <type>', 'Sort by field (e.g., due)')
    .action((options) => {
      const sorted = getSortedTasks(options.sort);
      if (sorted.length === 0) {
        result.messages.push('No tasks found.');
      } else {
        result.messages.push(`${PRIMARY}${BOLD}--- Current Tasks ---${RESET}`);
        sorted.forEach((t, i) => {
          const statusIcon = t.status === 'in_progress' ? '▶ ' : '  ';
          const dueStr = t.dueDate ? ` [Due: ${formatDate(t.dueDate)}]` : '';
          const text = `${i + 1}. ${statusIcon}${t.text} (${t.priority})${dueStr}`;
          result.messages.push(
            t.completed
              ? `${THEME_ANSI.strikethrough}${text}${THEME_ANSI.resetStrikethrough}`
              : text
          );
        });
      }
      result.success = true;
    });

  program
    .command('start <num>')
    .description('Set task status to in-progress')
    .action((num) => {
      const idx = parseInt(num);
      const id = resolveTaskId(idx);
      if (id && updateTask(id, { status: 'in_progress' })) {
        result.success = true;
        result.messages.push(`${PRIMARY}✔ Task started.${RESET}`);
      } else {
        result.error = 'Error: Task not found.';
      }
    });

  program
    .command('stop <num>')
    .description('Set task status to pending')
    .action((num) => {
      const idx = parseInt(num);
      const id = resolveTaskId(idx);
      if (id && updateTask(id, { status: 'pending' })) {
        result.success = true;
        result.messages.push(`${PRIMARY}✔ Task stopped.${RESET}`);
      } else {
        result.error = 'Error: Task not found.';
      }
    });

  program
    .command('done <num>')
    .description('Toggle task completion')
    .action((num) => {
      const idx = parseInt(num);
      const id = resolveTaskId(idx);
      if (id) {
        const tasks = getTasks();
        const task = tasks.find((t) => t.id === id);
        if (task) {
          updateTask(id, { status: task.completed ? 'pending' : 'completed' });
          result.success = true;
          result.messages.push(`${PRIMARY}✔ Toggled task status.${RESET}`);
          return;
        }
      }
      result.error = 'Error: Task not found.';
    });

  program
    .command('rm <num>')
    .description('Delete a task')
    .action((num) => {
      const idx = parseInt(num);
      const id = resolveTaskId(idx);
      if (id) {
        deleteTask(id);
        result.success = true;
        result.messages.push(`${PRIMARY}✔ Deleted task.${RESET}`);
      } else {
        result.error = 'Error: Task not found.';
      }
    });

  program
    .command('clear')
    .description('Delete all completed tasks')
    .action(() => {
      const removed = clearCompleted();
      result.success = true;
      result.messages.push(
        `${PRIMARY}✔ Cleared ${removed.length} completed tasks.${RESET}`
      );
    });

  program
    .command('archive')
    .description('Archive all completed tasks')
    .action(() => {
      const removed = clearCompleted();
      if (removed.length === 0) {
        result.success = true;
        result.messages.push('No completed tasks to archive.');
      } else {
        archiveTasks(removed);
        result.success = true;
        result.messages.push(
          `${PRIMARY}✔ Archived ${removed.length} completed tasks.${RESET}`
        );
      }
    });

  program
    .command('history')
    .description('View archived tasks')
    .action(() => {
      const tasks = getArchivedTasks();
      if (tasks.length === 0) {
        result.messages.push('No archived tasks found.');
      } else {
        result.messages.push(`${PRIMARY}${BOLD}--- Task History ---${RESET}`);
        [...tasks].reverse().forEach((t, i) => {
          result.messages.push(
            `${i + 1}. ${t.text} (${t.priority}) - ${formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}`
          );
        });
      }
      result.success = true;
    });

  try {
    program.parse(args, { from: 'user' });
  } catch (err: any) {
    if (err.code === 'commander.helpDisplayed') {
      result.success = true;
    } else {
      result.success = false;
      if (!result.error) result.error = err.message;
    }
  }

  return result;
};
