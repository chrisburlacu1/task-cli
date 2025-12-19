# task-cli

A high-performance, dual-mode (CLI & GUI) Task Manager built with TypeScript, React, and Ink.

## Project Overview

**task-cli** provides a seamless way to manage tasks directly from the terminal. It features two modes of operation:
1.  **Fast Path CLI**: Direct subcommands (e.g., `tasks add "Buy milk"`) for quick interactions (<100ms startup).
2.  **Interactive GUI**: A rich, interactive terminal interface built with React and Ink for browsing and managing the task list.

### Key Technologies

-   **Runtime**: Node.js
-   **Language**: TypeScript
-   **UI Framework**: [Ink](https://github.com/vadimdemedes/ink) (React for CLI)
-   **State Management**: `conf` (Local file persistence)
-   **Validation**: `zod`
-   **MCP Integration**: Includes a Model Context Protocol (MCP) server for AI agent integration.

## Building and Running

### Prerequisites

-   Node.js (LTS recommended)
-   npm

### Commands

*   **Install Dependencies**:
    ```bash
    npm install
    ```

*   **Build Project**:
    Compiles TypeScript to JavaScript in the `dist/` folder.
    ```bash
    npm run build
    ```

*   **Run Development Version**:
    Uses `tsx` to run the source directly.
    ```bash
    npm start
    # or to pass arguments:
    npm start -- list
    ```

*   **Link Globally**:
    Allows you to use the `tasks` command system-wide.
    ```bash
    npm link
    ```

## Usage

### Interactive Mode
Run without arguments to enter the TUI (Terminal User Interface).
```bash
tasks
```
*   `a`: Add task
*   `s`: Search
*   `space`/`enter`: Toggle completion
*   `d`: Delete
*   `c`: Clear completed
*   `q`: Quit

### CLI Mode
Perform atomic actions without entering the interactive mode.
```bash
tasks add "Review PR" --high  # Add high priority task
tasks list                    # List all tasks
tasks done 1                  # Toggle task #1
tasks rm 1                    # Remove task #1
tasks clear                   # Clear completed tasks
```

## Codebase Structure

*   `src/index.tsx`: **Entry Point**. Parses command-line arguments. Dispatches to specific CLI handlers (`add`, `list`, etc.) or dynamically imports/starts the GUI.
*   `src/store.ts`: **Data Layer**. Manages data persistence using `conf`. Defines the Zod schema for tasks and exports CRUD functions (`addTask`, `getTasks`, `toggleTask`, etc.).
*   `src/gui.tsx`: **UI Layer**. Contains the Ink/React components for the interactive mode.
*   `src/theme.ts`: **Styling**. Centralized theme configuration (ANSI colors, styles).
*   `src/mcp-server.ts`: **AI Integration**. Implements an MCP server that exposes task management tools (`add_task`, `list_tasks`, etc.) to AI assistants.

## Development Conventions

*   **Dynamic Imports**: The GUI is heavy. It is imported dynamically in `src/index.tsx` only when needed to keep the CLI commands fast.
*   **Persistence**: Data is stored locally on the user's machine. The schema is strictly validated using `zod` in `store.ts`.
*   **Tags**: Tags are parsed from the task text (anything starting with `@`).
*   **Priorities**: Supported priorities are `low`, `medium`, and `high`.

## Gemini Integration (MCP)

This project contains a `src/mcp-server.ts` file which defines tools for the Gemini agent.

**Available Tools:**
*   `add_task`: Add a task with optional priority (`high`, `medium`, `low`).
*   `list_tasks`: View the current list.
*   `toggle_task`: Mark as done/undone by ID.
*   `delete_task`: Remove a task by ID.
*   `clear_completed`: Bulk delete completed tasks.

When helping the user, you can use these tools to directly manipulate their task list if the MCP server is connected.
