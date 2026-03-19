import { describe, it, expect } from 'vitest';
import { getSpread, resolveResult, maxWager } from '$lib/rules';
import type { Card } from '$lib/types';

function card(rank: string, value: number | null, suit = 'hearts' as const): Card {
  return { rank: rank as Card['rank'], value, suit };
}

describe('getSpread', () => {
  it('returns spread between two valued cards', () => {
    expect(getSpread(card('5', 5), card('J', 11))).toBe(6);
  });
  it('returns spread regardless of order', () => {
    expect(getSpread(card('J', 11), card('5', 5))).toBe(6);
  });
  it('returns 0 for identical values', () => {
    expect(getSpread(card('7', 7), card('7', 7))).toBe(0);
  });
  it('returns 1 for consecutive values', () => {
    expect(getSpread(card('5', 5), card('6', 6))).toBe(1);
  });
  it('returns null if either card has null value', () => {
    expect(getSpread(card('A', null), card('7', 7))).toBeNull();
  });
});

describe('resolveResult', () => {
  it('returns "win" when inside range', () => {
    expect(resolveResult(card('4', 4), card('10', 10), card('5', 5))).toBe('win');
  });
  it('returns "win" regardless of boundary order', () => {
    expect(resolveResult(card('10', 10), card('4', 4), card('7', 7))).toBe('win');
  });
  it('returns "lose" when outside (above)', () => {
    expect(resolveResult(card('5', 5), card('J', 11), card('K', 13))).toBe('lose');
  });
  it('returns "lose" when outside (below)', () => {
    expect(resolveResult(card('5', 5), card('J', 11), card('3', 3))).toBe('lose');
  });
  it('returns "post" when matching low boundary', () => {
    expect(resolveResult(card('5', 5), card('J', 11), card('5', 5))).toBe('post');
  });
  it('returns "post" when matching high boundary', () => {
    expect(resolveResult(card('5', 5), card('J', 11), card('J', 11))).toBe('post');
  });
  it('works with Aces high (14)', () => {
    expect(resolveResult(card('A', 14), card('5', 5), card('10', 10))).toBe('win');
  });
  it('works with Aces low (1)', () => {
    expect(resolveResult(card('A', 1), card('10', 10), card('5', 5))).toBe('win');
  });
});

describe('maxWager', () => {
  it('returns the lesser of balance and pot', () => {
    expect(maxWager(30, 45)).toBe(30);
    expect(maxWager(50, 20)).toBe(20);
    expect(maxWager(20, 20)).toBe(20);
  });
});
