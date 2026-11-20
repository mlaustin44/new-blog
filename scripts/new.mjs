#!/usr/bin/env node
// Start a new entry:  npm run new "Title"            (writing, the default)
//                     npm run new work "Title"
//                     npm run new projects "Title"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KINDS = ['writing', 'work', 'projects'];
const EXTRA = {
  work: ['period: ""', 'role: ""', 'company: ""'],
  projects: ['status: In progress'],
  writing: [],
};

let [kind, ...rest] = process.argv.slice(2);
if (!KINDS.includes(kind)) {
  rest = [kind, ...rest].filter(Boolean);
  kind = 'writing';
}

const title = rest.join(' ').trim();
if (!title) {
  console.error('Usage: npm run new [writing|work|projects] "Title of the entry"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60)
  .replace(/-+$/, '');

const kindDir = join('src', 'content', kind);
const entryDir = join(kindDir, slug);
const file = join(entryDir, 'index.md');

if (existsSync(entryDir) || existsSync(`${entryDir}.md`)) {
  console.error(`An entry already exists at ${entryDir}. Pick a different title.`);
  process.exit(1);
}

// The next number is one past the highest already used in this kind, drafts included.
let highest = 0;
if (existsSync(kindDir)) {
  for (const name of readdirSync(kindDir, { recursive: true })) {
    if (!String(name).endsWith('.md')) continue;
    const match = readFileSync(join(kindDir, String(name)), 'utf8').match(/^number:\s*(\d+)/m);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
}

const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

const frontmatter = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `number: ${highest + 1}`,
  `date: ${today}`,
  'summary: ""',
  'tags: []',
  ...EXTRA[kind],
  'draft: true',
  '---',
  '',
  '',
].join('\n');

mkdirSync(entryDir, { recursive: true });
writeFileSync(file, frontmatter);
console.log(file);
