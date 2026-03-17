<script lang="ts">
  import { game, advanceAfterResult, getLastResult } from '$lib/game.svelte';

  const result = $derived(getLastResult());
</script>

{#if result}
  <div class="overlay">
    <div class="modal">
      <h3>{game.activePlayer.name}</h3>

      {#if result === 'win'}
        <p class="result win">WIN!</p>
        <p class="impact">+${game.currentWager} from pot</p>
      {:else if result === 'lose'}
        <p class="result lose">LOSE!</p>
        <p class="impact">-${game.currentWager} to pot</p>
      {:else}
        <p class="result post">POST!</p>
        <p class="impact">DOUBLE: -${Math.min(game.currentWager * 2, game.activePlayer.balance + game.currentWager * 2)}</p>
      {/if}

      <button onclick={advanceAfterResult}>CONTINUE</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 26, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }

  .modal {
    background: var(--bg);
    border: var(--border);
    box-shadow: var(--shadow);
    padding: 32px;
    max-width: 360px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }

  h3 {
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .result {
    font-family: var(--font-pixel);
    font-size: 1.5rem;
    letter-spacing: 2px;
  }

  .result.win { color: var(--success); }
  .result.lose { color: var(--danger); }
  .result.post { color: var(--danger); }

  .impact {
    font-family: var(--font-pixel);
    font-size: 1rem;
  }

  button {
    margin-top: 8px;
    padding: 14px 32px;
  }
</style>
