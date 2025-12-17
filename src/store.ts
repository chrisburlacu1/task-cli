import Conf from 'conf';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

const TaskSchema = z.object({
	id: z.string(),
	text: z.string(),
	completed: z.boolean(),
	priority: TaskPrioritySchema,
	createdAt: z.string(),
	tags: z.array(z.string()),
});

export type Task = z.infer<typeof TaskSchema>;

const Schema = z.object({
	tasks: z.array(TaskSchema),
});

type SchemaType = z.infer<typeof Schema>;

const store = new Conf<SchemaType>({
	projectName: 'task-cli',
	defaults: {
		tasks: [],
	},
});

export const getTasks = () => store.get('tasks');

export const addTask = (text: string, priority: TaskPriority) => {
	const tasks = getTasks();
	const tags = text.match(/@\w+/g)?.map(t => t.slice(1)) || [];
	const newTask: Task = {
		id: nanoid(),
		text,
		completed: false,
		priority,
		createdAt: new Date().toISOString(),
		tags,
	};
	store.set('tasks', [...tasks, newTask]);
	return newTask;
};

export const toggleTask = (id: string) => {
	const tasks = getTasks();
	const updatedTasks = tasks.map((t) =>
		t.id === id ? { ...t, completed: !t.completed } : t
	);
	store.set('tasks', updatedTasks);
};

export const deleteTask = (id: string) => {
	const tasks = getTasks();
	const updatedTasks = tasks.filter((t) => t.id !== id);
	store.set('tasks', updatedTasks);
};

export const clearCompleted = () => {
	const tasks = getTasks();
	const remaining = tasks.filter(t => !t.completed);
	store.set('tasks', remaining);
};

export const actionByIndex = (index: number, action: 'toggle' | 'delete') => {
	const tasks = getTasks();
	const target = tasks[index];
	if (!target) return false;
	
	if (action === 'toggle') toggleTask(target.id);
	if (action === 'delete') deleteTask(target.id);
	return true;
};

export const setPriority = (id: string, priority: TaskPriority) => {
	const tasks = getTasks();
	const updatedTasks = tasks.map((t) =>
		t.id === id ? { ...t, priority } : t
	);
	store.set('tasks', updatedTasks);
};
