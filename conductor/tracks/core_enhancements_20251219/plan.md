# Implementation Plan - Core Enhancements

## Phase 1: Foundation & Data Layer
- [x] Task: Update Zod schema in `store.ts` to include optional `dueDate` field. bf6234a
- [x] Task: Install `date-fns` and create a utility helper for date parsing/formatting. df42093
- [x] Task: Update `addTask` function to accept and store `dueDate`. 0c5bad3
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Data Layer' (Protocol in workflow.md)

## Phase 2: CLI Implementation
- [ ] Task: Update `src/index.tsx` argument parsing to handle `--due` or `-d` flags.
- [ ] Task: Implement natural language date parsing for CLI input.
- [ ] Task: Update `list` command to display due dates in the output.
- [ ] Task: Update `list` command to support sorting by due date.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: CLI Implementation' (Protocol in workflow.md)

## Phase 3: GUI Implementation
- [ ] Task: Update Task Item component to render due dates with visual indicators (e.g., color-coded for overdue).
- [ ] Task: Add input field for due date in the "Add Task" form.
- [ ] Task: Implement sorting logic in the GUI state management to prioritize by due date.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: GUI Implementation' (Protocol in workflow.md)

## Phase 4: AI & MCP Integration
- [ ] Task: Update `add_task` MCP tool to accept `due_date` argument.
- [ ] Task: Update `list_tasks` MCP tool to accept `due_before` and `due_after` filters.
- [ ] Task: Verify end-to-end AI agent flow with new date capabilities.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: AI & MCP Integration' (Protocol in workflow.md)
