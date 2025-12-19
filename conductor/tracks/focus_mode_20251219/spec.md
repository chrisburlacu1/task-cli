# Specification - Focus Mode (In-Progress Tasks)

## Overview
Introduce an "In-Progress" state for tasks to help users and AI agents track active work. This bridges the gap between a task being "Pending" and "Completed," providing better context for what is being worked on *now*.

## Functional Requirements
1.  **Schema Update (`store.ts`)**:
    *   Add a `status` field to the Task object: `pending` (default), `in_progress`, or `completed`.
    *   *Backward Compatibility:* Existing `completed: boolean` should be mapped or replaced by this new status.
2.  **MCP Tool: `set_task_status`**:
    *   **Input:** `id` (string), `status` (enum: `pending`, `in_progress`, `completed`).
    *   **Behavior:** Explicitly updates the state of a task.
3.  **GUI Enhancement (`gui.tsx`)**:
    *   Display a visual indicator (e.g., `▶` or a specific color) next to `in_progress` tasks.
4.  **CLI Enhancement (`index.tsx`)**:
    *   The `list` command should display the new status.
    *   Add `tasks start <num>` and `tasks stop <num>` as convenient aliases for the CLI.

## Acceptance Criteria
*   Tasks can exist in three distinct states: Pending, In-Progress, and Completed.
*   The `set_task_status` MCP tool correctly modifies a task's state.
*   The GUI clearly highlights "In-Progress" tasks.
*   CLI `list` output accurately reflects the current status of each task.

## Out of Scope
*   Automated time tracking (this can be a separate track later).
*   Automatic status changes based on Git activity.
