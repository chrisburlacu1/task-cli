import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addTask, getTasks, updateTask, deleteTask } from '../src/store/store';
import { resolveTaskId } from '../src/utils/commandUtils';

// Mock Conf with reset capability
let storeData: Record<string, any> = { tasks: [] };

vi.mock('conf', () => {
  return {
    default: class {
      get(key: string) {
        return storeData[key];
      }
      set(key: string, value: any) {
        storeData[key] = value;
      }
    },
  };
});

describe('Store Sorting', () => {
  beforeEach(() => {
    storeData = { tasks: [] };
  });

  it('updateTaskByIndex should respect priority sorting (High before Low)', async () => {
    // Add Low priority first (index 0 in raw store)
    const taskLow = addTask('Low priority task', 'low');
    // Add High priority second (index 1 in raw store)
    const taskHigh = addTask('High priority task', 'high');

    // In the sorted view (list command logic):
    // 1. High priority task (index 0)
    // 2. Low priority task (index 1)

    // We try to update index 1 (resolved from index 0). It SHOULD be the High priority task.
    const id = resolveTaskId(1);
    if (id) updateTask(id, { status: 'in_progress' });

    const tasks = getTasks();
    const updatedHigh = tasks.find((t) => t.id === taskHigh.id);
    const updatedLow = tasks.find((t) => t.id === taskLow.id);

    expect(updatedHigh?.status).toBe('in_progress');
    expect(updatedLow?.status).toBe('pending');
  });

  it('updateTaskByIndex should respect status sorting (In Progress before Pending)', async () => {
    const taskPending = addTask('Pending task', 'medium');
    const taskInProgress = addTask('In Progress task', 'medium');

    // Manually set status to in_progress for the second task to set up the sort order
    // We can't use updateTaskByIndex yet as we are testing it
    // Using internal store update mechanism or specific updateTask if available and trusted
    // But wait, addTask adds as pending.

    // Let's use updateTaskByIndex to set the state first, assuming it works for basic updates
    // actually we can use the exported updateTask from store

    updateTask(taskInProgress.id, { status: 'in_progress' });

    // Sorted Order:
    // 1. In Progress (taskInProgress) - Index 0
    // 2. Pending (taskPending) - Index 1

    // Delete index 1 (should be the In Progress task, was resolved from index 0)
    const id = resolveTaskId(1);
    if (id) deleteTask(id);

    const tasks = getTasks();
    const foundInProgress = tasks.find((t) => t.id === taskInProgress.id);
    const foundPending = tasks.find((t) => t.id === taskPending.id);

    expect(foundInProgress).toBeUndefined();
    expect(foundPending).toBeDefined();
  });
});
