<script>
  // The home page list: filter by kind, search across everything.
  // Without JavaScript the kind links are ordinary links to /work/, /writing/ and /projects/.
  import EntryList from './EntryList.svelte';

  let { groups } = $props();

  let kind = $state('all');
  let query = $state('');

  const needle = $derived(query.trim().toLowerCase());
  const total = $derived(groups.reduce((sum, group) => sum + group.total, 0));

  const matches = (row, text) =>
    `${row.no} ${row.title} ${row.summary ?? ''} ${row.tags.join(' ')}`.toLowerCase().includes(text);

  const shown = $derived(
    groups
      .filter((group) => kind === 'all' || group.id === kind)
      .map((group) => {
        const narrowed = kind !== 'all' || needle !== '';
        const rows = needle ? group.rows.filter((row) => matches(row, needle)) : group.rows;
        return {
          ...group,
          rows: narrowed ? rows : rows.slice(0, group.preview),
          more: !narrowed && rows.length > group.preview,
        };
      })
      .filter((group) => group.rows.length > 0),
  );

  function pick(event, id) {
    event.preventDefault();
    kind = id;
  }
</script>

<div class="controls">
  <nav class="kinds" aria-label="Filter by kind">
    <a
      href="/"
      class:on={kind === 'all'}
      aria-current={kind === 'all' ? 'true' : undefined}
      onclick={(event) => pick(event, 'all')}
    >
      <span>Everything</span><span class="n">{total}</span>
    </a>
    {#each groups as group (group.id)}
      <a
        href={group.href}
        class:on={kind === group.id}
        aria-current={kind === group.id ? 'true' : undefined}
        onclick={(event) => pick(event, group.id)}
      >
        <span>{group.label}</span><span class="n">{group.total}</span>
      </a>
    {/each}
  </nav>
  <label class="search">
    <span>Search</span>
    <input type="search" bind:value={query} autocomplete="off" />
  </label>
</div>

<div class="groups">
  {#each shown as group (group.id)}
    <section>
      <header>
        <h2>{group.label}</h2>
        {#if group.more}
          <a class="all" href={group.href}>All {group.total}</a>
        {/if}
      </header>
      <EntryList rows={group.rows} summaries={group.id === 'work'} />
    </section>
  {:else}
    <p class="empty">
      {#if total === 0}
        Nothing published yet.
      {:else}
        <strong>Nothing matches that search.</strong> Try a broader word, or pick Everything.
      {/if}
    </p>
  {/each}
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 1.5rem;
    padding-bottom: 1.75rem;
  }

  .kinds {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-left: -0.75rem;
  }

  .kinds a {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-height: 44px;
    padding: 0.625rem 0.75rem;
    font-weight: 500;
    text-decoration: none;
  }

  .kinds a.on {
    background: var(--mark);
    color: var(--mark-ink);
    font-weight: 700;
  }

  .n {
    font-family: var(--font-mono);
    font-size: 0.78125rem;
    font-weight: 400;
    color: var(--muted);
  }

  .kinds a.on .n,
  .kinds a:hover .n {
    color: var(--mark-ink);
  }

  .search {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    border-bottom: 1px solid var(--ink);
    font-size: 0.90625rem;
    color: var(--muted);
  }

  .search:focus-within {
    outline: 2px solid var(--ink);
    outline-offset: 4px;
  }

  .search input:focus-visible {
    outline: none;
  }

  .search input {
    width: 11.25rem;
    height: 40px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 1rem;
  }

  .groups {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
    padding-bottom: 5.5rem;
  }

  section > header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--ink);
  }

  h2 {
    margin: 0;
    font-weight: 800;
    font-size: 1.375rem;
    line-height: 1.2;
    letter-spacing: -0.015em;
  }

  .all {
    font-size: 0.90625rem;
    color: var(--muted);
  }

  .all:hover {
    color: var(--mark-ink);
  }

  .empty {
    margin: 0;
    font-size: 1.125rem;
  }
</style>
