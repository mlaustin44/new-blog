# matthewlaustin.com

Personal site: professional work, engineering writing, and projects. Built with [Astro](https://astro.build) as plain static HTML. The only JavaScript sent to browsers is the filter on the home page (one Svelte component).

## Writing an entry

```sh
npm run new "Title of the post"            # writing (the default)
npm run new work "Title of the case study"
npm run new projects "Title of the project"
```

This creates `src/content/<kind>/<slug>/index.md` with the date, the next entry number and `draft: true` filled in. Then:

1. Write Markdown in `index.md`. Put images in the same folder and reference them as `![alt text](./photo.jpg)`.
2. `npm run dev` to preview. Drafts are visible here and nowhere else.
3. Remove the `draft: true` line and push. Cloudflare builds and deploys.

### Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `number` | yes | Set by `npm run new`. Shown as `N-012`. Never reuse one; the build fails on duplicates. |
| `date` | yes | `YYYY-MM-DD` |
| `summary` | no | One sentence. Shown under the title and in lists. |
| `tags` | no | `[robotics, deployment]`. Each tag gets a page; shared tags drive "Goes with". |
| `updated` | no | Overrides the revised date, which otherwise comes from git history. |
| `draft` | no | `true` keeps the entry out of production builds. |
| `period`, `role`, `company` | no | Work entries only. |
| `status` | no | Projects only: `In progress`, `Finished` or `Shelved`. |

Reading time, the "On this page" list, the revised date and related entries are all derived. Nothing else needs typing.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload, drafts included |
| `npm run build` | Production build into `dist/`, then a check that shipped JavaScript stays under budget |
| `DRAFTS=1 npm run build` | The same, with drafts included, for checking layout |
| `npm run preview` | Serve the built `dist/` locally |

Requires Node 22.23.4 or newer (`.node-version` pins it for Cloudflare).

## Where things are

- `src/site.ts`: name, headline, intro and contact links.
- `src/pages/about.md`: the about page.
- `src/content/`: every entry, one folder each.
- `src/styles/global.css`: colors (light and dark) and all Markdown typography.
- `src/components/Catalog.svelte`: the home page filter and search.

## Deploying

Static output, no adapter. On Cloudflare the build command is `npm run build` and the output directory is `dist`.
