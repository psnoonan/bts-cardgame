<script lang="ts">
  type Props = {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    onchange: (value: number) => void;
  };

  let { value, min = 1, max = Infinity, step = 1, prefix = '', onchange }: Props = $props();

  function decrement() {
    const next = Math.max(min, value - step);
    onchange(next);
  }

  function increment() {
    const next = Math.min(max, value + step);
    onchange(next);
  }
</script>

<div class="stepper">
  <button class="step-btn" onclick={decrement} disabled={value <= min}>-</button>
  <span class="step-value">{prefix}{value}</span>
  <button class="step-btn" onclick={increment} disabled={value >= max}>+</button>
</div>

<style>
  .stepper {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .step-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-family: var(--font-pixel);
  }

  .step-value {
    font-family: var(--font-pixel);
    font-size: 0.75rem;
    min-width: 60px;
    text-align: center;
    padding: 0 8px;
    border-top: var(--border);
    border-bottom: var(--border);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
