<script lang="ts">
  import type { Card } from '$lib/types';

  type Props = {
    card?: Card | null;
    faceDown?: boolean;
  };

  let { card = null, faceDown = false }: Props = $props();

  const suitSymbols: Record<string, string> = {
    hearts: '\u2665',
    diamonds: '\u2666',
    clubs: '\u2663',
    spades: '\u2660'
  };

  const isRed = $derived(
    card ? card.suit === 'hearts' || card.suit === 'diamonds' : false
  );

  const displayValue = $derived(card ? card.rank : '?');
</script>

<div class="card" class:face-down={faceDown || !card} class:red={isRed}>
  {#if card && !faceDown}
    <span class="value top-left">{displayValue}</span>
    <span class="suit center">{suitSymbols[card.suit]}</span>
    <span class="value bottom-right">{displayValue}</span>
  {:else}
    <div class="card-back">
      <div class="pattern"></div>
    </div>
  {/if}
</div>

<style>
  .card {
    width: 80px;
    height: 112px;
    border: var(--border);
    box-shadow: var(--shadow);
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-pixel);
    user-select: none;
  }

  .card.red {
    color: var(--danger);
  }

  .card.face-down {
    background: var(--fg);
  }

  .value {
    position: absolute;
    font-size: 0.65rem;
    line-height: 1;
  }

  .top-left {
    top: 6px;
    left: 6px;
  }

  .bottom-right {
    bottom: 6px;
    right: 6px;
    transform: rotate(180deg);
  }

  .suit.center {
    font-size: 1.5rem;
  }

  .card-back {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pattern {
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    border: 2px solid var(--accent);
    background:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 4px,
        var(--accent) 4px,
        var(--accent) 5px
      );
    opacity: 0.6;
  }
</style>
