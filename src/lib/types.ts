export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  suit: Suit;
  rank: Rank;
  value: number | null; // null for Aces until player chooses High (14) or Low (1)
};

export type Player = {
  name: string;
  balance: number;
  startingBalance: number;
  totalBuyIn: number;
  eliminated: boolean;
};

export type Phase =
  | 'setup'
  | 'dealing'
  | 'ace-choice'
  | 'betting'
  | 'result'
  | 'rebuy'
  | 'gameover';

export type LogEntry = {
  message: string;
  timestamp: number;
};
