import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const roots = ['src'];
const extensions = new Set(['.css', '.scss', '.sass', '.ts', '.tsx']);
const checks = [
  { pattern: /#[0-9a-fA-F]{3,8}\b/g, label: 'hex color literal' },
  { pattern: /\b(?:rgb|rgba|hsl|hsla)\(/g, label: 'raw color function' },
];

function walk(path) {
  return readdirSync(path).flatMap((entry) => {
    const fullPath = join(path, entry);
    return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const violations = [];
for (const root of roots) {
  for (const file of walk(root)) {
    if (!extensions.has(extname(file))) continue;
    const content = readFileSync(file, 'utf8');
    for (const { pattern, label } of checks) {
      for (const match of content.matchAll(pattern)) {
        const line = content.slice(0, match.index).split('\n').length;
        violations.push(`${file}:${line} - ${label} (${match[0]})`);
      }
    }
  }
}

if (violations.length) {
  console.error('Carbon usage check failed. Prefer Carbon design tokens:');
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Carbon usage check passed.');
}
