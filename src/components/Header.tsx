import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../store/store.js';
import { THEME } from '../theme.js';
import { ProgressBar } from './ProgressBar.js';

interface HeaderProps {
  tasks: Task[];
}

export const Header = React.memo(({ tasks }: HeaderProps) => (
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

Header.displayName = 'Header';
