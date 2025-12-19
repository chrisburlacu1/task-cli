# Tech Stack

## Core Technologies

### Frameworks & Libraries
- **React**: For building the interactive GUI interface
- **Ink**: For creating the CLI interface with terminal-based UI
- **TypeScript**: For static typing and improved developer experience

### Storage & Persistence
- **Conf**: Local storage solution for task data persistence

### Validation & Utilities
- **Zod**: For schema validation of task data
- **Nanoid**: For generating unique task IDs
- **Date-fns**: For date and time manipulations

### Additional Dependencies
- **MCP SDK**: For server-side task synchronization (via @modelcontextprotocol/sdk)

## Development Tools
- **Node.js**: Runtime environment for JavaScript/TypeScript
- **npm**: Package manager for dependencies
- **Git**: Version control system

## Architecture
- **CLI Mode**: Lightweight, fast startup with dynamic imports
- **GUI Mode**: Full-featured React-based terminal interface with real-time updates
- **State Management**: Centralized task storage with Conf and React state management

## Notes
- All UI components follow Ink's best practices for terminal applications
- TypeScript configuration is optimized for React/Ink projects
- The MCP server provides additional synchronization capabilities for distributed task management