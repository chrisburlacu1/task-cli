# Implementation Plan - Intelligent Meeting Action Importer

## Phase 1: Tool Implementation
- [x] Task: Create `src/utils/meetingParser.ts` utility. c1da107
    - [x] Sub-task: Implement `findActionsSection(content: string): string` logic to regex match headers ("Actions", "Action Items") and extract content until the next header.
- [ ] Task: Register `read_meeting_actions` MCP tool in `src/mcp-server.ts`.
    - [ ] Sub-task: Define Zod schema for input (`file_path`).
    - [ ] Sub-task: Implement handler to read file and call `findActionsSection`.
    - [ ] Sub-task: Handle fallback (return full content) if no section found.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Tool Implementation' (Protocol in workflow.md)

## Phase 2: Workflow Verification
- [ ] Task: Create a test fixture file `test/fixtures/meeting_notes.md` with a clear "Actions" section and priorities.
- [ ] Task: Create an automated test or script to verify `meetingParser` logic correctly extracts the section.
- [ ] Task: Verify end-to-end flow manually (or via script) by simulating the Agent's calls:
    1. Call `read_meeting_actions`.
    2. Parse result.
    3. Call `bulk_add_tasks`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Workflow Verification' (Protocol in workflow.md)
