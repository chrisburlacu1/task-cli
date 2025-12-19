# SOSH.md: Task CLI Project Context

## 📂 Project Overview

**Project Name:** Task CLI
**Description:** A premium, high-performance CLI Task Manager built with React, Ink, and TypeScript. Features a snappy terminal interface and a beautiful, interactive GUI mode.
**Primary Use Case:** Task management with priority systems, search, and visual progress tracking.

## 🧱 Technology Stack
- **Framework:** React (with Ink for CLI) + TypeScript
- **State Management:** `conf` (local persistence)
- **Validation:** `zod`
- **Utilities:** `date-fns`, `nanoid`
- **Build System:** Node.js + npm

## 📁 Directory Structure
```
.
├───.gitignore
├───GEMINI.md
├───LICENSE
├───package.json
├───README.md
├───sosh-extension.json
├───SOSH.md
├───tsconfig.json
├───dist
├───node_modules
└───src
    ├───gui.tsx
    ├───index.tsx
    ├───mcp-server.ts
    ├───store.ts
    └───theme.ts
```

## 📦 Building & Running
### Installation
```bash
git clone https://github.com/chrisburlacu1/task-cli.git
npm install
npm run build
npm link
```

### Execution
```bash
# CLI mode
tasks

# GUI mode
tasks --gui
```

## 📝 Development Conventions
- **TypeScript:** Enforced via `tsconfig.json`
- **CLI Interface:** Built with Ink (React for CLI)
- **Task Storage:** Local persistence via `conf`
- **Testing:** Inferred from `package.json` scripts (add `npm test` to verify)
- **Theming:** Customizable in `src/theme.ts`

## 📌 Key Files
- **src/gui.tsx:** Main CLI interface logic
- **src/index.tsx:** Entry point for GUI mode
- **src/mcp-server.ts:** Likely handles server-side task sync
- **src/store.ts:** State management for tasks
- **src/theme.ts:** Customization of visual themes
- **package.json:** Contains build scripts and dependencies

## 📌 Gemini CLI Integration
This project includes a Gemini CLI extension for:
- Adding tasks with priorities (`@work`, `@personal`)
- Listing and toggling task states
- Clearing completed tasks
- Deleting specific tasks

## 📌 Notes
- The project uses dynamic imports for optimized CLI startup
- Interactive GUI mode provides real-time task updates
- Priority system organizes tasks by `high`, `medium`, or `low`

For full documentation, see the [README.md](README.md) file.