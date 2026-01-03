import Conf from 'conf';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { APP_CONFIG } from '../config.js';

const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  createdAt: z.string(),
  tags: z.array(z.string()),
  dueDate: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

const Schema = z.object({
  tasks: z.array(TaskSchema),
});

type SchemaType = z.infer<typeof Schema>;

export interface StorageProvider<T extends Record<string, any>> {
  get<K extends keyof T>(key: K): T[K] | undefined;
  set<K extends keyof T>(key: K, value: T[K]): void;
}

// Internal store instance - could be moved to a Factory for true DI,
// but for now we centralize the config.
const store: StorageProvider<SchemaType> = new Conf<SchemaType>({
  projectName: APP_CONFIG.projectName,
  projectVersion: APP_CONFIG.projectVersion,
  defaults: {
    tasks: [],
  },
  migrations: {
    '1.1.0': (store: any) => {
      const tasks = store.get('tasks');
      if (tasks && Array.isArray(tasks)) {
        const migratedTasks = tasks.map((t: any) => ({
          ...t,
          status: t.status || (t.completed ? 'completed' : 'pending'),
        }));
        store.set('tasks', migratedTasks);
      }
    },
  },
});

export const getTasks = () => {
  const tasks = store.get('tasks');
  return z.array(TaskSchema).parse(tasks);
};

export const getAllTags = () => {
  const tasks = getTasks();
  const tags = new Set<string>();
  tasks.forEach((task) => {
    task.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const searchTasks = (query: string) => {
  const tasks = getTasks();
  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.text.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase() === lowerQuery.replace('@', ''))
  );
};

export const addTask = (
  text: string,
  priority: TaskPriority,
  dueDate?: string
) => {
  const tasks = getTasks();
  const tags = text.match(/@[\w-]+/g)?.map((t) => t.slice(1)) || [];
  const newTask: Task = {
    id: nanoid(),
    text,
    completed: false,
    status: 'pending',
    priority,
    createdAt: new Date().toISOString(),
    tags,
    dueDate,
  };
  store.set('tasks', [...tasks, newTask]);
  return newTask;
};

export const addTasks = (
  newTasksData: { text: string; priority: TaskPriority; dueDate?: string }[]
) => {
  const tasks = getTasks();
  const newTasks: Task[] = newTasksData.map(({ text, priority, dueDate }) => {
    const tags = text.match(/@[\w-]+/g)?.map((t) => t.slice(1)) || [];
    return {
      id: nanoid(),
      text,
      completed: false,
      status: 'pending',
      priority,
      createdAt: new Date().toISOString(),
      tags,
      dueDate,
    };
  });
  store.set('tasks', [...tasks, ...newTasks]);
  return newTasks;
};

export const toggleTask = (id: string) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((t) => {
    if (t.id === id) {
      const completed = !t.completed;
      return {
        ...t,
        completed,
        status: completed ? 'completed' : ('pending' as TaskStatus),
      };
    }
    return t;
  });
  store.set('tasks', updatedTasks);
};

export const updateTask = (
  id: string,
  updates: {
    text?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string | null;
  }
) => {
  const tasks = getTasks();
  let updatedTask: Task | undefined;

  const updatedTasks = tasks.map((t) => {
    if (t.id === id) {
      const text = updates.text ?? t.text;
      const tags = updates.text
        ? updates.text.match(/@[\w-]+/g)?.map((tag) => tag.slice(1)) || []
        : t.tags;
      const status = updates.status ?? t.status;
      const completed = status === 'completed';

      updatedTask = {
        ...t,
        text,
        tags,
        status,
        completed,
        priority: updates.priority ?? t.priority,
        dueDate:
          updates.dueDate === null ? undefined : (updates.dueDate ?? t.dueDate),
      };
      return updatedTask;
    }
    return t;
  });

  store.set('tasks', updatedTasks);
  return updatedTask;
};

export const deleteTask = (id: string) => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((t) => t.id !== id);
  store.set('tasks', updatedTasks);
};

export const clearCompleted = () => {
  const tasks = getTasks();
  const completed = tasks.filter((t) => t.completed);
  const remaining = tasks.filter((t) => !t.completed);
  store.set('tasks', remaining);
  return completed;
};

export const getSortedTasks = (sortArg?: string) => {
  const tasks = getTasks();
  return [...tasks].sort((a, b) => {
    const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
    if (a.status !== b.status)
      return statusOrder[a.status] - statusOrder[b.status];

    if (sortArg === 'due') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    const priorities = { high: 0, medium: 1, low: 2 };
    return priorities[a.priority] - priorities[b.priority];
  });
};

export const setPriority = (id: string, priority: TaskPriority) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, priority } : t));
  store.set('tasks', updatedTasks);
};
