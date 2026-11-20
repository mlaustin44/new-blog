<script>
  // A list of entries. Rendered as plain HTML on section and tag pages,
  // and inside the interactive Catalog on the home page.
  let { rows, summaries = false } = $props();
</script>

<ul class="rows">
  {#each rows as row (row.href)}
    <li>
      <a class="row" class:tall={summaries && row.summary} href={row.href}>
        <span class="no">{row.no}</span>
        <span class="main">
          <span class="title">{row.title}</span>
          {#if summaries && row.summary}
            <span class="summary">{row.summary}</span>
          {/if}
        </span>
        <span class="meta">{#if row.draft}<span class="draft">Draft</span>{/if}{row.meta}</span>
      </a>
    </li>
  {/each}
</ul>

<style>
  .rows {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    border-bottom: 1px solid var(--rule);
  }

  /* The link is wider than the rule under it, so the hover highlight has room around the text. */
  .row {
    display: grid;
    grid-template-columns: 3.75rem minmax(0, 1fr) auto;
    gap: 0 1.25rem;
    align-items: baseline;
    margin-inline: -0.75rem;
    padding: 0.875rem 0.75rem;
    text-decoration: none;
  }

  .row.tall {
    padding-block: 1.125rem;
  }

  .no,
  .meta {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--muted);
  }

  .meta {
    display: flex;
    align-items: baseline;
    gap: 0.625rem;
    white-space: nowrap;
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 0.1875rem;
  }

  .title {
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.3;
  }

  .tall .title {
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .summary {
    color: var(--muted);
  }

  .draft {
    padding: 0 0.375rem;
    border: 1px dashed currentColor;
  }

  /* On the highlighter, everything reads in one ink. */
  .row:hover .no,
  .row:hover .meta,
  .row:hover .summary {
    color: var(--mark-ink);
  }

  @media (max-width: 30rem) {
    .row {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .no {
      display: none;
    }
  }
</style>
