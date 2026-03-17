<script lang="ts">
  import type { Player } from '$lib/types';

  type Props = {
    player: Player;
    isActive: boolean;
  };

  let { player, isActive }: Props = $props();
</script>

<div class="player-bar" class:active={isActive} class:eliminated={player.eliminated}>
  <span class="indicator">{isActive ? '>' : '\u00A0'}</span>
  <span class="name">{player.name}</span>
  <span class="balance">
    {#if player.eliminated}OUT{:else}${player.balance}{/if}
  </span>
  {#if isActive && !player.eliminated}
    <span class="active-tag">ACTIVE</span>
  {/if}
</div>

<style>
  .player-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-family: var(--font-body);
    font-size: 1rem;
    border-bottom: 2px solid var(--fg);
  }
  .player-bar.active {
    border-left: 6px solid var(--fg);
    font-weight: bold;
    background: rgba(26, 26, 26, 0.08);
  }
  .player-bar.eliminated {
    opacity: 0.35;
    text-decoration: line-through;
  }
  .indicator {
    width: 16px;
    font-family: var(--font-pixel);
    font-size: 0.7rem;
  }
  .name { flex: 1; }
  .balance {
    font-family: var(--font-pixel);
    font-size: 0.7rem;
  }
  .active-tag {
    font-family: var(--font-pixel);
    font-size: 0.5rem;
    background: var(--fg);
    color: var(--bg);
    padding: 4px 8px;
    letter-spacing: 1px;
    border: 2px solid var(--fg);
  }
</style>
