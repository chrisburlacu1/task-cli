import { describe, it, expect } from 'vitest';
import { findActionsSection } from '../src/utils/meetingParser';
import fs from 'fs';
import path from 'path';

describe('meetingParser', () => {
  describe('findActionsSection', () => {
    it('should extract content from the real fixture file', () => {
      const fixturePath = path.resolve(__dirname, 'fixtures/meeting_notes.md');
      const content = fs.readFileSync(fixturePath, 'utf-8');
      const result = findActionsSection(content);
      
      expect(result).toContain('- Fix the login button alignment [high] @ui');
      expect(result).toContain('- Update the migration script to include indexes [medium]');
      expect(result).not.toContain('## Discussion');
      expect(result).not.toContain('## Attendees');
    });

    it('should extract content under "## Actions" header', () => {
      const content = `
# Meeting Minutes
## Discussion
Some discussion here.
## Actions
- Task 1
- Task 2
## Next Steps
More text.
      `;
      const result = findActionsSection(content);
      expect(result).toContain('- Task 1');
      expect(result).toContain('- Task 2');
      expect(result).not.toContain('## Discussion');
      expect(result).not.toContain('## Next Steps');
    });

    it('should extract content under "## Action Items" header', () => {
      const content = `
# Meeting
## Action Items
1. Action A
2. Action B
      `;
      const result = findActionsSection(content);
      expect(result).toContain('1. Action A');
      expect(result).toContain('2. Action B');
    });

    it('should extract content under "Action Items:" header', () => {
      const content = `
Meeting Title
Action Items:
* Fix the thing
* Call the person
      `;
      const result = findActionsSection(content);
      expect(result).toContain('* Fix the thing');
      expect(result).toContain('* Call the person');
    });

    it('should return null if no actions section is found', () => {
      const content = `
# Meeting
No actions here.
      `;
      const result = findActionsSection(content);
      expect(result).toBeNull();
    });

    it('should handle case-insensitive headers', () => {
      const content = `
## actions
- lower case task
      `;
      const result = findActionsSection(content);
      expect(result).toContain('- lower case task');
    });

    it('should extract until the end of file if it is the last section', () => {
      const content = `
# Notes
## Actions
- Final task
      `;
      const result = findActionsSection(content);
      expect(result?.trim()).toBe('- Final task');
    });
  });
});
