import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME } from '../theme.js';

interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBox = ({ searchQuery, setSearchQuery }: SearchBoxProps) => (
  <Box
    borderStyle="single"
    borderColor={THEME.primary}
    padding={1}
    marginBottom={1}
  >
    <Text color={THEME.primary} bold>
      Search (@tag or text):{' '}
    </Text>
    <TextInput value={searchQuery} onChange={setSearchQuery} />
  </Box>
);
