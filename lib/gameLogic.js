// Import the hand evaluator at the top of your file
import { evaluateHand, determineWinners } from './handEvaluator.js';
import { makeAIDecision, getPersonalityForPlayer, PERSONALITIES } from './pokerAI.js';
import { triggerDialogue, notifyNewHand, resetDialogueState, hasDialogue } from './dialogueSystem.js';

// All available Casino Royale characters (full roster)
const ALL_AI_CHARACTERS = [
  'Le Chiffre',      // Always included
  'Vesper Lynd',
  'Felix Leiter',
  'Mathis',
  'M',
  'Mr. White',
  'Steven Obanno',
  'Alex Dimitrios',
  'Valenka',
  'Dryden',
  'Mollaka'
];

// Current game's selected AI characters (set during game initialization)
// Le Chiffre at index 2 = player index 3 = 12 o'clock position (opposite Bond)
let AI_CHARACTERS = ['Vesper Lynd', 'Felix Leiter', 'Le Chiffre', 'Mathis', 'M'];

/**
 * Select characters for a new game
 * Le Chiffre is always included at position 3 (12 o'clock, opposite Bond), plus 4 random others
 */
function selectGameCharacters() {
  const otherCharacters = ALL_AI_CHARACTERS.filter(c => c !== 'Le Chiffre');

  // Shuffle and pick 4
  const shuffled = [...otherCharacters].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  // Le Chiffre at index 2 = player index 3 = 12 o'clock position (opposite Bond)
  AI_CHARACTERS = [selected[0], selected[1], 'Le Chiffre', selected[2], selected[3]];
  return AI_CHARACTERS;
}

// Card class - represents a single playing card
class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  // Get the numeric rank (2-14 where Ace is 14)
  get rank() {
    const ranks = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return ranks[this.value];
  }

  // Display card as a string (e.g., "A♠")
  toString() {
    const suitSymbols = {
      'spades': '♠',
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣'
    };
    return `${this.value}${suitSymbols[this.suit]}`;
  }

  // For visual display, including color
  toHTML() {
    const suitSymbols = {
      'spades': '♠',
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣'
    };
    const isRed = this.suit === 'hearts' || this.suit === 'diamonds';
    const color = isRed ? 'red' : 'black';
    return `<span style="color:${color}">${this.value}${suitSymbols[this.suit]}</span>`;
  }
}

// Deck class - represents a full deck of cards
class Deck {
  constructor() {
    this.reset();
  }

  // Create a new deck of 52 cards
  reset() {
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    this.cards = [];
    
    // Create each card in the deck
    for (let suit of suits) {
      for (let value of values) {
        this.cards.push(new Card(suit, value));
      }
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return this;
  }

  // Deal a single card from the deck
  dealCard() {
    if (this.cards.length === 0) {
      throw new Error("No cards left in the deck");
    }
    return this.cards.pop();
  }

  // Get number of cards left in the deck
  get remaining() {
    return this.cards.length;
  }
}

// Player class - represents a player in the game
class Player {
  constructor(id, name, isHuman = false, startingChips = 1000, personality = null) {
    this.id = id;
    this.name = name;
    this.isHuman = isHuman;
    this.chips = startingChips;
    this.hand = [];
    this.folded = false;
    this.allIn = false;
    this.currentBet = 0;
    this.personality = personality; // AI personality for decision making
    this.eliminated = false; // True when player has no chips left
  }

  // Reset player for a new hand
  resetForNewHand() {
    this.hand = [];
    this.folded = this.eliminated; // Eliminated players start folded
    this.allIn = false;
    this.currentBet = 0;
  }

  // Check if player is eliminated (out of chips)
  checkElimination() {
    if (this.chips <= 0 && !this.eliminated) {
      this.eliminated = true;
      this.folded = true;
    }
    return this.eliminated;
  }

  // Add a card to the player's hand
  receiveCard(card) {
    this.hand.push(card);
  }

  // Check if player can take actions
  canAct() {
    return !this.folded && !this.allIn && this.chips > 0;
  }

  // Make a bet
  makeBet(amount) {
    if (amount <= 0) throw new Error("Bet amount must be positive");
    if (amount > this.chips) throw new Error("Bet cannot exceed available chips");
    
    this.chips -= amount;
    this.currentBet += amount;
    
    if (this.chips === 0) {
      this.allIn = true;
    }
    
    return amount;
  }

  // Fold the hand
  fold() {
    this.folded = true;
    return this.hand;
  }
}

// Game class - manages the poker game state
class PokerGame {
  constructor(playerCount = 6) {
    this.deck = new Deck();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.dealerIndex = 0;
    this.smallBlindIndex = 1;
    this.bigBlindIndex = 2;
    this.gamePhase = 'setup'; // setup, preflop, flop, turn, river, showdown, endHand
    this.log = [];
    this.lastRaiseIndex = -1; // To track when betting round is complete
    this.actionsThisRound = 0; // Count of actions in current betting round
    this.bettingRoundStarter = -1; // First player to act in current betting round

    // Dialogue system state
    this.pendingDialogue = null; // Current dialogue to display
    this.lastAIDecision = null;  // Last AI decision (for bluff tracking)
    this.lastAction = null;      // Last action taken (for UI popup)

    // Select characters for this game (Le Chiffre + 4 random)
    selectGameCharacters();
    resetDialogueState();

    // Casino Royale tournament structure (matches film)
    this.startingChips = 10000000; // $10 million buy-in
    this.handCount = 0;
    this.blindLevel = 0;
    // Escalating blind structure (small blind values, big blind is 2x)
    this.blindLevels = [
      50000,    // Level 0: $50,000/$100,000
      100000,   // Level 1: $100,000/$200,000
      150000,   // Level 2: $150,000/$300,000
      250000,   // Level 3: $250,000/$500,000
      500000,   // Level 4: $500,000/$1,000,000
      750000,   // Level 5: $750,000/$1,500,000
      1000000,  // Level 6: $1,000,000/$2,000,000
      1500000,  // Level 7: $1,500,000/$3,000,000
      2000000,  // Level 8: $2,000,000/$4,000,000
      3000000,  // Level 9: $3,000,000/$6,000,000
    ];
    this.handsPerLevel = 8; // Blinds increase every 8 hands
    this.minRaise = this.blindLevels[0] * 2; // Minimum raise equals big blind

    // When true, AI moves are processed automatically (for stress tests)
    // When false, UI must call processOneAITurn() to advance each AI move
    this.autoProcessAI = true;

    // Create players (1 human, rest AI)
    this.setupPlayers(playerCount);
  }

  // Initialize players
  setupPlayers(count) {
    if (count < 2) throw new Error("Need at least 2 players");

    // Create human player (James Bond)
    const humanPlayer = new Player(0, "James Bond", true, this.startingChips);
    this.players.push(humanPlayer);

    // Create AI players with Casino Royale characters
    for (let i = 1; i < count; i++) {
      const characterName = AI_CHARACTERS[(i - 1) % AI_CHARACTERS.length];
      // Get personality directly from PERSONALITIES object
      const personality = PERSONALITIES[characterName] || PERSONALITIES['Le Chiffre'];
      const aiPlayer = new Player(i, characterName, false, this.startingChips, personality);
      this.players.push(aiPlayer);
    }
  }

  // Get context for dialogue system
  getDialogueContext(opponent = null) {
    const activePlayers = this.players.filter(p => !p.eliminated);
    const totalChips = activePlayers.reduce((sum, p) => sum + p.chips, 0);

    return {
      potPercentage: this.pot / totalChips,
      playersRemaining: activePlayers.length,
      eliminationRisk: activePlayers.some(p => p.chips <= this.pot * 0.5),
      opponent: opponent,
      phase: this.gamePhase,
      isBluffing: this.lastAIDecision?.isBluff || false,
    };
  }

  // Get current blinds based on level
  getCurrentBlinds() {
    const level = Math.min(this.blindLevel, this.blindLevels.length - 1);
    const smallBlind = this.blindLevels[level];
    const bigBlind = smallBlind * 2;
    return { smallBlind, bigBlind };
  }

  // Check and update blind level
  updateBlindLevel() {
    const newLevel = Math.floor(this.handCount / this.handsPerLevel);
    if (newLevel > this.blindLevel && newLevel < this.blindLevels.length) {
      this.blindLevel = newLevel;
      const { smallBlind, bigBlind } = this.getCurrentBlinds();
      this.addToLog(`Blinds increase to $${smallBlind.toLocaleString()}/$${bigBlind.toLocaleString()}`);
    }
  }

  // Start a new hand
  startNewHand() {
    // Check if game is already over
    const activePlayers = this.players.filter(p => !p.eliminated);
    if (activePlayers.length < 2) {
      this.addToLog("Not enough players to continue.");
      this.gamePhase = 'gameOver';
      if (activePlayers.length === 1) {
        this.addToLog(`${activePlayers[0].name} wins the tournament!`);
      }
      return this.getState();
    }

    // Increment hand count and check for blind increase
    this.handCount++;

    // Notify dialogue system of new hand
    notifyNewHand();
    this.pendingDialogue = null;
    this.lastAIDecision = null;

    // Reset game state
    this.log = [];
    this.updateBlindLevel();
    this.addToLog(`Hand #${this.handCount}`);

    this.deck.reset();
    this.deck.shuffle();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;

    // Reset all players
    for (let player of this.players) {
      player.resetForNewHand();
    }

    // Rotate positions (skip eliminated players)
    this.rotateDealerPosition();

    // Set game phase
    this.gamePhase = 'preflop';

    // Deal cards only to non-eliminated players
    this.dealPlayerCards();

    // Post blinds
    this.postBlinds();

    // Find first player who can act (UTG, skipping eliminated/folded)
    let utg = (this.bigBlindIndex + 1) % this.players.length;
    let loopCount = 0;
    while (!this.players[utg].canAct() && loopCount < this.players.length) {
      utg = (utg + 1) % this.players.length;
      loopCount++;
    }

    this.currentPlayerIndex = utg;
    this.bettingRoundStarter = utg;
    this.lastRaiseIndex = this.bigBlindIndex;

    this.addToLog("Cards dealt, blinds posted. Ready to play!");

    // If first player is AI, trigger their decision
    if (!this.players[this.currentPlayerIndex].isHuman && this.players[this.currentPlayerIndex].canAct()) {
      this.makeAIDecisionForPlayer();
    }

    return this.getState();
  }

  // Rotate dealer position (skip eliminated players)
  rotateDealerPosition() {
    // Find next dealer who isn't eliminated
    let newDealer = (this.dealerIndex + 1) % this.players.length;
    let loopCount = 0;
    while (this.players[newDealer].eliminated && loopCount < this.players.length) {
      newDealer = (newDealer + 1) % this.players.length;
      loopCount++;
    }
    this.dealerIndex = newDealer;

    // Find small blind (next active player after dealer)
    let sb = (this.dealerIndex + 1) % this.players.length;
    loopCount = 0;
    while (this.players[sb].eliminated && loopCount < this.players.length) {
      sb = (sb + 1) % this.players.length;
      loopCount++;
    }
    this.smallBlindIndex = sb;

    // Find big blind (next active player after small blind)
    let bb = (this.smallBlindIndex + 1) % this.players.length;
    loopCount = 0;
    while (this.players[bb].eliminated && loopCount < this.players.length) {
      bb = (bb + 1) % this.players.length;
      loopCount++;
    }
    this.bigBlindIndex = bb;
    
    this.addToLog(`Player ${this.players[this.dealerIndex].name} is now the dealer`);
  }

  // Deal two cards to each player
  dealPlayerCards() {
    // Deal first card to each player
    for (let i = 0; i < this.players.length; i++) {
      const playerIndex = (this.dealerIndex + 1 + i) % this.players.length;
      this.players[playerIndex].receiveCard(this.deck.dealCard());
    }
    
    // Deal second card to each player
    for (let i = 0; i < this.players.length; i++) {
      const playerIndex = (this.dealerIndex + 1 + i) % this.players.length;
      this.players[playerIndex].receiveCard(this.deck.dealCard());
    }
  }

  // Post small and big blinds
  postBlinds() {
    const { smallBlind, bigBlind } = this.getCurrentBlinds();

    // Update minRaise to match current big blind
    this.minRaise = bigBlind;

    // Post small blind
    const sbPlayer = this.players[this.smallBlindIndex];
    const actualSB = Math.min(smallBlind, sbPlayer.chips);
    sbPlayer.makeBet(actualSB);
    this.pot += actualSB;
    this.addToLog(`${sbPlayer.name} posts small blind of $${actualSB.toLocaleString()}`);

    // Post big blind
    const bbPlayer = this.players[this.bigBlindIndex];
    const actualBB = Math.min(bigBlind, bbPlayer.chips);
    bbPlayer.makeBet(actualBB);
    this.pot += actualBB;
    this.currentBet = actualBB;
    this.addToLog(`${bbPlayer.name} posts big blind of $${actualBB.toLocaleString()}`);
  }

  // Add message to the game log
  addToLog(message) {
    this.log.push(message);
  }

  // Get current state of the game (for UI)
  getState() {
    const { smallBlind, bigBlind } = this.getCurrentBlinds();
    return {
      phase: this.gamePhase,
      pot: this.pot,
      currentBet: this.currentBet,
      minRaise: this.minRaise,
      communityCards: this.communityCards,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        chips: p.chips,
        currentBet: p.currentBet,
        folded: p.folded,
        allIn: p.allIn,
        isHuman: p.isHuman,
        eliminated: p.eliminated,
        personality: p.personality ? p.personality.description : null,
        // Show cards for: human player always, OR all non-folded players at showdown/endHand
        hand: p.isHuman || (!p.folded && (this.gamePhase === 'showdown' || this.gamePhase === 'endHand'))
          ? p.hand
          : null
      })),
      currentPlayer: this.currentPlayerIndex,
      dealer: this.dealerIndex,
      smallBlind: this.smallBlindIndex,
      bigBlind: this.bigBlindIndex,
      blinds: { small: smallBlind, big: bigBlind },
      blindLevel: this.blindLevel,
      handCount: this.handCount,
      handsUntilBlindIncrease: this.handsPerLevel - (this.handCount % this.handsPerLevel),
      log: this.log,
      availableActions: this.getAvailableActions(),
      isGameOver: this.isGameOver(),
      pendingDialogue: this.pendingDialogue,
      lastAction: this.lastAction, // Last action for UI popup
      // Expose winner info when game is over
      winner: this.isGameOver() ? this.players.find(p => !p.eliminated) : null,
    };
  }

  // Calculate available actions for the current player
  getAvailableActions() {
    const player = this.players[this.currentPlayerIndex];
    if (!player.canAct()) return [];

    const actions = ['fold'];
    const toCall = this.currentBet - player.currentBet;

    if (toCall === 0) {
      actions.push('check');
    }
    // Allow call if there's something to call - even if it means going all-in
    if (toCall > 0 && player.chips > 0) {
      actions.push('call');
    }
    const minRaiseAmount = toCall + this.minRaise;
    if (player.chips >= minRaiseAmount) {
      actions.push('raise');
    }
    return actions;
  }

  // Player actions

  fold() {
    const player = this.players[this.currentPlayerIndex];
    player.fold();
    this.addToLog(`${player.name} folds`);
    this.actionsThisRound++;
    this.lastAction = { playerIndex: this.currentPlayerIndex, playerName: player.name, action: 'fold' };

    // Trigger dialogue for fold
    if (!player.isHuman) {
      this.pendingDialogue = triggerDialogue(player.name, 'ON_FOLD', this.getDialogueContext());
    }

    // Check for winner BEFORE triggering next player (prevents infinite loop)
    this.checkForWinner();
    if (this.gamePhase === 'endHand') {
      return this.getState();
    }

    this.nextPlayer();
    return this.getState();
  }
  
  check() {
    const player = this.players[this.currentPlayerIndex];
    this.addToLog(`${player.name} checks`);
    this.actionsThisRound++;
    this.lastAction = { playerIndex: this.currentPlayerIndex, playerName: player.name, action: 'check' };

    // Trigger dialogue for check
    if (!player.isHuman) {
      this.pendingDialogue = triggerDialogue(player.name, 'ON_CHECK', this.getDialogueContext());
    }

    this.nextPlayer();
    return this.getState();
  }
  
  call() {
    const player = this.players[this.currentPlayerIndex];
    const toCall = this.currentBet - player.currentBet;
    const actualCall = Math.min(toCall, player.chips);

    player.makeBet(actualCall);
    this.pot += actualCall;
    this.lastAction = { playerIndex: this.currentPlayerIndex, playerName: player.name, action: 'call', amount: actualCall };

    if (player.allIn) {
      this.addToLog(`${player.name} calls ${actualCall} and is all-in!`);
      // Trigger all-in dialogue
      if (!player.isHuman) {
        this.pendingDialogue = triggerDialogue(player.name, 'ON_ALL_IN', this.getDialogueContext());
      }
    } else {
      this.addToLog(`${player.name} calls ${actualCall}`);
      // Trigger call dialogue
      if (!player.isHuman) {
        this.pendingDialogue = triggerDialogue(player.name, 'ON_CALL', this.getDialogueContext());
      }
    }
    this.actionsThisRound++;
    this.nextPlayer();
    return this.getState();
  }
  
  raise(amount) {
    const player = this.players[this.currentPlayerIndex];
    const toCall = this.currentBet - player.currentBet;
    const totalBet = toCall + amount;

    if (amount < this.minRaise) {
      throw new Error(`Raise must be at least ${this.minRaise}`);
    }
    if (totalBet > player.chips) {
      throw new Error("Cannot bet more than you have");
    }

    player.makeBet(totalBet);
    this.pot += totalBet;
    this.currentBet = player.currentBet;
    this.minRaise = amount;
    this.lastRaiseIndex = this.currentPlayerIndex;
    this.lastAction = { playerIndex: this.currentPlayerIndex, playerName: player.name, action: 'raise', amount: player.currentBet };

    if (player.allIn) {
      this.addToLog(`${player.name} raises to ${player.currentBet} and is all-in!`);
      // Trigger all-in dialogue
      if (!player.isHuman) {
        this.pendingDialogue = triggerDialogue(player.name, 'ON_ALL_IN', this.getDialogueContext());
      }
    } else {
      this.addToLog(`${player.name} raises to ${player.currentBet}`);
      // Trigger raise dialogue (uses lastAIDecision.isBluff for Le Chiffre's tell)
      if (!player.isHuman) {
        const context = this.getDialogueContext();
        context.isBluffing = this.lastAIDecision?.isBluff || false;
        this.pendingDialogue = triggerDialogue(player.name, 'ON_RAISE', context);
      }
    }
    this.actionsThisRound++;
    this.nextPlayer();
    return this.getState();
  }

  // Move to the next player who can act
  nextPlayer() {
    // Stop if hand is over
    if (this.gamePhase === 'endHand' || this.gamePhase === 'gameOver') {
      return;
    }

    // Count players who can still act
    const playersWhoCanAct = this.players.filter(p => p.canAct()).length;
    if (playersWhoCanAct === 0) {
      // No one can act - go straight to showdown
      this.endBettingRound();
      return;
    }

    // Find next player who can act
    let nextIndex = (this.currentPlayerIndex + 1) % this.players.length;
    let loopCount = 0;

    while (!this.players[nextIndex].canAct() && loopCount < this.players.length) {
      nextIndex = (nextIndex + 1) % this.players.length;
      loopCount++;
    }

    // Check if betting round should end
    const shouldEndRound = this.shouldEndBettingRound(nextIndex);

    if (shouldEndRound) {
      this.endBettingRound();
      return;
    }

    this.currentPlayerIndex = nextIndex;

    // Double-check game didn't end
    if (this.gamePhase === 'endHand' || this.gamePhase === 'gameOver') {
      return;
    }

    // Trigger AI decision only if auto-processing is enabled
    // When autoProcessAI is false, UI controls AI timing via processOneAITurn()
    if (this.autoProcessAI && !this.players[this.currentPlayerIndex].isHuman) {
      this.makeAIDecisionForPlayer();
    }
  }

  // Enable or disable automatic AI processing
  // Set to false to control AI timing from the UI
  setAutoProcessAI(enabled) {
    this.autoProcessAI = enabled;
  }

  // Process a single AI turn (for manual/delayed AI processing)
  // Returns true if another AI turn is pending, false if human's turn or game ended
  processOneAITurn() {
    const currentPlayer = this.players[this.currentPlayerIndex];

    // Only process if current player is AI and can act
    if (!currentPlayer.isHuman && currentPlayer.canAct() &&
        this.gamePhase !== 'endHand' && this.gamePhase !== 'gameOver') {
      this.makeAIDecisionForPlayer();
    }

    // Check if another AI turn is pending
    const nextPlayer = this.players[this.currentPlayerIndex];
    const isActiveGame = this.gamePhase !== 'endHand' && this.gamePhase !== 'gameOver';
    return isActiveGame && !nextPlayer.isHuman && nextPlayer.canAct();
  }

  // Check if it's currently an AI player's turn
  isAITurn() {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const isActiveGame = this.gamePhase !== 'endHand' && this.gamePhase !== 'gameOver';
    return isActiveGame && !currentPlayer.isHuman && currentPlayer.canAct();
  }

  // Determine if betting round should end
  shouldEndBettingRound(nextPlayerIndex) {
    // If there was a raise, round ends when we get back to the raiser
    if (this.lastRaiseIndex !== -1 && nextPlayerIndex === this.lastRaiseIndex) {
      return true;
    }

    // If no raise, round ends when we get back to the starter
    if (this.lastRaiseIndex === -1 && this.bettingRoundStarter !== -1 && nextPlayerIndex === this.bettingRoundStarter) {
      return true;
    }

    // Check if all active players have matched the current bet
    const activePlayers = this.players.filter(p => !p.folded);
    const allMatched = activePlayers.every(p => p.currentBet === this.currentBet || p.allIn);
    const enoughActions = this.actionsThisRound >= activePlayers.filter(p => p.canAct()).length;

    if (allMatched && enoughActions && this.actionsThisRound > 0) {
      return true;
    }

    return false;
  }

  // Skilled AI decision making using personality-based system
  makeAIDecisionForPlayer() {
    // Stop if hand is over
    if (this.gamePhase === 'endHand' || this.gamePhase === 'gameOver') {
      return;
    }

    const player = this.players[this.currentPlayerIndex];
    const actions = this.getAvailableActions();

    // No actions available means hand is over
    if (actions.length === 0) {
      return;
    }

    if (!player.personality) {
      // Fallback for players without personality (shouldn't happen)
      player.personality = getPersonalityForPlayer(player.id);
    }

    // Build game state for AI
    const gameState = {
      communityCards: this.communityCards,
      pot: this.pot,
      currentBet: this.currentBet,
      minRaise: this.minRaise,
      phase: this.gamePhase,
      dealer: this.dealerIndex,
      players: this.players,
      availableActions: actions,
    };

    // Get AI decision
    const decision = makeAIDecision(player, gameState, player.personality);

    // Store decision for dialogue system (tracks isBluff for Le Chiffre's tell)
    this.lastAIDecision = decision;

    // Execute the decision
    try {
      switch (decision.action) {
        case 'fold':
          this.fold();
          break;
        case 'check':
          this.check();
          break;
        case 'call':
          this.call();
          break;
        case 'raise':
          if (decision.amount && decision.amount >= this.minRaise) {
            this.raise(decision.amount);
          } else {
            this.raise(this.minRaise);
          }
          break;
        default:
          // Fallback to check or call
          if (actions.includes('check')) {
            this.check();
          } else if (actions.includes('call')) {
            this.call();
          } else {
            this.fold();
          }
      }
    } catch (error) {
      // If action fails, try safe fallback
      console.error('AI action error:', error.message);
      if (actions.includes('check')) {
        this.check();
      } else if (actions.includes('call')) {
        this.call();
      } else {
        this.fold();
      }
    }
  }

  // End current betting round and move to next phase
  endBettingRound() {
    // Reset player bets for the next round
    for (let player of this.players) {
      player.currentBet = 0;
    }
    this.currentBet = 0;
    this.lastRaiseIndex = -1;
    this.actionsThisRound = 0;
    this.bettingRoundStarter = -1;

    switch (this.gamePhase) {
      case 'preflop':
        this.dealFlop();
        break;
      case 'flop':
        this.dealTurn();
        break;
      case 'turn':
        this.dealRiver();
        break;
      case 'river':
        this.showdown();
        break;
    }
  }

  // Deal the flop (first 3 community cards)
  dealFlop() {
    this.deck.dealCard(); // Burn card
    for (let i = 0; i < 3; i++) {
      this.communityCards.push(this.deck.dealCard());
    }
    this.gamePhase = 'flop';
    this.addToLog(`Dealing the flop: ${this.communityCards.map(c => c.toString()).join(', ')}`);
    this.setFirstToAct();
  }
  
  // Deal the turn (4th community card)
  dealTurn() {
    this.deck.dealCard(); // Burn card
    this.communityCards.push(this.deck.dealCard());
    this.gamePhase = 'turn';
    this.addToLog(`Dealing the turn: ${this.communityCards[3].toString()}`);
    this.setFirstToAct();
  }
  
  // Deal the river (5th community card)
  dealRiver() {
    this.deck.dealCard(); // Burn card
    this.communityCards.push(this.deck.dealCard());
    this.gamePhase = 'river';
    this.addToLog(`Dealing the river: ${this.communityCards[4].toString()}`);
    this.setFirstToAct();
  }
  
  // Refactored showdown logic with hand evaluation and pot splitting
  showdown() {
    this.gamePhase = 'showdown';
    this.addToLog("All betting complete. Time for showdown!");
    
    // Find active players (not folded)
    const activePlayers = this.players.filter(p => !p.folded);
    
    // If only one player remains, award the pot automatically
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.chips += this.pot;
      this.addToLog(`${winner.name} wins pot of ${this.pot} uncontested`);
      this.gamePhase = 'endHand';
      return;
    }
    
    // Evaluate hands and determine winner(s)
    const winners = determineWinners(activePlayers, this.communityCards);
    
    // Log each player's hand for the showdown
    for (const player of activePlayers) {
      const handEval = evaluateHand(player.hand, this.communityCards);
      this.addToLog(`${player.name} shows ${player.hand.map(c => c.toString()).join(', ')} - ${handEval.name}`);
    }
    
    // Split pot among winners
    const winAmount = Math.floor(this.pot / winners.length);
    const remainder = this.pot % winners.length;

    // Calculate if this is a big pot (>20% of chips in play)
    const totalChips = this.players.reduce((sum, p) => sum + p.chips, 0) + this.pot;
    const isBigPot = this.pot > totalChips * 0.2;

    for (const winner of winners) {
      winner.chips += winAmount;
      this.addToLog(`${winner.name} wins ${winAmount} with ${evaluateHand(winner.hand, this.communityCards).name}`);

      // Trigger win dialogue
      if (!winner.isHuman) {
        const trigger = isBigPot ? 'ON_WIN_BIG_POT' : 'ON_WIN_HAND';
        this.pendingDialogue = triggerDialogue(winner.name, trigger, this.getDialogueContext());
      }
    }

    // Trigger lose dialogue for non-winners
    for (const player of activePlayers) {
      if (!winners.includes(player) && !player.isHuman) {
        this.pendingDialogue = triggerDialogue(player.name, 'ON_LOSE_HAND', this.getDialogueContext());
        break; // Only one lose dialogue
      }
    }
    
    // Distribute any remainder chips to the first active winner after the dealer
    if (remainder > 0) {
      let remainderWinner = null;
      let i = (this.dealerIndex + 1) % this.players.length;
      while (remainderWinner === null && i !== this.dealerIndex) {
        if (winners.includes(this.players[i])) {
          remainderWinner = this.players[i];
        }
        i = (i + 1) % this.players.length;
      }
      if (remainderWinner === null) {
        remainderWinner = winners[0];
      }
      remainderWinner.chips += remainder;
      this.addToLog(`${remainderWinner.name} receives ${remainder} extra chip(s) from odd division`);
    }
    
    this.gamePhase = 'endHand';

    // Check for eliminations after hand
    this.checkEliminations();
  }

  // Check for player eliminations after a hand
  checkEliminations() {
    for (const player of this.players) {
      if (player.checkElimination()) {
        this.addToLog(`${player.name} has been eliminated!`);
        // Trigger elimination dialogue
        this.pendingDialogue = triggerDialogue(player.name, 'ON_ELIMINATED', this.getDialogueContext());
      }
    }

    // Check if game is over (only one player with chips)
    const activePlayers = this.players.filter(p => !p.eliminated);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      this.addToLog(`${winner.name} wins the tournament!`);
      // Trigger tournament win dialogue
      this.pendingDialogue = triggerDialogue(winner.name, 'ON_TOURNAMENT_WIN', this.getDialogueContext());
      this.gamePhase = 'gameOver';
    } else if (activePlayers.length === 2) {
      // Trigger heads-up dialogue
      for (const player of activePlayers) {
        if (!player.isHuman) {
          const opponent = activePlayers.find(p => p !== player);
          const context = this.getDialogueContext(opponent?.name);
          this.pendingDialogue = triggerDialogue(player.name, 'ON_HEADS_UP', context);
          break; // Only one heads-up dialogue
        }
      }
    } else if (activePlayers.length === 3) {
      // Trigger final three dialogue
      for (const player of activePlayers) {
        if (!player.isHuman) {
          this.pendingDialogue = triggerDialogue(player.name, 'ON_FINAL_THREE', this.getDialogueContext());
          break;
        }
      }
    }
  }

  // Get count of active (non-eliminated) players
  getActivePlayers() {
    return this.players.filter(p => !p.eliminated);
  }

  // Check if game is over
  isGameOver() {
    return this.gamePhase === 'gameOver' || this.getActivePlayers().length <= 1;
  }

  // Stub for handling side pots (to be fully implemented later)
  handleSidePots() {
    // Side pot logic for all-in scenarios should be implemented here in a future phase.
  }
  
  // Set the first player to act after dealer
  setFirstToAct() {
    let index = (this.dealerIndex + 1) % this.players.length;
    let loopCount = 0;
    while (!this.players[index].canAct() && loopCount < this.players.length) {
      index = (index + 1) % this.players.length;
      loopCount++;
    }

    // No one can act - go to showdown
    if (loopCount >= this.players.length) {
      this.showdown();
      return;
    }

    this.currentPlayerIndex = index;
    this.bettingRoundStarter = index; // Track who starts this round

    if (!this.players[this.currentPlayerIndex].isHuman) {
      this.makeAIDecisionForPlayer();
    }
  }
  
  // Check if only one player remains active
  checkForWinner() {
    const activePlayers = this.players.filter(p => !p.folded);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.chips += this.pot;
      this.addToLog(`${winner.name} wins pot of ${this.pot} uncontested`);
      this.gamePhase = 'endHand';
    }
  }
}

// Export our classes and functions
export { Card, Deck, Player, PokerGame, selectGameCharacters, ALL_AI_CHARACTERS };
