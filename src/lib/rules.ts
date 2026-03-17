import type { Card } from './types';

export type Result = 'win' | 'lose' | 'post';

export function getSpread(card1: Card, card2: Card): number | null {
  if (card1.value === null || card2.value === null) return null;
  return Math.abs(card1.value - card2.value);
}

export function resolveResult(boundary1: Card, boundary2: Card, middle: Card): Result {
  const low = Math.min(boundary1.value!, boundary2.value!);
  const high = Math.max(boundary1.value!, boundary2.value!);
  const val = middle.value!;
  if (val === low || val === high) return 'post';
  if (val > low && val < high) return 'win';
  return 'lose';
}

export function maxWager(balance: number, pot: number): number {
  return Math.min(balance, pot);
}
