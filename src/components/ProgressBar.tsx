import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../store/store.js';
import { THEME } from '../theme.js';

interface ProgressBarProps {
  tasks: Task[];
}

export const ProgressBar = ({ tasks }: ProgressBarProps) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const width = 20;
  const progress = Math.round((percentage / 100) * width);

  return (
    <Box flexDirection="row" marginBottom={1}>
      <Text color={THEME.muted}>Progress: </Text>
      <Text color={THEME.primary}>
        [{'█'.repeat(progress)}
        {'░'.repeat(width - progress)}] {percentage}%
      </Text>
    </Box>
  );
};
