# Between the Sheets

A party card game for 2-10 players, built with SvelteKit 5 and a chunky brutalist pixel-art aesthetic. Pass the phone around and bet on whether the next card falls between the two on the table.

```
  ┌─────┐   ┌─────┐   ┌─────┐
  │  5  │   │ ??? │   │  K  │
  │  ♥  │   │     │   │  ♠  │
  └─────┘   └─────┘   └─────┘
       [ PLAY $10 ]  [ PASS ]
```

## How to Play

1. **Setup** — Enter player names, set each player's starting balance, and choose an ante amount.
2. **Ante** — Everyone puts the ante into the pot.
3. **Deal** — Two cards are dealt face-up. If either is an Ace, the active player chooses High (14) or Low (1).
4. **Bet or Pass** — If the spread between the two cards is 2 or more, the active player can **Play** (wager up to the lesser of their balance or the pot) or **Pass**.
5. **Reveal** — A third card is dealt between the two:
   - **Inside** the range? You win your wager from the pot. Everyone re-antes.
   - **Outside** the range? Your wager goes into the pot.
   - **Match** one of the boundary cards? You pay double your wager (or your remaining balance if it's lower).
6. **Broke?** — If your balance hits zero, you can re-buy at any amount or bow out.
7. **Game Over** — Last player standing wins, or the group can **Cash Out** at any time (pot is split evenly).

## Getting Started

```bash
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173) in your browser.

## Build

Outputs static files to `build/` — deploy anywhere.

```bash
npm run build
npm run preview   # preview the production build locally
```

## Test

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

## Tech Stack

- [SvelteKit 5](https://svelte.dev/) with `adapter-static`
- TypeScript
- Svelte 5 runes for state management (`$state`, `$derived`, `$effect`)
- [Vitest](https://vitest.dev/) for testing
- [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) pixel font

## Design

Concrete Brutalist — warm paper background, heavy black borders, hard drop shadows, zero border-radius, pixel font headings, monospace body text.

## License

MIT
