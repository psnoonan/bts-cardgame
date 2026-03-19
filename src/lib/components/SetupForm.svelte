<script lang="ts">
  import Stepper from './Stepper.svelte';
  import { game, startGame } from '$lib/game.svelte';

  let playerCount = $state(game.lastSetup?.players.length ?? 4);
  let ante = $state(game.lastSetup?.ante ?? 1);
  let playerNames = $state<string[]>(
    game.lastSetup?.players.map(p => p.name) ?? ['', '', '', '']
  );
  let playerBalances = $state<number[]>(
    game.lastSetup?.players.map(p => p.balance) ?? [20, 20, 20, 20]
  );

  function updatePlayerCount(count: number) {
    playerCount = count;
    while (playerNames.length < count) {
      playerNames.push('');
      playerBalances.push(20);
    }
    playerNames = playerNames.slice(0, count);
    playerBalances = playerBalances.slice(0, count);
  }

  function updateBalance(index: number, value: number) {
    playerBalances[index] = value;
  }

  function handleStart() {
    const players = playerNames.map((name, i) => ({
      name: name.trim() || `Player ${i + 1}`,
      balance: playerBalances[i]
    }));
    startGame(players, ante);
  }

  const canStart = $derived(
    playerCount >= 2 && playerBalances.every(b => b >= ante)
  );
</script>

<div class="setup">
  <section class="field">
    <label>HOW MANY PLAYERS?</label>
    <Stepper value={playerCount} min={2} max={10} onchange={updatePlayerCount} />
  </section>

  <section class="field">
    <label>ANTE</label>
    <Stepper value={ante} min={1} prefix="$" onchange={(v) => ante = v} />
  </section>

  <hr />

  <section class="players">
    {#each { length: playerCount } as _, i}
      <div class="player-row">
        <div class="player-name">
          <span class="player-label">P{i + 1}</span>
          <input
            type="text"
            placeholder="Player {i + 1}"
            bind:value={playerNames[i]}
          />
        </div>
        <Stepper
          value={playerBalances[i]}
          min={ante}
          prefix="$"
          onchange={(v) => updateBalance(i, v)}
        />
      </div>
    {/each}
  </section>

  <button class="deal-btn" onclick={handleStart} disabled={!canStart}>
    DEAL 'EM
  </button>
</div>

<style>
  .setup {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    letter-spacing: 1px;
  }

  hr {
    border: none;
    border-top: var(--border);
  }

  .players {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .player-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .player-name {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .player-label {
    font-family: var(--font-pixel);
    font-size: 1rem;
    white-space: nowrap;
  }

  .player-name input {
    width: 100%;
  }

  .deal-btn {
    margin-top: 16px;
    padding: 16px 24px;
    font-size: 1.1rem;
    box-shadow: var(--shadow);
  }
</style>
