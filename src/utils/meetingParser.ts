/**
 * Finds the "Actions" or "Action Items" section in a given string.
 * It looks for markdown headers or common textual patterns.
 * 
 * @param content The full text content of the file.
 * @returns The extracted section text or null if not found.
 */
export const findActionsSection = (content: string): string | null => {
  // Regex to find headers like ## Actions, ## Action Items, Action Items:
  // Case-insensitive
  const headerRegex = /^(?:#+\s*|)(Actions|Action Items)\s*:?\s*$/im;
  
  const match = content.match(headerRegex);
  if (!match) return null;

  const startIndex = match.index! + match[0].length;
  const remainingContent = content.slice(startIndex);

  // Look for the next header (starting with #)
  const nextHeaderRegex = /^#+\s+.+$/m;
  const nextHeaderMatch = remainingContent.match(nextHeaderRegex);

  if (nextHeaderMatch) {
    return remainingContent.slice(0, nextHeaderMatch.index);
  }

  return remainingContent;
};
