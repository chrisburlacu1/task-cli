import { describe, it, expect, vi } from 'vitest';
import { TaskSchema, addTask, getTasks, updateTask } from '../src/store';

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

describe('Store', () => {
  describe('TaskSchema', () => {
    it('should validate a task with an optional due date', () => {
      const taskWithDueDate = {
        id: '123',
        text: 'Test task',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        tags: [],
        dueDate: new Date().toISOString(),
      };

      const result = TaskSchema.safeParse(taskWithDueDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBe(taskWithDueDate.dueDate);
      }
    });
  });

  describe('addTask', () => {
    it('should store a dueDate when provided', () => {
      const dueDate = new Date().toISOString();
      const newTask = addTask('Test task', 'high', dueDate);
      expect(newTask.dueDate).toBe(dueDate);
      
      const tasks = getTasks();
      expect(tasks[tasks.length - 1].dueDate).toBe(dueDate);
    });
  });

  describe('updateTask', () => {
    it('should update task text and tags', () => {
      const task = addTask('Initial text', 'medium');
      const updated = updateTask(task.id, { text: 'Updated text @newtag' });
      
      expect(updated?.text).toBe('Updated text @newtag');
      expect(updated?.tags).toContain('newtag');
    });

    it('should update task priority', () => {
      const task = addTask('Test priority', 'low');
      const updated = updateTask(task.id, { priority: 'high' });
      
      expect(updated?.priority).toBe('high');
    });

    it('should update or clear due date', () => {
      const task = addTask('Test date', 'medium', '2025-01-01');
      const updated = updateTask(task.id, { dueDate: '2025-02-02' });
      expect(updated?.dueDate).toBe('2025-02-02');

      const cleared = updateTask(task.id, { dueDate: null });
      expect(cleared?.dueDate).toBeUndefined();
    });
  });
});
