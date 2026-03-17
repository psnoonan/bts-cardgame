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
    continueAfterAutoPass,
    cashOut,
    getLastResult
  } from '$lib/game.svelte';

  let resultFlash = $state('');

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
  // Player advances via ResultDialog button, not a timer
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

          // Flash clears after animation completes
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
    <span class="pot">POT: <strong>${game.pot}</strong></span>
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
    {:else if game.phase === 'auto-pass'}
      <div class="auto-pass-msg">
        <p class="auto-pass-label">SPREAD TOO NARROW</p>
        <p class="auto-pass-sub">AUTO-PASS</p>
        <button onclick={continueAfterAutoPass}>NEXT</button>
      </div>
    {:else if game.phase === 'betting'}
      <WagerInput />
    {:else if game.phase === 'dealing'}
      <p class="dealing-label">Dealing...</p>
    {/if}
  </div>

  <!-- Player list -->
  <div class="players">
    {#each game.players as player, i}
      <PlayerBar {player} isActive={i === game.activePlayerIndex} />
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

  .pot { color: var(--fg); }
  .deck-count { color: var(--muted); }

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
    padding: 16px 0;
    min-height: 60px;
  }

  .auto-pass-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: var(--border);
    background: var(--bg);
  }

  .auto-pass-label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
    color: var(--muted);
  }

  .auto-pass-sub {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 2px;
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
