<script lang="ts">
  import Stepper from './Stepper.svelte';
  import { game, playerPlay, playerPass } from '$lib/game.svelte';
  import { maxWager } from '$lib/rules';

  let wager = $state(1);
  let showWager = $state(false);

  const max = $derived(maxWager(game.activePlayer.balance, game.pot));

  function handlePlay() {
    playerPlay(wager);
  }

  function handleBack() {
    showWager = false;
    wager = 1;
  }

  function setHalf() {
    wager = Math.max(1, Math.floor(max / 2));
  }

  function setMax() {
    wager = max;
  }
</script>

{#if !showWager}
  <div class="actions">
    <button onclick={() => { showWager = true; wager = 1; }}>PLAY</button>
    <button class="secondary" onclick={playerPass}>PASS</button>
  </div>
{:else}
  <div class="wager-select">
    <p class="label">YOUR WAGER:</p>
    <Stepper value={wager} min={1} max={max} prefix="$" onchange={(v) => wager = v} />
    <div class="quick-btns">
      <button class="quick-btn secondary" onclick={setHalf}>HALF</button>
      <button class="quick-btn secondary" onclick={setMax}>MAX</button>
    </div>
    <p class="range">min $1 / max ${max}</p>
    <div class="actions">
      <button onclick={handlePlay}>LOCK IT IN</button>
      <button class="secondary" onclick={handleBack}>BACK</button>
    </div>
  </div>
{/if}

<style>
  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  .wager-select {
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
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .quick-btns {
    display: flex;
    gap: 8px;
  }
  .quick-btn {
    padding: 8px 16px;
    font-size: 1rem;
  }
  .range {
    font-size: 1rem;
    color: var(--muted);
  }
</style>
