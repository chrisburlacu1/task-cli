# Initial Concept
A high-performance, dual-mode (CLI & GUI) Task Manager built with TypeScript, React, and Ink.

# Product Guide - task-cli

## Vision
To provide a seamless, high-performance task management experience for developers that bridges the gap between fast command-line interactions and rich interactive interfaces, while being natively built for the AI-driven development era.

## Target Audience
- **Terminal-Centric Developers:** Users who spend most of their time in a terminal and want to manage their workflow without context-switching to a browser or desktop app.

## Core Goals
- **AI-First Integration:** Deep integration with AI agents via the Model Context Protocol (MCP), making task management a first-class citizen for automated workflows.
- **Snappy Performance:** Maintaining a sub-100ms startup time for atomic CLI commands to ensure zero friction for quick entries.
- **Rich Interactivity:** A beautiful, React-powered TUI (Terminal User Interface) for managing complex task lists with ease.

## Key Features
- **Fast-Path CLI:** Direct subcommands for adding, listing, and completing tasks.
- **Interactive GUI:** A modern, keyboard-driven UI built with Ink.
- **Intelligent Importer:** Specialized MCP tool for extracting actionable tasks from meeting notes and project documents.
- **Enhanced Task Metadata:** Support for status tracking (Pending, In-Progress, Completed), due dates, priorities, and recurring tasks.
- **Tagging System:** Automatic parsing of `@tags` from task descriptions for easy organization.

## Design Philosophy
- **Modular Balance:** Basic CLI commands remain extremely lightweight, while heavier logic (GUI, complex metadata processing) is modularized or dynamically imported to preserve performance.
- **Keyboard-First:** Every action is accessible via shortcuts or commands, optimizing for speed and power-user efficiency.
