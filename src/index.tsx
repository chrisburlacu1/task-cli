import { THEME_ANSI } from "./theme.js";
import { dispatchCommand } from "./cli-dispatcher.js";

// --- Short aliases for cleaner code ---
const PRIMARY = THEME_ANSI.primary;

const handleCli = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    // Dynamic import for GUI to save startup time for simple CLI commands
    const { startGui } = await import("./gui.js");
    startGui();
    return;
  }

  console.log();
  
  const result = dispatchCommand(args);

  result.messages.forEach(msg => console.log(msg));

  if (result.error) {
    console.error(result.error);
  }

  if (result.exitCode !== undefined) {
    process.exit(result.exitCode);
  }
  
  process.exit(result.success ? 0 : 1);
};

handleCli();
