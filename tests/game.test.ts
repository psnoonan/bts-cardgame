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

  describe('resolving a full turn — lose', () => {
    it('adds wager to pot, no re-ante', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
      // Alice: 19 after ante, Bob: 19 after ante, pot: 2
      game.hand = [
        { suit: 'hearts', rank: '5', value: 5 },
        { suit: 'spades', rank: 'J', value: 11 }
      ];
      game.phase = 'betting';
      playerPlay(2);

      // Force third card outside (above)
      game.deck.live.unshift({ suit: 'clubs', rank: 'K', value: 13 });
      dealThirdCard();
      advanceAfterResult();

      // Alice: 19 - 2 wager = 17, NO re-ante
      expect(game.players[0].balance).toBe(17);
      // Bob should NOT have been charged an ante
      expect(game.players[1].balance).toBe(19);
      expect(game.pot).toBe(4); // 2 original + 2 wager
      expect(game.phase).toBe('dealing');
      expect(game.activePlayerIndex).toBe(1); // advanced to Bob
    });
  });

  describe('resolving a full turn — post', () => {
    it('player pays full pot amount', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
      game.pot = 10;
      game.hand = [
        { suit: 'hearts', rank: '5', value: 5 },
        { suit: 'spades', rank: 'J', value: 11 }
      ];
      game.phase = 'betting';
      playerPlay(3);

      // Force third card to match boundary
      game.deck.live.unshift({ suit: 'clubs', rank: '5', value: 5 });
      dealThirdCard();
      advanceAfterResult();

      // Alice: 19 - min(pot=10, balance=19) = 9
      expect(game.players[0].balance).toBe(9);
      expect(game.pot).toBe(20); // 10 + 10 penalty
      expect(game.phase).toBe('dealing');
    });
  });

  describe('rebuy after loss (no spurious re-ante)', () => {
    it('does not collect antes when rebuy is from a lost wager', () => {
      startGame([{ name: 'Alice', balance: 4 }, { name: 'Bob', balance: 20 }], 1);
      // Alice: 3, Bob: 19, pot: 2
      game.pot = 10; // inflate pot so wager isn't capped
      game.hand = [
        { suit: 'hearts', rank: '3', value: 3 },
        { suit: 'spades', rank: 'K', value: 13 }
      ];
      game.phase = 'betting';
      playerPlay(3); // Alice bets all she has

      // Force outside
      game.deck.live.unshift({ suit: 'clubs', rank: '2', value: 2 });
      dealThirdCard();
      advanceAfterResult();

      // Alice is at 0, should be in rebuy
      expect(game.players[0].balance).toBe(0);
      expect(game.phase).toBe('rebuy');

      // Alice rebuys
      const bobBefore = game.players[1].balance;
      handleRebuy(10);

      // Should advance to Bob and deal, NOT collect antes
      expect(game.phase).toBe('dealing');
      expect(game.players[1].balance).toBe(bobBefore); // Bob not charged ante
      expect(game.activePlayerIndex).toBe(1);
    });
  });

  describe('rebuy during ante shortfall', () => {
    it('retries ante collection after rebuy', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 2 }], 1);
      // Alice: 19, Bob: 1, pot: 2
      game.pot = 10;
      game.hand = [
        { suit: 'hearts', rank: '3', value: 3 },
        { suit: 'spades', rank: 'K', value: 13 }
      ];
      game.phase = 'betting';
      playerPlay(5);

      // Force win — triggers re-ante
      game.deck.live.unshift({ suit: 'clubs', rank: '7', value: 7 });
      dealThirdCard();
      advanceAfterResult();

      // Alice won, re-ante starts. Bob has $1 which equals the ante, so antes should collect.
      // If Bob had $0 he'd need rebuy. Let's test the happy path here.
      expect(game.phase).toBe('dealing');
    });

    it('triggers rebuy when player cannot afford ante, then collects after rebuy', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 1 }], 1);
      // Alice: 19, Bob: 0, pot: 2. Bob can't afford next ante.
      game.pot = 10;
      game.hand = [
        { suit: 'hearts', rank: '3', value: 3 },
        { suit: 'spades', rank: 'K', value: 13 }
      ];
      game.phase = 'betting';
      playerPlay(5);

      // Force win — triggers re-ante, Bob can't afford it
      game.deck.live.unshift({ suit: 'clubs', rank: '7', value: 7 });
      dealThirdCard();
      advanceAfterResult();

      expect(game.phase).toBe('rebuy');
      expect(game.activePlayerIndex).toBe(1); // Bob needs rebuy

      const aliceBeforeRebuy = game.players[0].balance;
      handleRebuy(10);

      // After Bob rebuys, antes should be collected from both
      expect(game.phase).toBe('dealing');
      expect(game.players[0].balance).toBe(aliceBeforeRebuy - 1); // Alice anted
      expect(game.players[1].balance).toBe(10 - 1); // Bob: rebuy amount minus ante
    });
  });

  describe('elimination during ante collection', () => {
    it('retries ante collection after elimination', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 1 }, { name: 'Carol', balance: 20 }], 1);
      // Alice: 19, Bob: 0, Carol: 19, pot: 3
      game.pot = 10;
      game.hand = [
        { suit: 'hearts', rank: '3', value: 3 },
        { suit: 'spades', rank: 'K', value: 13 }
      ];
      game.phase = 'betting';
      playerPlay(5);

      // Force win
      game.deck.live.unshift({ suit: 'clubs', rank: '7', value: 7 });
      dealThirdCard();
      advanceAfterResult();

      // Bob can't afford ante
      expect(game.phase).toBe('rebuy');
      expect(game.activePlayerIndex).toBe(1);

      const aliceBefore = game.players[0].balance;
      const carolBefore = game.players[2].balance;
      handleElimination();

      // Bob eliminated, antes collected from Alice and Carol
      expect(game.players[1].eliminated).toBe(true);
      expect(game.phase).toBe('dealing');
      expect(game.players[0].balance).toBe(aliceBefore - 1);
      expect(game.players[2].balance).toBe(carolBefore - 1);
    });
  });

  describe('auto-pass on narrow spread', () => {
    it('auto-passes when spread is 0', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
      game.hand = [
        { suit: 'hearts', rank: '7', value: 7 },
        { suit: 'spades', rank: '7', value: 7 }
      ];
      game.phase = 'dealing';
      // Manually trigger the spread check that dealBoundaryCards would do
      game.deck.live.unshift(
        { suit: 'hearts', rank: '7', value: 7 },
        { suit: 'spades', rank: '7', value: 7 }
      );
      dealBoundaryCards();

      // Should auto-pass and advance
      expect(game.phase).toBe('dealing');
      expect(game.activePlayerIndex).toBe(1);
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

    it('gives remainder to active player on uneven split', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }, { name: 'Carol', balance: 20 }], 1);
      // pot = 3 (3 players * $1 ante), set to 10 for a clear remainder
      game.pot = 10;

      cashOut();

      // 10 / 3 = 3 each, remainder 1 goes to active player (Alice, index 0)
      expect(game.players[0].balance).toBe(19 + 3 + 1); // 19 after ante + share + remainder
      expect(game.players[1].balance).toBe(19 + 3);
      expect(game.players[2].balance).toBe(19 + 3);
      expect(game.pot).toBe(0);
    });

    it('excludes eliminated players from pot split', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }, { name: 'Carol', balance: 20 }], 1);
      game.pot = 10;
      game.players[1].eliminated = true; // Bob is out

      cashOut();

      // 10 / 2 active = 5 each, no remainder
      expect(game.players[0].balance).toBe(19 + 5);
      expect(game.players[1].balance).toBe(19); // Bob gets nothing
      expect(game.players[2].balance).toBe(19 + 5);
      expect(game.pot).toBe(0);
    });

    it('handles zero pot gracefully', () => {
      startGame([{ name: 'Alice', balance: 20 }, { name: 'Bob', balance: 20 }], 1);
      game.pot = 0;
      const aliceBefore = game.players[0].balance;

      cashOut();

      expect(game.phase).toBe('gameover');
      expect(game.players[0].balance).toBe(aliceBefore); // unchanged
      expect(game.pot).toBe(0);
    });
  });
});
