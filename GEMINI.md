# Task CLI Project Context

## Project Overview

**task-cli** is a high-performance CLI Task Manager built with TypeScript. It features a dual-interface architecture:
1.  **Fast Path CLI**: Instant execution of commands via `src/cli-dispatcher.ts`.
2.  **Interactive GUI**: A rich terminal UI built with **Ink** (React for CLI) in `src/gui.tsx`.

It also includes a **Gemini Extension** (`src/mcp-server.ts`) to allow the Gemini agent to interact with the task database directly.

## Tech Stack

-   **Language**: TypeScript
-   **UI Framework**: React / Ink (`ink`, `ink-text-input`, `ink-select-input`)
-   **Persistence**: `conf` (Local JSON file storage)
-   **Validation**: `zod`
-   **Utilities**: `date-fns`, `nanoid`, `commander`
-   **Testing**: `vitest`

## Architecture & Key Files

### Entry Point
-   `src/index.tsx`: Main entry point. It checks for CLI arguments. If present, it routes to `cli-dispatcher.ts` for fast execution. If absent, it dynamically imports `gui.tsx` to start the interactive UI.

### Core Logic
-   `src/store/store.ts`: **Central Data Store**. Handles all CRUD operations using `conf`.
    -   **Schema**: Tasks have `id`, `text`, `status` (pending/in_progress/completed), `priority` (low/medium/high), `dueDate`, `tags`, etc.
    -   **Tags**: Parsed automatically from text (e.g., "Buy milk @personal").
-   `src/cli-dispatcher.ts`: Handles subcommands (e.g., `tasks add`, `tasks list`).
-   `src/gui.tsx`: The interactive React application component.

### Gemini Extension (MCP)
-   `src/mcp-server.ts`: Implements the Model Context Protocol (MCP) server. Exposes tools like `add_task`, `list_tasks`, `scan_todos`, etc., to the Gemini CLI.
-   `gemini-extension.json`: Manifest file for the extension.

### Configuration
-   `src/config.ts`: App constants.
-   `src/theme.ts`: UI theme definitions (ANSI colors).

## Development Workflow

### Build & Run
-   **Build**: `npm run build` (Compiles TS to `dist/`)
-   **Start**: `npm start` (Runs `tsx src/index.tsx`)
-   **Link Extension**: `gemini extensions link .`

### Testing & Quality
-   **Test**: `npm test` (Runs Vitest)
-   **Lint**: `npm run lint` (ESLint)
-   **Format**: `npm run format` (Prettier)

## Coding Conventions
-   **State Management**: Direct calls to `src/store/store.ts` exported functions.
-   **Styling**: Use `src/theme.ts` for consistent colors.
-   **Components**: React components live in `src/components/`.
-   **Types**: Defined in `src/store/store.ts` (e.g., `Task`, `TaskStatus`).

## Common Tasks
-   **Adding a command**: Update `src/cli-dispatcher.ts` for CLI and potentially `src/mcp-server.ts` for AI access.
-   **Modifying Data Model**: Update Zod schema in `src/store/store.ts` and handle any necessary migrations.
