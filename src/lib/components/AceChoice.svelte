<script lang="ts">
  import type { Card } from '$lib/types';
  import { SUIT_SYMBOLS } from '$lib/types';
  import { setAceValue } from '$lib/game.svelte';

  type Props = {
    hand: Card[];
  };

  let { hand }: Props = $props();

  const aceIndex = $derived(
    hand.findIndex((c, i) => i < 2 && c.rank === 'A' && c.value === null)
  );
</script>

{#if aceIndex >= 0}
  <div class="ace-choice">
    <p class="label">
      ACE OF {hand[aceIndex].suit.toUpperCase()} {SUIT_SYMBOLS[hand[aceIndex].suit]}
    </p>
    <div class="choices">
      <button onclick={() => setAceValue(aceIndex, 1)}>LOW (1)</button>
      <button onclick={() => setAceValue(aceIndex, 14)}>HIGH (14)</button>
    </div>
  </div>
{/if}

<style>
  .ace-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: var(--border);
    background: var(--bg);
  }
  .label {
    font-family: var(--font-pixel);
    font-size: 0.55rem;
    letter-spacing: 1px;
  }
  .choices {
    display: flex;
    gap: 12px;
  }
</style>
