<script>
  import '../app.css';
  let { children } = $props();
</script>

<header>
  <h1>BETWEEN THE SHEETS</h1>
</header>

<main>
  {@render children()}
</main>

<style>
  header {
    border-bottom: var(--border);
    padding: 16px 20px;
  }

  header h1 {
    font-size: 1.1rem;
    letter-spacing: 2px;
  }

  main {
    flex: 1;
    padding: 20px;
    max-width: 480px;
    width: 100%;
    margin: 0 auto;
  }
</style>
