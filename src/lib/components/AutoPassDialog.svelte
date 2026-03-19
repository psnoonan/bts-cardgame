<script lang="ts">
  import { game, continueAfterAutoPass } from '$lib/game.svelte';
  import Card from './Card.svelte';
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="Auto-pass notification">
  <div class="modal">
    <h3>{game.activePlayer.name}</h3>

    <div class="cards">
      <Card card={game.hand[0] ?? null} />
      <Card card={game.hand[1] ?? null} />
    </div>

    <p class="label">SPREAD TOO NARROW</p>
    <p class="sub">AUTO-PASS</p>

    <button onclick={continueAfterAutoPass}>NEXT</button>
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

  .cards {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
    color: var(--muted);
  }

  .sub {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 2px;
  }

  button {
    margin-top: 8px;
    padding: 14px 32px;
  }
</style>
