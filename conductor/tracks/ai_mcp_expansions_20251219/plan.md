# Implementation Plan - AI & MCP Expansions

## Phase 1: Foundation
- [x] Task: Create `src/utils/fileScanner.ts` to scan directories for text files.
- [x] Task: Implement regex matching for "TODO", "FIXME", "BUG" comments with context.

## Phase 2: TODO Scanner MCP Tool
- [x] Task: Register `scan_todos` tool in `src/mcp-server.ts`.
- [x] Task: Expose parameters for `path` (default to root) and `pattern` (optional custom regex).

## Phase 3: Bulk Operations MCP Tool
- [x] Task: Update `store.ts` to support `addMultipleTasks` (optimization).
- [x] Task: Register `bulk_add_tasks` tool in `src/mcp-server.ts`.
- [x] Task: Conductor - User Manual Verification 'AI & MCP Expansions' (Protocol in workflow.md)
