# Specification - Intelligent Meeting Action Importer

## Overview
This feature adds a specialized MCP tool, `read_meeting_actions`, designed to facilitate the extraction of tasks from meeting notes or project documents. The tool optimizes the workflow by attempting to locate specific "Action Items" sections within a file, allowing the AI agent to efficiently extract tasks with inferred priorities and due dates.

## Functional Requirements
1.  **New MCP Tool: `read_meeting_actions`**
    *   **Input:** `file_path` (string) - Path to the text or markdown file.
    *   **Behavior:**
        1.  Verifies the file exists and is readable.
        2.  Scans the file for headers like `## Actions`, `Action Items:`, or `## Action Items`.
        3.  If a relevant section is found, it returns the text of that section.
        4.  If no specific section is found, it returns the full content of the file (up to a safe limit, e.g., 500 lines).
2.  **AI Workflow Integration:**
    *   The Agent (Gemini) will use `read_meeting_actions` to get the context.
    *   The Agent will use its internal reasoning to identify distinct tasks, inferring priorities (low, medium, high) and due dates from the textual context.
    *   The Agent will then use the existing `bulk_add_tasks` tool to commit these tasks to the store.

## Non-Functional Requirements
*   **Performance:** File reading should be instantaneous.
*   **Token Efficiency:** By targeting specific sections, the tool reduces the amount of unnecessary text sent to the LLM.

## Acceptance Criteria
*   The agent can successfully read a `.txt` or `.md` file.
*   The tool correctly extracts sections under "Actions" or "Action Items" headers.
*   The agent can correctly identify and add multiple tasks from a meeting notes file using `bulk_add_tasks`.
*   Priorities and due dates are correctly inferred and stored when mentioned in the notes (e.g., "Fix bug by tomorrow [high]").

## Out of Scope
*   Native CLI command for importing (this is an Agent-only tool).
*   Automatic deletion or modification of the source file.
