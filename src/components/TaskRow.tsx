import React from 'react';
import { Box, Text } from 'ink';
import { formatDistanceToNow, isPast, isToday } from 'date-fns';
import { Task, TaskPriority } from '../store/store.js';
import { THEME } from '../theme.js';
import { formatDate } from '../utils/dateUtils.js';

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  getPriorityColor: (p: TaskPriority) => string;
}

export const TaskRow = React.memo(
  ({ task, isSelected, getPriorityColor }: TaskRowProps) => {
    const isOverdue =
      task.dueDate &&
      !task.completed &&
      isPast(new Date(task.dueDate)) &&
      !isToday(new Date(task.dueDate));
    const isInProgress = task.status === 'in_progress';

    return (
      <Box>
        <Text color={isSelected ? THEME.primary : THEME.text} bold={isSelected}>
          {isSelected ? '➤ ' : '  '}
        </Text>
        <Box width={40}>
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
            {isInProgress ? '▶ ' : ''}
            {task.text}
          </Text>
        </Box>
        <Box marginLeft={2} width={10}>
          <Text
            strikethrough={task.completed}
            bold={isSelected}
            color={
              task.completed ? THEME.muted : getPriorityColor(task.priority)
            }
          >
            [{task.priority}]
          </Text>
        </Box>
        <Box marginLeft={2} width={20}>
          {task.dueDate ? (
            <Text
              color={
                task.completed
                  ? THEME.muted
                  : isOverdue
                    ? THEME.error
                    : THEME.warning
              }
              bold={!task.completed}
            >
              Due: {formatDate(task.dueDate)}
            </Text>
          ) : (
            <Text color={THEME.muted} italic>
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
              })}
            </Text>
          )}
        </Box>
      </Box>
    );
  }
);

TaskRow.displayName = 'TaskRow';
