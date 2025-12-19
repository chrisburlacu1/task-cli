# Track Specification: Core Enhancements

## 1. Overview
This track focuses on enhancing the `task-cli` application by introducing robust metadata support (specifically due dates) and deepening the integration with AI agents. These features align with the product goal of creating a "premium" and "AI-native" task manager.

## 2. Objectives
- **Implement Due Dates:** Allow users to attach due dates to tasks via CLI and GUI.
- **Enhance MCP Server:** Update the Model Context Protocol tools to support due date parsing and filtering.
- **Smart Sorting:** Update the `list` command and GUI to sort tasks by due date and priority.
- **Natural Language Parsing:** Enable the CLI to understand natural language dates (e.g., "next Friday").

## 3. User Stories
- As a user, I want to add a task with a due date so that I can track deadlines.
- As a user, I want to see tasks sorted by urgency (due date + priority) so I know what to work on first.
- As an AI agent, I want to filter tasks by a date range so I can help the user plan their week.
- As a user, I want to type "Buy milk tomorrow" and have the system automatically set the due date.

## 4. Technical Requirements
- **Storage Schema:** Update `zod` schema in `store.ts` to include an optional `dueDate` field (ISO string).
- **Date Library:** Utilize `date-fns` for parsing and formatting.
- **CLI Parsing:** Update CLI argument parsing to detect date flags (e.g., `--due`, `-d`) or natural language cues.
- **MCP Tool Updates:**
    - `add_task`: Add `due_date` parameter.
    - `list_tasks`: Add `due_before` and `due_after` filter parameters.
