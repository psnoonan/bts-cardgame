<script>
  import { game } from '$lib/game.svelte';
  import SetupForm from '$lib/components/SetupForm.svelte';
</script>

{#if game.phase === 'setup'}
  <SetupForm />
{:else}
  <p>Game phase: {game.phase}</p>
{/if}
