# Specification - AI & MCP Expansions

## 1. TODO Scanner (`scan_todos`)

### Goal
Allow AI agents to discover actionable tasks hidden in the codebase comments.

### Implementation Details
- **File Scanning:**
  - Use `fs.readdir` (recursive) or a glob library.
  - **Ignore:** `node_modules`, `.git`, `dist`, `.DS_Store`, and other common ignores.
- **Pattern Matching:**
  - Regex: `/\/\/\s*(TODO|FIXME|BUG):?\s*(.+)$/i` (supports `// TODO: fix this` and `// FIXME this`).
  - Capture: Type (TODO/FIXME), Text, File Path, Line Number.
- **MCP Tool Interface:**
  - Name: `scan_todos`
  - Arguments:
    - `path`: string (optional, default: current working directory)
  - Returns: Array of objects `{ file, line, type, text }`.

## 2. Bulk Add Tasks (`bulk_add_tasks`)

### Goal
Allow agents to convert a list of found TODOs into actual tasks in one go, preventing chat turn latency.

### Implementation Details
- **Store Update:**
  - Add `addTasks(tasks: {text, priority, dueDate}[])` to `store.ts`.
  - Should perform a single save to disk if possible (though `conf` might sync on each set, grouping is still cleaner).
- **MCP Tool Interface:**
  - Name: `bulk_add_tasks`
  - Arguments:
    - `tasks`: Array of `{ text: string, priority?: string, due_date?: string }`.
  - Returns: Summary string (e.g., "Successfully added 5 tasks").
