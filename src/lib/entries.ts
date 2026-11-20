import { getCollection, type CollectionEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';

export const KINDS = {
  work: { label: 'Work', prefix: 'W', blurb: 'Case studies from professional work.' },
  writing: { label: 'Writing', prefix: 'N', blurb: 'Engineering notes and essays.' },
  projects: { label: 'Projects', prefix: 'P', blurb: 'Things built off the clock.' },
} as const;

export type Kind = keyof typeof KINDS;
export type Entry = CollectionEntry<Kind>;
export const KIND_IDS = Object.keys(KINDS) as Kind[];

/** The plain shape lists and the home page filter work with. */
export interface Row {
  kind: Kind;
  no: string;
  title: string;
  summary?: string;
  meta: string;
  href: string;
  tags: string[];
  draft: boolean;
}

// Drafts are visible in dev. Set DRAFTS=1 to include them in a local production build.
const showDrafts = import.meta.env.DEV || process.env.DRAFTS === '1';

export async function getEntries(kind: Kind): Promise<Entry[]> {
  const entries: Entry[] = await getCollection(kind);

  const seen = new Map<number, string>();
  for (const entry of entries) {
    const other = seen.get(entry.data.number);
    if (other) {
      throw new Error(
        `Two ${kind} entries share number ${entry.data.number}: "${other}" and "${entry.id}". Give one of them a new number.`,
      );
    }
    seen.set(entry.data.number, entry.id);
  }

  return entries
    .filter((entry) => showDrafts || !entry.data.draft)
    .sort(
      (a, b) =>
        b.data.date.valueOf() - a.data.date.valueOf() || b.data.number - a.data.number,
    );
}

export async function getAllEntries(): Promise<Entry[]> {
  return (await Promise.all(KIND_IDS.map(getEntries))).flat();
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const entryNo = (entry: Entry) =>
  `${KINDS[entry.collection].prefix}-${String(entry.data.number).padStart(3, '0')}`;

export const entryHref = (entry: Entry) => `/${entry.collection}/${entry.id}/`;

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const tagHref = (tag: string) => `/tags/${tagSlug(tag)}/`;

/** The right-hand column of a list row: a period for work, a date for writing, a status for projects. */
export function entryMeta(entry: Entry): string {
  if (entry.collection === 'work') {
    return entry.data.period ?? String(entry.data.date.getUTCFullYear());
  }
  if (entry.collection === 'projects') return entry.data.status;
  return isoDate(entry.data.date);
}

export function toRow(entry: Entry): Row {
  return {
    kind: entry.collection,
    no: entryNo(entry),
    title: entry.data.title,
    summary: entry.data.summary,
    meta: entryMeta(entry),
    href: entryHref(entry),
    tags: entry.data.tags,
    draft: entry.data.draft,
  };
}

export const wordCount = (entry: Entry) =>
  (entry.body ?? '').split(/\s+/).filter(Boolean).length;

export const readingMinutes = (entry: Entry) => Math.max(1, Math.round(wordCount(entry) / 230));

let shallowRepo: boolean | undefined;

function lastCommitDate(file: string): Date | undefined {
  try {
    if (shallowRepo === undefined) {
      shallowRepo =
        execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim() === 'true';
    }
    // A shallow clone (common on build servers) reports the same date for every file.
    if (shallowRepo) return undefined;
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out) : undefined;
  } catch {
    return undefined;
  }
}

/** `updated` from frontmatter, else the file's last commit. Only returned when later than the publish date. */
export function revisedDate(entry: Entry): Date | undefined {
  const date = entry.data.updated ?? (entry.filePath ? lastCommitDate(entry.filePath) : undefined);
  if (!date) return undefined;
  return isoDate(date) > isoDate(entry.data.date) ? date : undefined;
}

/** Up to three other entries sharing the most tags with this one. */
export function related(entry: Entry, all: Entry[], limit = 3): Entry[] {
  const tags = new Set(entry.data.tags);
  return all
    .filter((other) => other !== entry && !(other.collection === entry.collection && other.id === entry.id))
    .map((other) => ({
      other,
      score: other.data.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || b.other.data.date.valueOf() - a.other.data.date.valueOf(),
    )
    .slice(0, limit)
    .map(({ other }) => other);
}
