<script lang="ts">
  import { untrack } from 'svelte';
  import Card from './Card.svelte';
  import PlayerBar from './PlayerBar.svelte';
  import AceChoice from './AceChoice.svelte';
  import WagerInput from './WagerInput.svelte';
  import GameLog from './GameLog.svelte';
  import {
    game,
    dealBoundaryCards,
    dealThirdCard,
    cashOut,
    getLastResult
  } from '$lib/game.svelte';

  let resultFlash = $state('');

  // Rotate player list so active player is always first, show max 3
  const visiblePlayers = $derived(() => {
    const active = game.activePlayerIndex;
    const all = game.players;
    const rotated = [...all.slice(active), ...all.slice(0, active)];
    return rotated.slice(0, 3).map((p, i) => ({
      player: p,
      originalIndex: (active + i) % all.length
    }));
  });

  // Auto-deal when entering dealing phase
  $effect(() => {
    if (game.phase === 'dealing') {
      const handEmpty = untrack(() => game.hand.length === 0);
      if (handEmpty) {
        const timeout = setTimeout(() => dealBoundaryCards(), 300);
        return () => clearTimeout(timeout);
      }
    }
  });

  // Auto-deal third card after wager is locked in (dramatic reveal)
  $effect(() => {
    if (game.phase === 'result') {
      const readyToDeal = untrack(() => game.hand.length === 2);
      if (readyToDeal) {
        const timeout = setTimeout(() => {
          dealThirdCard();
          const result = getLastResult();
          if (result === 'win') resultFlash = 'flash-win';
          else if (result === 'lose') resultFlash = 'flash-lose';
          else if (result === 'post') resultFlash = 'flash-post';

          setTimeout(() => { resultFlash = ''; }, 1600);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  });
</script>

<div class="board">
  <!-- Status bar -->
  <div class="status-bar">
    <span class="pot">POT: ${game.pot}</span>
    <span class="deck-count">DECK: {game.deck.live.length}</span>
    <button class="cash-out secondary" onclick={cashOut}>CASH OUT</button>
  </div>

  <!-- Card area -->
  <div class="card-area {resultFlash}">
    <Card card={game.hand[0] ?? null} />
    <Card card={game.hand[2] ?? null} faceDown={game.hand.length < 3} />
    <Card card={game.hand[1] ?? null} />
  </div>

  <!-- Phase-specific actions -->
  <div class="actions-area">
    {#if game.phase === 'ace-choice'}
      <AceChoice hand={game.hand} />
    {:else if game.phase === 'betting'}
      <WagerInput />
    {:else if game.phase === 'dealing'}
      <p class="dealing-label">Dealing...</p>
    {/if}
  </div>

  <!-- Player list — rotated so active is always top, capped at 3 -->
  <div class="players">
    {#each visiblePlayers() as { player, originalIndex }}
      <PlayerBar {player} isActive={originalIndex === game.activePlayerIndex} />
    {/each}
  </div>

  <!-- Game log -->
  <GameLog entries={game.log} />
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .status-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: var(--border);
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .pot {
    color: var(--fg);
    min-width: 100px;
  }
  .deck-count {
    color: var(--muted);
    min-width: 90px;
  }

  .cash-out {
    margin-left: auto;
    font-size: 1rem;
    padding: 8px 12px;
  }

  .card-area {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
  }

  .actions-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
    min-height: 80px;
  }

  .dealing-label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
    text-align: center;
  }

  .players {
    border-top: var(--border);
  }
</style>
