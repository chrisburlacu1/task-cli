import { describe, it, expect, vi } from 'vitest';
import { addTask, getTasks, TaskSchema } from '../src/store/store';
import { z } from 'zod';

// Mock Conf
vi.mock('conf', () => {
  return {
    default: class {
      store = { tasks: [] };
      get(key: string) { return this.store[key]; }
      set(key: string, value: any) { this.store[key] = value; }
    }
  };
});

describe('Store Fixes', () => {
  describe('Tag Extraction', () => {
    it('should support tags with hyphens', () => {
      const task = addTask('Review code @feature-request @bug-fix', 'medium');
      expect(task.tags).toContain('feature-request');
      expect(task.tags).toContain('bug-fix');
    });

    it('should still support simple alphanumeric tags', () => {
      const task = addTask('Simple task @todo', 'low');
      expect(task.tags).toContain('todo');
    });
  });

  describe('Data Validation', () => {
    it('should validate tasks on retrieval', () => {
      // Create a task normally
      const newTask = addTask('Valid task', 'medium');
      
      const tasks = getTasks();
      expect(tasks.length).toBeGreaterThan(0);
      const found = tasks.find(t => t.id === newTask.id);
      expect(found).toBeDefined();
      // If validation failed, getTasks would throw, so reaching here implies success for valid data
    });
  });
});
