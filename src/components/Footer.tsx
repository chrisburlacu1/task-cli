import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../theme.js';

interface FooterProps {
  mode: 'list' | 'add' | 'search';
}

export const Footer = React.memo(({ mode }: FooterProps) => (
  <Box
    marginTop={1}
    paddingX={1}
    borderStyle="single"
    borderColor={THEME.muted}
  >
    {mode === 'list' ? (
      <Text italic color={THEME.muted}>
        [a] Add | [d] Delete | [s] Start | [x] Stop | [f] Search | [c] Clear
        Completed | [space] Toggle | [q] Quit
      </Text>
    ) : (
      <Text italic color={THEME.muted}>
        [esc] Cancel
      </Text>
    )}
  </Box>
));

Footer.displayName = 'Footer';
