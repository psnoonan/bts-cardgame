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
    onchange(Math.max(min, value - step));
  }

  function increment() {
    onchange(Math.min(max, value + step));
  }

  function handleInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onchange(Math.min(max, Math.max(min, num)));
    }
  }

  function handleBlur() {
    // Ensure value is clamped on blur even if user typed out-of-range
    onchange(Math.min(max, Math.max(min, value)));
  }
</script>

<div class="stepper">
  <button class="step-btn" type="button" onclick={decrement} disabled={value <= min}>-</button>
  <input
    class="step-input"
    type="text"
    inputmode="numeric"
    value="{prefix}{value}"
    oninput={handleInput}
    onblur={handleBlur}
  />
  <button class="step-btn" type="button" onclick={increment} disabled={value >= max}>+</button>
</div>

<style>
  .stepper {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .step-btn {
    width: 44px;
    height: 44px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-family: var(--font-pixel);
  }

  .step-input {
    font-family: var(--font-pixel);
    font-size: 1rem;
    min-width: 70px;
    max-width: 90px;
    text-align: center;
    padding: 0 8px;
    border-top: var(--border);
    border-bottom: var(--border);
    border-left: none;
    border-right: none;
    height: 44px;
    background: #fff;
    color: var(--fg);
    border-radius: 0;
  }

  .step-input:focus {
    outline: 3px solid var(--accent);
    outline-offset: -3px;
  }
</style>
