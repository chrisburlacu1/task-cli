# Tech Stack - task-cli

## Core Runtime & Language
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode) - Ensuring type safety across CLI and GUI components.
- **Runtime:** [Node.js](https://nodejs.org/) - Leveraging the massive ecosystem of terminal utilities and libraries.

## User Interface (TUI)
- **Framework:** [Ink](https://github.com/vadimdemedes/ink) - Bringing the power of React to the terminal for component-based UI development.
- **Components:** Custom Ink components integrated with `ink-text-input` and `ink-select-input` for interactive data entry.

## State Management & Persistence
- **Storage:** [conf](https://github.com/sindresorhus/conf) - Simple, cross-platform local persistence for task data.
- **Validation:** [Zod](https://zod.dev/) - Ensuring data integrity and schema validation for task storage and MCP tool parameters.

## AI & Agent Integration
- **Protocol:** [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - Exposing task management tools to AI agents for automated interaction.

## Development & Build Tools
- **Transpiler:** `tsx` for rapid development and `tsc` for production builds.
- **Utilities:** `date-fns` for robust date manipulation and `nanoid` for unique ID generation.
