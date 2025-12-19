import {
  getTasks,
  addTask,
  actionByIndex,
  clearCompleted,
  TaskPriority,
} from "./store.js";
import { THEME_ANSI } from "./theme.js";
import { parseDate, formatDate } from "./utils/dateUtils.js";

// --- Short aliases for cleaner code ---
const PRIMARY = THEME_ANSI.primary;
const RESET = THEME_ANSI.reset;
const BOLD = THEME_ANSI.bold;

const handleCli = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    // Dynamic import for GUI to save startup time for simple CLI commands
    const { startGui } = await import("./gui.js");
    startGui();
    return;
  }

  console.log();
  switch (command) {
    case "add": {
      let priority: TaskPriority = "medium";
      let dueDate: string | undefined = undefined;
      const textArgs: string[] = [];

      for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--high") {
          priority = "high";
          continue;
        }
        if (arg === "--medium") {
          priority = "medium";
          continue;
        }
        if (arg === "--low") {
          priority = "low";
          continue;
        }
        if (arg === "--due" || arg === "-d") {
          const nextArg = args[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            const parsed = parseDate(nextArg);
            if (parsed) {
              dueDate = parsed;
              i++; // skip next arg
              continue;
            } else {
              console.warn(`Warning: Could not parse date "${nextArg}". Ignoring due date.`);
            }
          }
        }
        textArgs.push(arg);
      }

      const text = textArgs.join(" ");
      if (!text) {
        console.error(
          "Error: Please provide task text. Usage: tasks add <text> [--high|--medium|--low] [--due <date>]"
        );
        process.exit(1);
      }
      addTask(text, priority, dueDate);
      console.log(`${PRIMARY}✔ Added task:${RESET} ${text} (${priority})${dueDate ? ` [Due: ${formatDate(dueDate)}]` : ""}`);
      process.exit(0);
      break;
    }
    case "done": {
      const idx = parseInt(args[1]) - 1;
      if (isNaN(idx)) {
        console.error("Error: Please provide a valid task number.");
        process.exit(1);
      }
      if (actionByIndex(idx, "toggle")) {
        console.log(`${PRIMARY}✔ Toggled task status.${RESET}`);
      } else {
        console.error("Error: Task not found.");
      }
      process.exit(0);
      break;
    }
    case "rm": {
      const idx = parseInt(args[1]) - 1;
      if (isNaN(idx)) {
        console.error("Error: Please provide a valid task number.");
        process.exit(1);
      }
      if (actionByIndex(idx, "delete")) {
        console.log(`${PRIMARY}✔ Deleted task.${RESET}`);
      } else {
        console.error("Error: Task not found.");
      }
      process.exit(0);
      break;
    }
    case "clear": {
      clearCompleted();
      console.log(`${PRIMARY}✔ Cleared all completed tasks.${RESET}`);
      process.exit(0);
      break;
    }
    case "list": {
      const sortArg = args.find((_, i) => args[i-1] === "--sort");
      const tasks = getTasks();
      if (tasks.length === 0) {
        console.log("No tasks found.");
      } else {
        console.log(`${PRIMARY}${BOLD}--- Current Tasks ---${RESET}`);

        // Sorting: High -> Med -> Low, then incomplete before complete
        const sorted = [...tasks].sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          
          if (sortArg === "due") {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }

          const priorities = { high: 0, medium: 1, low: 2 };
          return priorities[a.priority] - priorities[b.priority];
        });

        sorted.forEach((t, i) => {
          const dueStr = t.dueDate ? ` [Due: ${formatDate(t.dueDate)}]` : "";
          const text = `${i + 1}. ${t.text} (${t.priority})${dueStr}`;
          console.log(
            t.completed
              ? `${THEME_ANSI.strikethrough}${text}${THEME_ANSI.resetStrikethrough}`
              : text
          );
        });
      }
      process.exit(0);
      break;
    }
    case "help":
    default:
      console.log(`${PRIMARY}Task CLI - Usage:${RESET}`);
      console.log("  tasks                         - Open interactive GUI");
      console.log(
        "  tasks add <t> [--p] [--due d] - Add task (+ optional --high/medium/low, --due/-d <date>)"
      );
      console.log("  tasks list [--sort due]       - List all tasks (optional sort)");
      console.log("  tasks done <num>              - Toggle task completion by number");
      console.log("  tasks rm <num>                - Delete task by number");
      console.log("  tasks clear                   - Clear all completed tasks");
      process.exit(0);
  }
};

handleCli();
