# Implementation Plan - Core Enhancements

## Phase 1: Foundation & Data Layer
- [x] Task: Update Zod schema in `store.ts` to include optional `dueDate` field. bf6234a
- [x] Task: Install `date-fns` and create a utility helper for date parsing/formatting. df42093
- [x] Task: Update `addTask` function to accept and store `dueDate`. 0c5bad3
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Data Layer' (Protocol in workflow.md)

## Phase 2: CLI Implementation
- [x] Task: Update `src/index.tsx` argument parsing to handle `--due` or `-d` flags.
- [x] Task: Implement natural language date parsing for CLI input.
- [x] Task: Update `list` command to display due dates in the output.
- [x] Task: Update `list` command to support sorting by due date.
- [x] Task: Conductor - User Manual Verification 'Phase 2: CLI Implementation' (Protocol in workflow.md)

## Phase 3: GUI Implementation
- [x] Task: Update Task Item component to render due dates with visual indicators (e.g., color-coded for overdue).
- [x] Task: Add input field for due date in the "Add Task" form.
- [x] Task: Implement sorting logic in the GUI state management to prioritize by due date.
- [x] Task: Conductor - User Manual Verification 'Phase 3: GUI Implementation' (Protocol in workflow.md)

## Phase 4: AI & MCP Integration
- [x] Task: Update `add_task` MCP tool to accept `due_date` argument.
- [x] Task: Update `list_tasks` MCP tool to accept `due_before` and `due_after` filters.
- [x] Task: Verify end-to-end AI agent flow with new date capabilities.
- [x] Task: Conductor - User Manual Verification 'Phase 4: AI & MCP Integration' (Protocol in workflow.md)
