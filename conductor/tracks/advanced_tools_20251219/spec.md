# Specification - Advanced Task Management Tools

## 1. Get All Tags (`get_all_tags`)
### Goal
Provide the AI with the user's existing taxonomy to prevent tag fragmentation (e.g., using `@ui` vs `@frontend`).
### Implementation
- **Logic:** Iterate all tasks, collect all tags, return unique set sorted alphabetically.
- **MCP Tool:**
  - Name: `get_all_tags`
  - Input: None.
  - Returns: List of strings (e.g., `["@bug", "@ui", "@work"]`).

## 2. Search Tasks (`search_tasks`)
### Goal
Allow agents to find specific tasks without retrieving the entire list, saving context tokens.
### Implementation
- **Logic:**
  - Case-insensitive substring match on `text`.
  - Exact (case-insensitive) match on `tags`.
- **MCP Tool:**
  - Name: `search_tasks`
  - Input: `query` (string).
  - Returns: Formatted list of matching tasks.

## 3. Git Branch from Task (`git_branch_from_task`)
### Goal
Automate the "Pick up task" workflow.
### Implementation
- **Logic:**
  - Find task by ID.
  - Generate branch name: `kebab-case-description` (e.g., `fix-login-error`).
  - Exec: `git checkout -b <branch_name>`.
- **MCP Tool:**
  - Name: `git_branch_from_task`
  - Input: `id` (string).
  - Returns: Success message with branch name.
