import { describe, it, expect } from 'vitest';
import { parseDate, formatDate } from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('parseDate', () => {
    it('should parse natural language "tomorrow"', () => {
      const result = parseDate('tomorrow');
      expect(result).toBeDefined();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(new Date(result!).toDateString()).toBe(tomorrow.toDateString());
    });

    it('should parse ISO date strings', () => {
      const iso = '2025-12-25T10:00:00.000Z';
      const result = parseDate(iso);
      expect(result).toBe(iso);
    });

    it('should return null for invalid dates', () => {
      expect(parseDate('not a date')).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('should format a date string nicely', () => {
      const date = '2025-12-25T10:00:00.000Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('Dec 25');
    });
  });
});
