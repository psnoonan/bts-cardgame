<script>
  import { game } from '$lib/game.svelte';
  import SetupForm from '$lib/components/SetupForm.svelte';
  import GameBoard from '$lib/components/GameBoard.svelte';
  import RebuyPrompt from '$lib/components/RebuyPrompt.svelte';
  import GameOver from '$lib/components/GameOver.svelte';
</script>

{#if game.phase === 'setup'}
  <SetupForm />
{:else if game.phase === 'gameover'}
  <GameOver />
{:else}
  <GameBoard />
  {#if game.phase === 'rebuy'}
    <RebuyPrompt />
  {/if}
{/if}
