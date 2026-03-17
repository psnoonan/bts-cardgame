import { describe, it, expect } from 'vitest';
import { createDeck, shuffle, dealCard } from '$lib/deck';

describe('createDeck', () => {
  it('creates a 52-card deck', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
  });

  it('has 13 cards per suit', () => {
    const deck = createDeck();
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    for (const suit of suits) {
      expect(deck.filter(c => c.suit === suit)).toHaveLength(13);
    }
  });

  it('Aces have null value', () => {
    const deck = createDeck();
    const aces = deck.filter(c => c.rank === 'A');
    expect(aces).toHaveLength(4);
    for (const ace of aces) expect(ace.value).toBeNull();
  });

  it('number cards have correct values', () => {
    const deck = createDeck();
    const fives = deck.filter(c => c.rank === '5');
    for (const card of fives) expect(card.value).toBe(5);
  });

  it('face cards have correct values (J=11, Q=12, K=13)', () => {
    const deck = createDeck();
    for (const j of deck.filter(c => c.rank === 'J')) expect(j.value).toBe(11);
    for (const q of deck.filter(c => c.rank === 'Q')) expect(q.value).toBe(12);
    for (const k of deck.filter(c => c.rank === 'K')) expect(k.value).toBe(13);
  });
});

describe('shuffle', () => {
  it('returns all 52 cards', () => {
    expect(shuffle(createDeck())).toHaveLength(52);
  });

  it('does not mutate the original array', () => {
    const deck = createDeck();
    const original = [...deck];
    shuffle(deck);
    expect(deck).toEqual(original);
  });

  it('changes card order (statistical)', () => {
    const deck = createDeck();
    const shuffled = shuffle(deck);
    const samePosition = deck.filter((c, i) => c.suit === shuffled[i].suit && c.rank === shuffled[i].rank);
    expect(samePosition.length).toBeLessThan(52);
  });
});

describe('dealCard', () => {
  it('returns the top card and remaining deck', () => {
    const deck = createDeck();
    const { card, remaining } = dealCard(deck);
    expect(card).toEqual(deck[0]);
    expect(remaining).toHaveLength(51);
  });

  it('does not mutate the original array', () => {
    const deck = createDeck();
    const original = [...deck];
    dealCard(deck);
    expect(deck).toEqual(original);
  });
});
