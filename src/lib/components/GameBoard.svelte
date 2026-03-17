<script lang="ts">
  import Card from './Card.svelte';
  import PlayerBar from './PlayerBar.svelte';
  import AceChoice from './AceChoice.svelte';
  import WagerInput from './WagerInput.svelte';
  import GameLog from './GameLog.svelte';
  import {
    game,
    dealBoundaryCards,
    dealThirdCard,
    advanceAfterResult,
    cashOut,
    getLastResult
  } from '$lib/game.svelte';

  let resultFlash = $state('');

  // Auto-deal when entering dealing phase
  $effect(() => {
    if (game.phase === 'dealing' && game.hand.length === 0) {
      const timeout = setTimeout(() => dealBoundaryCards(), 300);
      return () => clearTimeout(timeout);
    }
  });

  // Auto-deal third card after wager is locked in, then advance after delay
  $effect(() => {
    if (game.phase === 'result' && game.hand.length === 2) {
      let innerTimeout: ReturnType<typeof setTimeout>;
      const outerTimeout = setTimeout(() => {
        dealThirdCard();
        const result = getLastResult();
        if (result === 'win') resultFlash = 'flash-win';
        else if (result === 'lose') resultFlash = 'flash-lose';
        else if (result === 'post') resultFlash = 'flash-post';

        // Show result for 2 seconds, then advance
        innerTimeout = setTimeout(() => {
          resultFlash = '';
          advanceAfterResult();
        }, 2000);
      }, 500);
      return () => {
        clearTimeout(outerTimeout);
        clearTimeout(innerTimeout);
      };
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
    {:else if game.phase === 'betting'}
      <WagerInput />
    {:else if game.phase === 'result' && game.hand.length === 3}
      <p class="result-label">
        {#if getLastResult() === 'win'}
          WIN! +${game.currentWager}
        {:else if getLastResult() === 'lose'}
          LOSE! -${game.currentWager}
        {:else}
          POST!
        {/if}
      </p>
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
    font-size: 0.55rem;
    letter-spacing: 1px;
  }

  .pot { color: var(--accent); }
  .deck-count { color: var(--muted); }

  .cash-out {
    margin-left: auto;
    font-size: 0.45rem;
    padding: 6px 10px;
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

  .result-label, .dealing-label {
    font-family: var(--font-pixel);
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-align: center;
  }

  .players {
    border-top: var(--border);
  }
</style>
