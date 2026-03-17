import { describe, it, expect, beforeEach } from 'vitest';
import {
  game,
  startGame,
  dealBoundaryCards,
  setAceValue,
  playerPass,
  playerPlay,
  dealThirdCard,
  advanceAfterResult,
  handleRebuy,
  handleElimination,
  cashOut,
  resetGame
} from '$lib/game.svelte';

describe('game state machine', () => {
  beforeEach(() => {
    resetGame();
  });

  describe('startGame', () => {
    it('initializes players, deck, pot with antes', () => {
      startGame(
        [{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 30 }],
        2
      );
      expect(game.phase).toBe('dealing');
      expect(game.players).toHaveLength(2);
      expect(game.players[0].balance).toBe(18); // 20 - 2 ante
      expect(game.players[1].balance).toBe(28); // 30 - 2 ante
      expect(game.pot).toBe(4);
      expect(game.ante).toBe(2);
      expect(game.activePlayerIndex).toBe(0);
      expect(game.deck.live.length + game.deck.used.length).toBe(52);
    });
  });

  describe('dealBoundaryCards', () => {
    beforeEach(() => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
    });

    it('deals two cards to the hand', () => {
      // Ensure the first two cards have a wide spread so no auto-pass
      const lowIdx = game.deck.live.findIndex(c => c.rank === '3');
      if (lowIdx > 0) {
        [game.deck.live[0], game.deck.live[lowIdx]] =
          [game.deck.live[lowIdx], game.deck.live[0]];
      }
      const highIdx = game.deck.live.findIndex((c, i) => i > 0 && c.rank === 'K');
      if (highIdx > 1) {
        [game.deck.live[1], game.deck.live[highIdx]] =
          [game.deck.live[highIdx], game.deck.live[1]];
      }
      dealBoundaryCards();
      expect(game.hand).toHaveLength(2);
      expect(game.deck.live).toHaveLength(50);
    });

    it('enters ace-choice phase if an Ace is dealt', () => {
      const aceIndex = game.deck.live.findIndex(c => c.rank === 'A');
      if (aceIndex > 0) {
        [game.deck.live[0], game.deck.live[aceIndex]] =
          [game.deck.live[aceIndex], game.deck.live[0]];
      }
      dealBoundaryCards();
      expect(game.phase).toBe('ace-choice');
    });
  });

  describe('resolving a full turn — win', () => {
    it('pays wager from pot on win, triggers re-ante', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);

      // Inflate pot so the $5 wager isn't capped by maxWager
      game.pot = 10;

      // Manually set hand to known values
      game.hand = [
        { suit: 'hearts', rank: '3', value: 3 },
        { suit: 'spades', rank: 'K', value: 13 }
      ];
      game.phase = 'betting';

      playerPlay(5);

      // Force third card to be inside
      game.deck.live.unshift({ suit: 'clubs', rank: '7', value: 7 });
      dealThirdCard();
      advanceAfterResult(); // UI would call this after display delay

      // Alice: started 20, -1 ante = 19, +5 win = 24, -1 re-ante = 23
      expect(game.phase).toBe('dealing');
      expect(game.players[0].balance).toBe(20 - 1 + 5 - 1);
    });
  });

  describe('cashOut', () => {
    it('splits pot among non-eliminated players', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
      const aliceBefore = game.players[0].balance;
      const bobBefore = game.players[1].balance;

      cashOut();

      expect(game.phase).toBe('gameover');
      expect(game.players[0].balance).toBe(aliceBefore + 1);
      expect(game.players[1].balance).toBe(bobBefore + 1);
      expect(game.pot).toBe(0);
    });
  });
});
