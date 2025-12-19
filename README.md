# Task CLI 🚀

A premium, high-performance CLI Task Manager built with **React**, **Ink**, and **TypeScript**. Features a snappy terminal interface and a beautiful, interactive GUI mode.

## ✨ Features

- **Blazing Fast CLI**: Optimized startup using dynamic imports. CLI commands run in <100ms.
- **Interactive GUI**: A stunning React-based terminal UI with real-time updates.
- **Due Dates**: Set and track deadlines with natural language parsing (e.g., "tomorrow", "next friday").
- **Priority System**: Organize tasks by `high`, `medium`, or `low` priority.
- **Search & Filter**: Find tasks instantly with text or `@tag` search.
- **Intelligent Sorting**: Smart prioritization by due date, priority, and completion status.
- **Codebase Scanner**: Automatically discover `TODO`, `FIXME`, and `BUG` comments in your code.
- **Visual Progress**: Real-time progress bar tracking your daily productivity.
- **Custom Theme**: Beautiful Pink aesthetics.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/chrisburlacu1/task-cli.git
cd task-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## 📖 Usage

### Interactive GUI Mode

Simply run the command with no arguments:

```bash
tasks
```

**Controls:**

- `a`: Add a new task
- `s`: Search tasks (text or `@tag`)
- `space` / `enter`: Toggle completion
- `d`: Delete selected task
- `c`: Clear all completed tasks
- `q`: Quit

### Command Line Mode (Fast Path)

Manage your tasks directly from the terminal with subcommands:

```bash
tasks add "Water the plants" --high --due tomorrow   # Add with priority & date
tasks list --sort due                                # List sorted by deadline
tasks done 1                                         # Toggle task #1
tasks rm 2                                           # Delete task #2
tasks clear                                          # Clear all completed tasks
```

## 🎨 Configuration

The theme can be customized in `src/theme.ts`. Change colors, text styles, and more to match your setup.

## 🗄️ Tech Stack

- **Framework**: [Ink](https://github.com/vadimdemedes/ink) (React for CLI)
- **Storage**: `conf` (Local persistence)
- **Validation**: `zod`
- **Utilities**: `date-fns`, `nanoid`

---

Built with ❤️ for rapid productivity using **Gemini 3 Flash**.
_(This project was entirely AI-generated)_

## 🤖 Gemini CLI Extension

You can also manage your tasks directly through the Gemini CLI!

### 1. Link the extension

In this directory, run:

```bash
gemini extensions link .
```

### 2. Available Tools

The Gemini agent will have access to:

- `add_task`: Add tasks with priorities, `@tags`, and **due dates**.
- `list_tasks`: See everything on your plate, with optional date filtering.
- `update_task`: Modify existing tasks (text, priority, due date).
- `get_all_tags`: See all tags currently in use.
- `search_tasks`: Smart fuzzy search to find tasks without listing everything.
- `git_branch_from_task`: Create a git branch directly from a task ID.
- `scan_todos`: Scan your codebase for `TODO`/`FIXME` comments.
- `read_meeting_actions`: Extract tasks from a meeting notes file intelligently.
- `bulk_add_tasks`: Convert multiple scanned items into tasks in one turn.
- `toggle_task`: Mark tasks as done/pending.
- `delete_task`: Remove tasks.
- `clear_completed`: Bulk clean-up.

Ask Gemini: _"Find the login task and create a branch for it."_
