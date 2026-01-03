import Conf from 'conf';
import { z } from 'zod';
import { TaskSchema, Task } from './store.js';

const ArchiveSchema = z.object({
  archivedTasks: z.array(TaskSchema),
});

type ArchiveSchemaType = z.infer<typeof ArchiveSchema>;

const archiveStore = new Conf<ArchiveSchemaType>({
  projectName: 'task-cli',
  projectVersion: '1.1.0',
  configName: 'archive', // Stores in archive.json
  defaults: {
    archivedTasks: [],
  },
});

export const getArchivedTasks = () => {
  const tasks = archiveStore.get('archivedTasks');
  return z.array(TaskSchema).parse(tasks);
};

export const archiveTasks = (tasksToArchive: Task[]) => {
  const currentArchive = getArchivedTasks();
  // Avoid duplicates if something weird happens, though IDs should be unique
  const existingIds = new Set(currentArchive.map((t) => t.id));
  const newUniqueTasks = tasksToArchive.filter((t) => !existingIds.has(t.id));

  archiveStore.set('archivedTasks', [...currentArchive, ...newUniqueTasks]);
};

export const clearArchive = () => {
  archiveStore.set('archivedTasks', []);
};
