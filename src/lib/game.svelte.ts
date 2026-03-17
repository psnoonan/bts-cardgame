import type { Card, Player, Phase, LogEntry } from './types';
import { suitSymbol } from './types';
import { createDeck, shuffle, dealCard } from './deck';
import { getSpread, resolveResult, maxWager, type Result } from './rules';

const MAX_LOG_ENTRIES = 50;

type SetupPlayer = { name: string; balance: number };

function createGameState() {
  let phase = $state<Phase>('setup');
  let players = $state<Player[]>([]);
  let activePlayerIndex = $state(0);
  let pot = $state(0);
  let ante = $state(1);
  let deck = $state<{ live: Card[]; used: Card[] }>({ live: [], used: [] });
  let hand = $state<Card[]>([]);
  let currentWager = $state(0);
  let log = $state<LogEntry[]>([]);
  let lastSetup = $state<{ players: SetupPlayer[]; ante: number } | null>(null);

  const activePlayer = $derived(players[activePlayerIndex]);

  return {
    get phase() { return phase; },
    set phase(v: Phase) { phase = v; },
    get players() { return players; },
    set players(v: Player[]) { players = v; },
    get activePlayerIndex() { return activePlayerIndex; },
    set activePlayerIndex(v: number) { activePlayerIndex = v; },
    get pot() { return pot; },
    set pot(v: number) { pot = v; },
    get ante() { return ante; },
    set ante(v: number) { ante = v; },
    get deck() { return deck; },
    set deck(v: { live: Card[]; used: Card[] }) { deck = v; },
    get hand() { return hand; },
    set hand(v: Card[]) { hand = v; },
    get currentWager() { return currentWager; },
    set currentWager(v: number) { currentWager = v; },
    get log() { return log; },
    set log(v: LogEntry[]) { log = v; },
    get lastSetup() { return lastSetup; },
    set lastSetup(v: { players: SetupPlayer[]; ante: number } | null) { lastSetup = v; },
    get activePlayer() { return activePlayer; },
  };
}

export const game = createGameState();

function addLog(message: string) {
  game.log = [{ message, timestamp: Date.now() }, ...game.log].slice(0, MAX_LOG_ENTRIES);
}

function ensureDeckHasCards(count: number) {
  if (game.deck.live.length < count && game.deck.used.length > 0) {
    const reshuffled = shuffle(game.deck.used);
    game.deck = {
      live: [...game.deck.live, ...reshuffled],
      used: []
    };
    addLog('Deck reshuffled');
  }
}

function advanceToNextPlayer() {
  const count = game.players.length;
  let next = (game.activePlayerIndex + 1) % count;
  let checked = 0;
  while (game.players[next].eliminated && checked < count) {
    next = (next + 1) % count;
    checked++;
  }
  game.activePlayerIndex = next;
}

function collectAntes(): boolean {
  for (let i = 0; i < game.players.length; i++) {
    const p = game.players[i];
    if (!p.eliminated && p.balance < game.ante) {
      pendingAnteCollection = true;
      game.phase = 'rebuy';
      game.activePlayerIndex = i;
      return false;
    }
  }
  for (const p of game.players) {
    if (!p.eliminated) {
      p.balance -= game.ante;
      game.pot += game.ante;
    }
  }
  addLog(`Everyone antes $${game.ante}`);
  return true;
}

function activePlayers(): Player[] {
  return game.players.filter(p => !p.eliminated);
}

function checkGameOver(): boolean {
  if (activePlayers().length <= 1) {
    game.phase = 'gameover';
    addLog('Game over — last player standing!');
    return true;
  }
  return false;
}

export function startGame(setupPlayers: SetupPlayer[], anteAmount: number) {
  const shuffled = shuffle(createDeck());
  game.deck = { live: shuffled, used: [] };
  game.ante = anteAmount;
  game.pot = 0;
  game.hand = [];
  game.log = [];
  game.activePlayerIndex = 0;
  game.currentWager = 0;

  game.players = setupPlayers.map(p => ({
    name: p.name,
    balance: p.balance,
    startingBalance: p.balance,
    totalBuyIn: p.balance,
    eliminated: false
  }));

  game.lastSetup = { players: setupPlayers, ante: anteAmount };

  for (const p of game.players) {
    p.balance -= anteAmount;
    game.pot += anteAmount;
  }

  addLog('Game started!');
  addLog(`Everyone antes $${anteAmount}`);
  game.phase = 'dealing';
}

export function dealBoundaryCards() {
  ensureDeckHasCards(3);

  // Deal first card only — if it's an Ace, player must decide before seeing the second
  const { card: card1, remaining: after1 } = dealCard(game.deck.live);
  game.hand = [card1];
  game.deck.live = after1;

  addLog(`Dealt ${card1.rank}${suitSymbol(card1.suit)}`);

  if (card1.rank === 'A' && card1.value === null) {
    game.phase = 'ace-choice';
    return;
  }

  // First card isn't an Ace — deal second immediately
  dealSecondBoundaryCard();
}

function dealSecondBoundaryCard() {
  const { card: card2, remaining: after2 } = dealCard(game.deck.live);
  game.hand = [...game.hand, card2];
  game.deck.live = after2;

  addLog(`and ${card2.rank}${suitSymbol(card2.suit)}`);

  if (card2.rank === 'A' && card2.value === null) {
    game.phase = 'ace-choice';
    return;
  }

  // Both cards resolved — check spread
  checkSpreadAndProceed();
}

export function continueAfterAutoPass() {
  discardHand();
  advanceToNextPlayer();
  dealBoundaryCards();
}

export function setAceValue(cardIndex: number, value: 1 | 14) {
  game.hand[cardIndex] = { ...game.hand[cardIndex], value };
  addLog(`${game.activePlayer.name} sets Ace ${value === 14 ? 'HIGH' : 'LOW'}`);

  if (game.hand.length === 1) {
    // First card Ace resolved — now deal the second card
    dealSecondBoundaryCard();
  } else {
    // Second card Ace resolved — check spread
    const stillUnresolved = game.hand.filter((c, i) => i < 2 && c.rank === 'A' && c.value === null);
    if (stillUnresolved.length === 0) {
      checkSpreadAndProceed();
    }
  }
}

function checkSpreadAndProceed() {
  const spread = getSpread(game.hand[0], game.hand[1]);
  if (spread !== null && spread <= 1) {
    addLog(`Spread is ${spread} — auto-pass`);
    game.phase = 'auto-pass';
  } else {
    game.phase = 'betting';
  }
}

export function playerPass() {
  addLog(`${game.activePlayer.name} passes`);
  discardHand();
  advanceToNextPlayer();
  game.phase = 'dealing';
}

export function playerPlay(wager: number) {
  const max = maxWager(game.activePlayer.balance, game.pot);
  game.currentWager = Math.min(Math.max(1, wager), max);
  addLog(`${game.activePlayer.name} wagers $${game.currentWager}`);
  game.phase = 'result';
}

let lastResult: Result | null = null;
let pendingAnteCollection = false;

export function dealThirdCard() {
  const { card, remaining } = dealCard(game.deck.live);
  game.hand = [...game.hand, card];
  game.deck.live = remaining;
  lastResult = resolveResult(game.hand[0], game.hand[1], card);
  addLog(`${card.rank}${suitSymbol(card.suit)} dealt — ${resultMessage(lastResult)}`);
  // Result is NOT applied here — UI calls advanceAfterResult() after display delay
}

export function advanceAfterResult() {
  if (game.hand.length !== 3 || lastResult === null) return;
  applyResult(lastResult);
  lastResult = null;
}

export function getLastResult(): Result | null {
  return lastResult;
}

function startNextRound() {
  advanceToNextPlayer();
  if (!checkGameOver()) {
    const antesCollected = collectAntes();
    if (antesCollected) {
      game.phase = 'dealing';
    }
  }
}

function handlePlayerDebit() {
  discardHand();
  if (game.activePlayer.balance <= 0) {
    game.activePlayer.balance = 0;
    game.phase = 'rebuy';
  } else {
    advanceToNextPlayer();
    game.phase = 'dealing';
  }
}

function applyResult(result: Result) {
  const player = game.activePlayer;

  if (result === 'win') {
    const winnings = Math.min(game.currentWager, game.pot);
    player.balance += winnings;
    game.pot -= winnings;
    addLog(`${player.name} wins $${winnings}!`);
    discardHand();
    startNextRound();
  } else if (result === 'lose') {
    player.balance -= game.currentWager;
    game.pot += game.currentWager;
    addLog(`${player.name} loses $${game.currentWager}`);
    handlePlayerDebit();
  } else {
    // Post: pay double the wager
    const penalty = Math.min(game.currentWager * 2, player.balance);
    player.balance -= penalty;
    game.pot += penalty;
    addLog(`${player.name} POSTS — pays $${penalty}!`);
    handlePlayerDebit();
  }
}

export function handleRebuy(amount: number) {
  const player = game.activePlayer;
  player.balance += amount;
  player.totalBuyIn += amount;
  addLog(`${player.name} buys back in for $${amount}`);

  if (pendingAnteCollection) {
    // Rebuy was triggered by ante shortfall — retry collecting antes
    pendingAnteCollection = false;
    const antesCollected = collectAntes();
    if (antesCollected) {
      game.phase = 'dealing';
    }
    // If not collected, another player can't afford ante — stays in rebuy
  } else {
    // Rebuy was triggered by going bust on a wager — just advance, no re-ante
    advanceToNextPlayer();
    if (!checkGameOver()) {
      game.phase = 'dealing';
    }
  }
}

export function handleElimination() {
  const player = game.activePlayer;
  player.eliminated = true;
  addLog(`${player.name} is out!`);

  if (!checkGameOver()) {
    if (pendingAnteCollection) {
      // Eliminated during ante collection — retry collecting from remaining players
      pendingAnteCollection = false;
      const antesCollected = collectAntes();
      if (antesCollected) {
        // Need to advance past the eliminated player to deal
        advanceToNextPlayer();
        game.phase = 'dealing';
      }
      // If not collected, another player can't afford ante — stays in rebuy
    } else {
      // Eliminated after going bust on a wager — just advance
      advanceToNextPlayer();
      game.phase = 'dealing';
    }
  }
}

export function cashOut() {
  const active = activePlayers();
  if (active.length > 0 && game.pot > 0) {
    const share = Math.floor(game.pot / active.length);
    const remainder = game.pot - share * active.length;
    for (const p of active) {
      p.balance += share;
    }
    if (remainder > 0) {
      game.activePlayer.balance += remainder;
    }
    game.pot = 0;
    addLog(`Pot split: $${share} each`);
  }
  game.phase = 'gameover';
  addLog('Game over — cashed out!');
}

export function resetGame() {
  game.phase = 'setup';
  game.players = [];
  game.activePlayerIndex = 0;
  game.pot = 0;
  game.ante = 1;
  game.deck = { live: [], used: [] };
  game.hand = [];
  game.currentWager = 0;
  game.log = [];
  lastResult = null;
  pendingAnteCollection = false;
  // NOTE: lastSetup is intentionally NOT reset so Play Again preserves settings
}

function discardHand() {
  // Reset Ace values to null so they're unresolved when reshuffled back in
  const resetCards = game.hand.map(c => c.rank === 'A' ? { ...c, value: null } : c);
  game.deck.used = [...game.deck.used, ...resetCards];
  game.hand = [];
  game.currentWager = 0;
}

function resultMessage(result: Result): string {
  if (result === 'win') return 'INSIDE! WIN!';
  if (result === 'lose') return 'OUTSIDE! LOSE!';
  return 'MATCH! POST!';
}
