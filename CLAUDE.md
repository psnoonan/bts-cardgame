# CLAUDE.md

## Commands

- `npm run dev` — dev server
- `npm run build` — static build to `build/`
- `npm run test` — vitest (all tests)
- `npm run test -- tests/game.test.ts` — run a specific test file

## Architecture Gotchas

- **Two-step result flow:** `dealThirdCard()` does NOT apply the result. It deals the card and caches the result in a module-level `lastResult`. The UI calls `advanceAfterResult()` after a 2-second display delay. If you add result logic, respect this separation.

- **Rebuy reason tracking:** `pendingAnteCollection` flag in `game.svelte.ts` tracks whether a rebuy was triggered by an ante shortfall (re-collect antes after) vs. going bust on a wager (just advance). Both `handleRebuy` and `handleElimination` branch on this flag. Getting this wrong causes spurious antes or skipped antes.

- **`resetGame()` preserves `lastSetup`:** This is intentional for "Play Again" to remember previous player names/balances. Don't clear it.

## Svelte 5 Only

This project uses Svelte 5 runes exclusively. Do not use Svelte 4 patterns (`$:`, `export let`, stores, `createEventDispatcher`). Use `$state`, `$derived`, `$effect`, `$props`.
