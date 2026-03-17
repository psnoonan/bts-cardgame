<script lang="ts">
  import { game, resetGame } from '$lib/game.svelte';

  const standings = $derived(
    [...game.players]
      .sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        return b.balance - a.balance;
      })
  );
</script>

<div class="gameover">
  <h2>GAME OVER</h2>
  <div class="leaderboard">
    {#each standings as player, i}
      <div class="row" class:eliminated={player.eliminated}>
        <span class="rank">{i + 1}.</span>
        <span class="name">{player.name}</span>
        <span class="balance">
          {#if player.eliminated}OUT{:else}${player.balance}{/if}
        </span>
        <span class="net" class:positive={player.balance - player.totalBuyIn > 0} class:negative={player.balance - player.totalBuyIn < 0}>
          ({player.balance - player.totalBuyIn >= 0 ? '+' : ''}{player.balance - player.totalBuyIn})
        </span>
      </div>
    {/each}
  </div>
  <button onclick={resetGame}>PLAY AGAIN</button>
</div>

<style>
  .gameover {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  h2 {
    font-size: 1rem;
    letter-spacing: 2px;
  }
  .leaderboard {
    width: 100%;
    border: var(--border);
    box-shadow: var(--shadow);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    font-family: var(--font-body);
    border-bottom: 2px solid var(--fg);
  }
  .row:last-child { border-bottom: none; }
  .row.eliminated {
    opacity: 0.4;
    text-decoration: line-through;
  }
  .rank {
    font-family: var(--font-pixel);
    font-size: 0.6rem;
    width: 24px;
  }
  .name { flex: 1; font-weight: bold; }
  .balance {
    font-family: var(--font-pixel);
    font-size: 0.6rem;
  }
  .net {
    font-family: var(--font-pixel);
    font-size: 0.5rem;
    width: 60px;
    text-align: right;
  }
  .net.positive { color: var(--success); }
  .net.negative { color: var(--danger); }
</style>
