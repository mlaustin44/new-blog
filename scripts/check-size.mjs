#!/usr/bin/env node
// Runs after `astro build`. Fails the build if the JavaScript sent to browsers grows past the budget.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET_KB = 30; // gzipped, all scripts on the site combined

if (!existsSync(DIST)) {
  console.error('No dist/ folder. Run the build first.');
  process.exit(1);
}

const scripts = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((name) => name.endsWith('.js'))
  .map((name) => ({ name, kb: gzipSync(readFileSync(join(DIST, name))).length / 1024 }))
  .sort((a, b) => b.kb - a.kb);

const total = scripts.reduce((sum, script) => sum + script.kb, 0);

console.log('\nJavaScript shipped to browsers (gzipped):');
for (const script of scripts) console.log(`  ${script.kb.toFixed(1).padStart(6)} kB  ${script.name}`);
console.log(`  ${total.toFixed(1).padStart(6)} kB  total (budget ${BUDGET_KB} kB)\n`);

if (total > BUDGET_KB) {
  console.error(`Over the ${BUDGET_KB} kB JavaScript budget. See scripts/check-size.mjs.`);
  process.exit(1);
}
