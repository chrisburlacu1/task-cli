export const THEME = {
  primary: "#f373bf",
  secondary: "#FFA07A",
  text: "#FFFFFF",
  muted: "#BDBDBD",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
};

/**
 * Converts a hex color string to an ANSI escape sequence for the terminal.
 */
const hexToAnsi = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
};

export const THEME_ANSI = {
  primary: hexToAnsi(THEME.primary),
  success: hexToAnsi(THEME.success),
  error: hexToAnsi(THEME.error),
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  strikethrough: "\x1b[9m",
  resetStrikethrough: "\x1b[29m",
};
