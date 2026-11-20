import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each entry is a folder: src/content/<kind>/<slug>/index.md, with its images beside it.
// A single file, src/content/<kind>/<slug>.md, also works.
const folder = (kind: string) =>
  glob({
    base: `./src/content/${kind}`,
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/(\/index)?\.md$/, ''),
  });

const common = {
  title: z.string(),
  // Entry number, shown as W-001 / N-001 / P-001. `npm run new` assigns the next one.
  number: z.number().int().positive(),
  date: z.coerce.date(),
  // Optional. Without it, the revised date comes from git history.
  updated: z.coerce.date().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  // Drafts show in `npm run dev` and never in a production build.
  draft: z.boolean().default(false),
};

export const collections = {
  work: defineCollection({
    loader: folder('work'),
    schema: z.object({
      ...common,
      period: z.string().optional(),
      role: z.string().optional(),
      company: z.string().optional(),
    }),
  }),
  writing: defineCollection({
    loader: folder('writing'),
    schema: z.object(common),
  }),
  projects: defineCollection({
    loader: folder('projects'),
    schema: z.object({
      ...common,
      status: z.enum(['In progress', 'Finished', 'Shelved']).default('Finished'),
    }),
  }),
};
