# Product Overview

## Project Summary

**Task CLI** is a premium, high-performance CLI task manager built with **React**, **Ink**, and **TypeScript**. It features a snappy terminal interface and a beautiful, interactive GUI mode for managing tasks with priority systems, search, and visual progress tracking.

## Key Features

- **Blazing Fast CLI**: Optimized startup using dynamic imports. CLI commands run in <100ms.
- **Interactive GUI**: A stunning React-based terminal UI with real-time updates.
- **Priority System**: Organize tasks by `high`, `medium`, or `low` priority.
- **Search & Filter**: Find tasks instantly with text or `@tag` search.
- **Intelligent Sorting**: High-priority tasks stay at the top; completed tasks move to the bottom.
- **Visual Progress**: Real-time progress bar tracking your daily productivity.
- **Custom Theme**: Beautiful Pink aesthetics.

## Tech Stack

- **Framework**: [Ink](https://github.com/vadimdemedes/ink) (React for CLI)
- **Storage**: `conf` (Local persistence)
- **Validation**: `zod`
- **Utilities**: `date-fns`, `nanoid`

## Installation

```bash
# Clone the repository
git clone https://github.com/chrisburlacu1/task-cli.git
cd task-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
pm link
```