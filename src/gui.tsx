import React, { useState, useEffect, useMemo } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  Task,
  TaskPriority,
} from "./store.js";
import { THEME } from "./theme.js";
import { formatDate, parseDate } from "./utils/dateUtils.js";

// --- Components ---

const ProgressBar = ({ tasks }: { tasks: Task[] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const width = 20;
  const progress = Math.round((percentage / 100) * width);

  return (
    <Box flexDirection="row" marginBottom={1}>
      <Text color={THEME.muted}>Progress: </Text>
      <Text color={THEME.primary}>
        [{"█".repeat(progress)}
        {"░".repeat(width - progress)}] {percentage}%
      </Text>
    </Box>
  );
};

const Header = React.memo(({ tasks }: { tasks: Task[] }) => (
  <Box
    flexDirection="column"
    borderStyle="round"
    borderColor={THEME.primary}
    paddingX={1}
    marginBottom={1}
  >
    <Text color={THEME.primary} bold>
      Tasks
    </Text>
    <ProgressBar tasks={tasks} />
  </Box>
));

const Footer = React.memo(({ mode }: { mode: "list" | "add" | "search" }) => (
  <Box
    marginTop={1}
    paddingX={1}
    borderStyle="single"
    borderColor={THEME.muted}
  >
    {mode === "list" ? (
      <Text italic color={THEME.muted}>
        [a] Add | [d] Delete | [s] Start | [x] Stop | [f] Search | [c] Clear Completed | [space] Toggle | [q] Quit
      </Text>
    ) : (
      <Text italic color={THEME.muted}>
        [esc] Cancel
      </Text>
    )}
  </Box>
));

const StatusLine = ({ message }: { message: string }) => (
  <Box paddingX={1} height={1}>
    {message ? <Text color={THEME.success}>{message}</Text> : null}
  </Box>
);

const TaskRow = React.memo(
  ({
    task,
    isSelected,
    getPriorityColor,
  }: {
    task: Task;
    isSelected: boolean;
    getPriorityColor: (p: TaskPriority) => string;
  }) => {
    const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
    const isInProgress = task.status === "in_progress";
    
    return (
      <Box>
        <Text color={isSelected ? THEME.primary : THEME.text} bold={isSelected}>
          {isSelected ? "➤ " : "  "}
        </Text>
        <Box width={30}>
          <Text
            strikethrough={task.completed}
            bold={isSelected || isInProgress}
            color={
              isSelected
                ? THEME.primary
                : isInProgress
                ? THEME.success
                : task.completed
                ? THEME.muted
                : THEME.text
            }
          >
            {isInProgress ? "▶ " : ""}{task.text}
          </Text>
        </Box>
        <Box marginLeft={2} width={10}>
          <Text
            strikethrough={task.completed}
            bold={isSelected}
            color={task.completed ? THEME.muted : getPriorityColor(task.priority)}
          >
            [{task.priority}]
          </Text>
        </Box>
        <Box marginLeft={2} width={15}>
          {task.dueDate ? (
            <Text 
              color={task.completed ? THEME.muted : (isOverdue ? THEME.error : THEME.warning)} 
              bold={!task.completed}
            >
              Due: {formatDate(task.dueDate)}
            </Text>
          ) : (
            <Text color={THEME.muted} italic>
              {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </Text>
          )}
        </Box>
      </Box>
    );
  }
);

// --- Main App ---

type ViewMode = "list" | "add" | "search";
type AddStep = "text" | "priority" | "dueDate";

const App = () => {
  const { exit } = useApp();
  const [mode, setMode] = useState<ViewMode>("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<AddStep>("text");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2000);
  };

  const refreshTasks = () => setTasks(getTasks());

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(
      (t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase().replace("@", ""))
        )
    );

    // Sorting: In-progress -> Pending -> Completed, then due dates, then priority
    return result.sort((a, b) => {
      const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
      if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      const priorities = { high: 0, medium: 1, low: 2 };
      return priorities[a.priority] - priorities[b.priority];
    });
  }, [tasks, searchQuery]);

  useInput((input, key) => {
    if (mode === "list") {
      if (input === "q") exit();
      if (input === "a") setMode("add");
      if (input === "f") setMode("search");
      if (input === "c") {
        clearCompleted();
        refreshTasks();
        showStatus("✔ Cleared completed tasks");
      }
      if (input === "s") {
        const task = filteredTasks[selectedIndex];
        if (task && !task.completed) {
          updateTask(task.id, { status: "in_progress" });
          refreshTasks();
          showStatus(`✔ Started: ${task.text}`);
        }
      }
      if (input === "x") {
        const task = filteredTasks[selectedIndex];
        if (task && task.status === "in_progress") {
          updateTask(task.id, { status: "pending" });
          refreshTasks();
          showStatus(`✔ Stopped: ${task.text}`);
        }
      }
      if (key.return || input === " ") {
        const task = filteredTasks[selectedIndex];
        if (task) {
          toggleTask(task.id);
          refreshTasks();
          showStatus(
            `✔ ${task.completed ? "Reopened" : "Completed"}: ${task.text}`
          );
        }
      }
      if (input === "d") {
        const task = filteredTasks[selectedIndex];
        if (task) {
          deleteTask(task.id);
          refreshTasks();
          showStatus(`✔ Deleted: ${task.text}`);
          if (selectedIndex >= filteredTasks.length - 1 && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
          }
        }
      }
      if (key.upArrow) {
        setSelectedIndex(Math.max(0, selectedIndex - 1));
      }
      if (key.downArrow) {
        setSelectedIndex(Math.min(filteredTasks.length - 1, selectedIndex + 1));
      }
    } else if (mode === "add" || mode === "search") {
      if (key.escape) {
        setMode("list");
        setNewTaskText("");
        setNewTaskDueDate("");
        setSearchQuery("");
        setStep("text");
      }
    }
  });

  const handleAddTextSubmit = (value: string) => {
    if (value.trim()) {
      setStep("priority");
    } else {
      setMode("list");
    }
  };

  const handlePrioritySubmit = (item: { value: TaskPriority }) => {
    setNewTaskPriority(item.value);
    setStep("dueDate");
  };

  const handleDueDateSubmit = (value: string) => {
    const parsedDate = value.trim() ? parseDate(value) : undefined;
    
    if (value.trim() && !parsedDate) {
       showStatus("⚠ Invalid date format, ignored.");
    }

    addTask(newTaskText, newTaskPriority, parsedDate || undefined);
    showStatus(`✔ Added: ${newTaskText}`);
    refreshTasks();
    setNewTaskText("");
    setNewTaskDueDate("");
    setStep("text");
    setMode("list");
  };

  const priorityOptions = useMemo(
    () => [
      { label: "Low", value: "low" as const },
      { label: "Medium", value: "medium" as const },
      { label: "High", value: "high" as const },
    ],
    []
  );

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case "high":
        return THEME.error;
      case "medium":
        return THEME.warning;
      case "low":
        return THEME.secondary;
      default:
        return THEME.text;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Header tasks={tasks} />

      {mode === "search" && (
        <Box
          borderStyle="single"
          borderColor={THEME.primary}
          padding={1}
          marginBottom={1}
        >
          <Text color={THEME.primary} bold>
            Search (@tag or text):{" "}
          </Text>
          <TextInput value={searchQuery} onChange={setSearchQuery} />
        </Box>
      )}

      {mode === "list" || mode === "search" ? (
        <Box flexDirection="column">
          {filteredTasks.length === 0 ? (
            <Box paddingY={1}>
              <Text color={THEME.muted}>
                {searchQuery
                  ? "No matching tasks."
                  : "No tasks yet. Press 'a' to add one."}
              </Text>
            </Box>
          ) : (
            filteredTasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                isSelected={index === selectedIndex}
                getPriorityColor={getPriorityColor}
              />
            ))
          )}
        </Box>
      ) : (
        <Box
          flexDirection="column"
          borderStyle="double"
          borderColor={THEME.warning}
          padding={1}
        >
          {step === "text" ? (
            <Box>
              <Text bold color={THEME.primary}>
                Task Name:{" "}
              </Text>
              <TextInput
                value={newTaskText}
                onChange={setNewTaskText}
                onSubmit={handleAddTextSubmit}
              />
            </Box>
          ) : step === "priority" ? (
            <Box flexDirection="column">
              <Box marginBottom={1}>
                <Text bold color={THEME.primary}>
                  Select Priority for: {newTaskText}
                </Text>
              </Box>
              <SelectInput
                items={priorityOptions}
                onSelect={handlePrioritySubmit}
              />
            </Box>
          ) : (
            <Box flexDirection="column">
              <Box>
                <Text bold color={THEME.primary}>
                  Due Date (optional, e.g. "tomorrow", "2025-12-25"):{" "}
                </Text>
              </Box>
              <TextInput
                value={newTaskDueDate}
                onChange={setNewTaskDueDate}
                onSubmit={handleDueDateSubmit}
              />
              <Box marginTop={1}>
                <Text color={THEME.muted}>Press Enter to skip or confirm date.</Text>
              </Box>
            </Box>
          )}
        </Box>
      )}

      <StatusLine message={status} />
      <Footer mode={mode} />
    </Box>
  );
};

export const startGui = () => {
  render(<App />);
};