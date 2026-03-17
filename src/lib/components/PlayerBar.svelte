<script lang="ts">
  import type { Player } from '$lib/types';

  type Props = {
    player: Player;
    isActive: boolean;
  };

  let { player, isActive }: Props = $props();
</script>

<div class="player-bar" class:active={isActive} class:eliminated={player.eliminated}>
  <span class="indicator">{isActive ? '\u25B8' : '\u00A0'}</span>
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
    padding: 8px 12px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    border-bottom: 2px solid var(--fg);
  }
  .player-bar.active {
    border-left: 6px solid var(--fg);
    font-weight: bold;
    background: rgba(26, 26, 26, 0.05);
  }
  .player-bar.eliminated {
    opacity: 0.4;
    text-decoration: line-through;
  }
  .indicator {
    width: 12px;
    font-family: var(--font-pixel);
    font-size: 0.6rem;
  }
  .name { flex: 1; }
  .balance {
    font-family: var(--font-pixel);
    font-size: 0.65rem;
  }
  .active-tag {
    font-family: var(--font-pixel);
    font-size: 0.45rem;
    background: var(--accent);
    color: var(--fg);
    padding: 3px 6px;
    letter-spacing: 1px;
  }
</style>
