import { describe, it, expect } from 'vitest';
import { TaskSchema } from '../src/store';

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

    expect(TaskSchema).toBeDefined();
    const result = TaskSchema.safeParse(taskWithDueDate);
    expect(result.success).toBe(true);
    expect(result.data?.dueDate).toBe(taskWithDueDate.dueDate);
  });
});
