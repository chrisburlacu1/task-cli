import { getSortedTasks } from '../store/store.js';

/**
 * Resolves a 1-based CLI index to a task ID based on the current sorted view.
 */
export const resolveTaskId = (
  index: number,
  sortArg?: string
): string | null => {
  const sortedTasks = getSortedTasks(sortArg);
  const target = sortedTasks[index - 1]; // index is 1-based
  return target ? target.id : null;
};
