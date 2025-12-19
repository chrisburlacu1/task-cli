# Implementation Plan - Focus Mode

## Phase 1: Data Layer & Schema Migration
- [x] Task: Update `TaskSchema` and `Task` type in `src/store.ts` to include `status`. af1ca47
- [x] Task: Implement migration logic to map existing `completed: boolean` to the new `status` enum. 248f1d8
- [x] Task: Update existing CRUD functions (`addTask`, `toggleTask`, etc.) to handle the `status` field. 248f1d8
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Layer' (Protocol in workflow.md) [checkpoint: 7633303]

## Phase 2: MCP Tooling
- [x] Task: Register `set_task_status` MCP tool in `src/mcp-server.ts`. 6fe75ed
- [x] Task: Verify tool via unit tests or script. a45f909
- [x] Task: Conductor - User Manual Verification 'Phase 2: MCP Tooling' (Protocol in workflow.md) [checkpoint: eef1c6b]

## Phase 3: CLI & GUI Implementation
- [x] Task: Update `src/index.tsx` (CLI) to support `start` and `stop` commands and update `list` output. 1fce22d
- [x] Task: Update `src/gui.tsx` (TUI) to render visual indicators for `in_progress` tasks. 1fce22d
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Implementation' (Protocol in workflow.md) [checkpoint: 622479b]