<script lang="ts">
  import Stepper from './Stepper.svelte';
  import { game, handleRebuy, handleElimination } from '$lib/game.svelte';

  let amount = $state(game.activePlayer?.startingBalance ?? 20);
</script>

<div class="overlay">
  <div class="modal">
    <h3>{game.activePlayer.name} IS BROKE</h3>
    <div class="rebuy-section">
      <p class="label">RE-BUY?</p>
      <Stepper value={amount} min={game.ante} prefix="$" onchange={(v) => amount = v} />
    </div>
    <div class="actions">
      <button onclick={() => handleRebuy(amount)}>BUY BACK IN</button>
      <button class="secondary" onclick={handleElimination}>I'M OUT</button>
    </div>
  </div>
</div>

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
    padding: 24px;
    max-width: 360px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  h3 {
    font-size: 1rem;
    text-align: center;
  }
  .rebuy-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .actions {
    display: flex;
    gap: 12px;
  }
</style>
