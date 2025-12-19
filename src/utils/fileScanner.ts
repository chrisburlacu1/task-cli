import fs from 'fs';
import path from 'path';

export interface TodoItem {
  file: string;
  line: number;
  type: 'TODO' | 'FIXME' | 'BUG';
  text: string;
}

const DEFAULT_IGNORE = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

const TODO_REGEX = /\/\/\s*(TODO|FIXME|BUG):?\s*(.+)$/i;

export const scanDirectory = (
  dirPath: string,
  ignore: string[] = DEFAULT_IGNORE
): TodoItem[] => {
  let results: TodoItem[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (ignore.includes(entry.name) || entry.name.startsWith('.')) {
        continue;
      }

      if (entry.isDirectory()) {
        results = results.concat(scanDirectory(fullPath, ignore));
      } else if (entry.isFile()) {
        // Simple heuristic: only scan text-like files based on extension or lack thereof
        // For now, let's just try to read everything that isn't binary-looking extension
        if (isScannableFile(entry.name)) {
          results = results.concat(scanFile(fullPath));
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }

  return results;
};

const scanFile = (filePath: string): TodoItem[] => {
  const items: TodoItem[] = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(TODO_REGEX);
      if (match) {
        items.push({
          file: filePath,
          line: index + 1,
          type: (match[1].toUpperCase() as 'TODO' | 'FIXME' | 'BUG'),
          text: match[2].trim(),
        });
      }
    });
  } catch (err) {
    // Ignore read errors (e.g. binary files that slipped through)
  }
  return items;
};

const isScannableFile = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  const binaryExts = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.bin', '.dll', '.node'
  ];
  return !binaryExts.includes(ext);
};
