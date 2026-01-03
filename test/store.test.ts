import { describe, it, expect, vi } from 'vitest';
import { TaskSchema, addTask, getTasks, updateTask } from '../src/store/store';

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
        status: 'pending',
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

    it('should validate a task with a status field', () => {
      const task = {
        id: '123',
        text: 'Test task',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        tags: [],
        status: 'in_progress',
      };

      const result = TaskSchema.safeParse(task);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('in_progress');
      }
    });
  });

  describe('addTask', () => {
    it('should store a dueDate when provided and default status to pending', () => {
      const dueDate = new Date().toISOString();
      const newTask = addTask('Test task', 'high', dueDate);
      expect(newTask.dueDate).toBe(dueDate);
      expect(newTask.status).toBe('pending');
      
      const tasks = getTasks();
      expect(tasks[tasks.length - 1].dueDate).toBe(dueDate);
    });
  });

  describe('updateTask', () => {
    it('should update task text, tags and status', () => {
      const task = addTask('Initial text', 'medium');
      const updated = updateTask(task.id, { text: 'Updated text @newtag', status: 'in_progress' });
      
      expect(updated?.text).toBe('Updated text @newtag');
      expect(updated?.tags).toContain('newtag');
      expect(updated?.status).toBe('in_progress');
      expect(updated?.completed).toBe(false);
    });

    it('should mark completed when status is updated to completed', () => {
      const task = addTask('Test complete', 'low');
      const updated = updateTask(task.id, { status: 'completed' });
      
      expect(updated?.status).toBe('completed');
      expect(updated?.completed).toBe(true);
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
