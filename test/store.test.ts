import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskSchema, addTask, getTasks } from '../src/store';

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
});