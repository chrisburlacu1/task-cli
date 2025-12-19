import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { scanDirectory, TodoItem } from '../src/utils/fileScanner';

describe('fileScanner', () => {
  const testDir = path.join(__dirname, 'scan_test_fixture');

  // Setup: Create a temporary directory structure for testing
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  
  const file1 = path.join(testDir, 'test1.ts');
  const file2 = path.join(testDir, 'subdir', 'test2.js');
  const subdir = path.join(testDir, 'subdir');

  if (!fs.existsSync(subdir)) {
    fs.mkdirSync(subdir);
  }

  fs.writeFileSync(file1, `
    const x = 1;
    // TODO: Fix variable name
    console.log(x);
  `);

  fs.writeFileSync(file2, `
    // FIXME: This is broken
    // BUG: It crashes here
    function test() {}
  `);

  it('should find TODOs in the test fixture', () => {
    const results = scanDirectory(testDir);
    
    // Sort results to ensure consistent order for assertions
    results.sort((a, b) => {
        if (a.file !== b.file) return a.file.localeCompare(b.file);
        return a.line - b.line;
    });

    expect(results.length).toBe(3);

    expect(results[0].type).toBe('FIXME');
    expect(results[0].text).toBe('This is broken');
    expect(results[0].file).toContain('test2.js');

    expect(results[1].type).toBe('BUG');
    expect(results[1].text).toBe('It crashes here');
    
    expect(results[2].type).toBe('TODO');
    expect(results[2].text).toBe('Fix variable name');
    expect(results[2].file).toContain('test1.ts');
  });

  // Cleanup
  // fs.rmSync(testDir, { recursive: true, force: true });
});
