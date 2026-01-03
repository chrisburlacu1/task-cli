import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dispatchCommand } from '../src/cli-dispatcher';

// Mock the store functions
const mockAddTask = vi.fn();
const mockGetTasks = vi.fn();
const mockGetSortedTasks = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockClearCompleted = vi.fn();

vi.mock('../src/store/store', async () => {
  return {
    addTask: (...args: any[]) => mockAddTask(...args),
    getTasks: () => mockGetTasks(),
    getSortedTasks: (...args: any[]) => mockGetSortedTasks(...args),
    updateTask: (...args: any[]) => mockUpdateTask(...args),
    deleteTask: (...args: any[]) => mockDeleteTask(...args),
    clearCompleted: () => mockClearCompleted(),
    TaskPriority: {},
  };
});

// Mock archive store
const mockGetArchivedTasks = vi.fn();
const mockArchiveTasks = vi.fn();

vi.mock('../src/store/archive-store', () => ({
  getArchivedTasks: () => mockGetArchivedTasks(),
  archiveTasks: (...args: any[]) => mockArchiveTasks(...args),
  clearArchive: vi.fn(),
}));

// Mock command utils
const mockResolveTaskId = vi.fn();
vi.mock('../src/utils/commandUtils', () => ({
  resolveTaskId: (num: number) => mockResolveTaskId(num),
}));

describe('CLI Dispatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('add command', () => {
    it('should add a task with default priority', () => {
      const result = dispatchCommand(['add', 'Buy milk']);
      expect(result.success).toBe(true);
      expect(mockAddTask).toHaveBeenCalledWith('Buy milk', 'medium', undefined);
      expect(result.messages[0]).toContain('Added task');
    });

    it('should add a task with high priority', () => {
      const result = dispatchCommand(['add', 'Urgent fix', '--high']);
      expect(result.success).toBe(true);
      expect(mockAddTask).toHaveBeenCalledWith('Urgent fix', 'high', undefined);
    });

    it('should fail if no text provided', () => {
      const result = dispatchCommand(['add']);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('list command', () => {
    it('should list tasks', () => {
      mockGetSortedTasks.mockReturnValue([
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          priority: 'medium',
          status: 'pending',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: true,
          priority: 'low',
          status: 'completed',
        },
      ]);

      const result = dispatchCommand(['list']);
      expect(result.success).toBe(true);
      expect(result.messages.length).toBeGreaterThan(0);
      expect(result.messages.some((m) => m.includes('Task 1'))).toBe(true);
      expect(result.messages.some((m) => m.includes('Task 2'))).toBe(true);
    });

    it('should handle empty list', () => {
      mockGetSortedTasks.mockReturnValue([]);
      const result = dispatchCommand(['list']);
      expect(result.success).toBe(true);
      expect(result.messages).toContain('No tasks found.');
    });
  });

  describe('manipulation commands', () => {
    it('should start a task', () => {
      mockResolveTaskId.mockReturnValue('task-1');
      mockUpdateTask.mockReturnValue(true);
      const result = dispatchCommand(['start', '1']);
      expect(result.success).toBe(true);
      expect(mockResolveTaskId).toHaveBeenCalledWith(1);
      expect(mockUpdateTask).toHaveBeenCalledWith('task-1', {
        status: 'in_progress',
      });
    });

    it('should stop a task', () => {
      mockResolveTaskId.mockReturnValue('task-1');
      mockUpdateTask.mockReturnValue(true);
      const result = dispatchCommand(['stop', '1']);
      expect(result.success).toBe(true);
      expect(mockUpdateTask).toHaveBeenCalledWith('task-1', {
        status: 'pending',
      });
    });

    it('should toggle a task (done)', () => {
      mockResolveTaskId.mockReturnValue('task-1');
      mockGetTasks.mockReturnValue([
        { id: 'task-1', text: 'Task 1', completed: false },
      ]);
      mockUpdateTask.mockReturnValue(true);
      const result = dispatchCommand(['done', '1']);
      expect(result.success).toBe(true);
      expect(mockUpdateTask).toHaveBeenCalledWith('task-1', {
        status: 'completed',
      });
    });

    it('should remove a task', () => {
      mockResolveTaskId.mockReturnValue('task-1');
      const result = dispatchCommand(['rm', '1']);
      expect(result.success).toBe(true);
      expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    });

    it('should clear completed tasks', () => {
      mockClearCompleted.mockReturnValue([]);
      const result = dispatchCommand(['clear']);
      expect(result.success).toBe(true);
      expect(mockClearCompleted).toHaveBeenCalled();
    });

    it('should archive completed tasks', () => {
      mockClearCompleted.mockReturnValue([{ id: '1', text: 'Task 1' }]);
      const result = dispatchCommand(['archive']);
      expect(result.success).toBe(true);
      expect(mockClearCompleted).toHaveBeenCalled();
      expect(mockArchiveTasks).toHaveBeenCalledWith([
        { id: '1', text: 'Task 1' },
      ]);
    });
  });

  describe('history command', () => {
    it('should list archived tasks', () => {
      mockGetArchivedTasks.mockReturnValue([
        {
          id: '1',
          text: 'Old Task',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
      ]);
      const result = dispatchCommand(['history']);
      expect(result.success).toBe(true);
      expect(result.messages.some((m) => m.includes('Old Task'))).toBe(true);
    });
  });

  describe('help command', () => {
    it('should return help text', () => {
      const result = dispatchCommand(['--help']);
      expect(result.success).toBe(true);
      // Commander writes help to output when --help is passed
      expect(result.messages.length).toBeGreaterThan(0);
    });
  });
});
