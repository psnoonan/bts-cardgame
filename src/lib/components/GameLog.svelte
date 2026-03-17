<script lang="ts">
  import type { LogEntry } from '$lib/types';

  type Props = {
    entries: LogEntry[];
  };

  let { entries }: Props = $props();
</script>

<div class="log">
  {#each entries.slice(0, 20) as entry}
    <p class="entry">&gt; {entry.message}</p>
  {/each}
</div>

<style>
  .log {
    border-top: var(--border);
    padding: 12px 0;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .entry {
    font-family: var(--font-body);
    font-size: 1rem;
    padding: 2px 12px;
    line-height: 1.6;
    color: var(--fg);
  }
  .entry:nth-child(even) {
    background: rgba(26, 26, 26, 0.04);
  }
  .entry:first-child {
    font-weight: bold;
  }
</style>
