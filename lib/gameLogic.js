// Card and Deck classes plus basic game setup

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
  constructor(id, name, isHuman = false, startingChips = 1000) {
    this.id = id;
    this.name = name;
    this.isHuman = isHuman;
    this.chips = startingChips;
    this.hand = [];
    this.folded = false;
    this.allIn = false;
    this.currentBet = 0;
  }

  // Reset player for a new hand
  resetForNewHand() {
    this.hand = [];
    this.folded = false;
    this.allIn = false;
    this.currentBet = 0;
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
    this.minRaise = 10; // Minimum raise amount (equal to big blind)
    this.players = [];
    this.currentPlayerIndex = 0;
    this.dealerIndex = 0;
    this.smallBlindIndex = 1;
    this.bigBlindIndex = 2;
    this.gamePhase = 'setup'; // setup, preflop, flop, turn, river, showdown
    this.log = [];
    this.lastRaiseIndex = -1; // To track when betting round is complete
    this.actionsThisRound = 0; // Count of actions in current betting round
    
    // Create players (1 human, rest AI)
    this.setupPlayers(playerCount);
  }

  // Initialize players
  setupPlayers(count) {
    if (count < 2) throw new Error("Need at least 2 players");
    
    // Create human player
    const humanPlayer = new Player(0, "You", true);
    this.players.push(humanPlayer);
    
    // Create AI players
    for (let i = 1; i < count; i++) {
      const aiPlayer = new Player(i, `AI ${i}`);
      this.players.push(aiPlayer);
    }
  }

  // Start a new hand
  startNewHand() {
    // Reset game state
    this.log = [];
    this.addToLog("Starting new hand...");
    
    this.deck.reset();
    this.deck.shuffle();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    
    // Reset all players
    for (let player of this.players) {
      player.resetForNewHand();
    }
    
    // Rotate positions
    this.rotateDealerPosition();
    
    // Set game phase
    this.gamePhase = 'preflop';
    
    // Deal cards
    this.dealPlayerCards();
    
    // Post blinds
    this.postBlinds();
    
    // Set first player to act
    const utg = (this.bigBlindIndex + 1) % this.players.length;
    this.currentPlayerIndex = utg;
    
    // If first player is AI, trigger their decision
    if (!this.players[this.currentPlayerIndex].isHuman) {
      this.makeAIDecision();
    }
    
    this.addToLog("Cards dealt, blinds posted. Ready to play!");
    
    return {
      gamePhase: this.gamePhase,
      players: this.players,
      pot: this.pot,
      currentBet: this.currentBet,
      currentPlayer: this.currentPlayerIndex
    };
  }

  // Rotate dealer position
  rotateDealerPosition() {
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
    this.smallBlindIndex = (this.dealerIndex + 1) % this.players.length;
    this.bigBlindIndex = (this.dealerIndex + 2) % this.players.length;
    
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
    const smallBlind = 5;
    const bigBlind = 10;
    
    // Post small blind
    const sbPlayer = this.players[this.smallBlindIndex];
    const actualSB = Math.min(smallBlind, sbPlayer.chips);
    sbPlayer.makeBet(actualSB);
    this.pot += actualSB;
    this.addToLog(`${sbPlayer.name} posts small blind of $${actualSB}`);
    
    // Post big blind
    const bbPlayer = this.players[this.bigBlindIndex];
    const actualBB = Math.min(bigBlind, bbPlayer.chips);
    bbPlayer.makeBet(actualBB);
    this.pot += actualBB;
    this.currentBet = actualBB;
    this.addToLog(`${bbPlayer.name} posts big blind of $${actualBB}`);
  }

  // Add message to the game log
  addToLog(message) {
    this.log.push(message);
    console.log(message); // For testing
  }

  // Get current state of the game (for UI)
  getState() {
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
        hand: p.isHuman ? p.hand : null // Only show cards for human player
      })),
      currentPlayer: this.currentPlayerIndex,
      dealer: this.dealerIndex,
      smallBlind: this.smallBlindIndex,
      bigBlind: this.bigBlindIndex,
      log: this.log,
      availableActions: this.getAvailableActions()
    };
  }

  // Calculate what actions are available to the current player
  getAvailableActions() {
    const player = this.players[this.currentPlayerIndex];
    
    // If player can't act, no actions available
    if (!player.canAct()) return [];
    
    const actions = ['fold'];
    const toCall = this.currentBet - player.currentBet;
    
    // Can only check if no bet to call
    if (toCall === 0) {
      actions.push('check');
    }
    
    // Can call if player has enough chips and there's a bet to call
    if (toCall > 0 && player.chips >= toCall) {
      actions.push('call');
    }
    
    // Can raise if player has enough chips for minimum raise
    const minRaiseAmount = toCall + this.minRaise;
    if (player.chips >= minRaiseAmount) {
      actions.push('raise');
    }
    
    return actions;
  }

  // Player actions
  
  // Fold current hand
  fold() {
    const player = this.players[this.currentPlayerIndex];
    player.fold();
    this.addToLog(`${player.name} folds`);
    
    this.actionsThisRound++;
    this.nextPlayer();
    
    // Check if only one player remains
    this.checkForWinner();
    
    return this.getState();
  }
  
  // Check (pass action to next player)
  check() {
    const player = this.players[this.currentPlayerIndex];
    this.addToLog(`${player.name} checks`);
    
    this.actionsThisRound++;
    this.nextPlayer();
    
    return this.getState();
  }
  
  // Call the current bet
  call() {
    const player = this.players[this.currentPlayerIndex];
    const toCall = this.currentBet - player.currentBet;
    
    // Adjust for all-in situation
    const actualCall = Math.min(toCall, player.chips);
    
    player.makeBet(actualCall);
    this.pot += actualCall;
    
    if (player.allIn) {
      this.addToLog(`${player.name} calls ${actualCall} and is all-in!`);
    } else {
      this.addToLog(`${player.name} calls ${actualCall}`);
    }
    
    this.actionsThisRound++;
    this.nextPlayer();
    
    return this.getState();
  }
  
  // Raise the current bet
  raise(amount) {
    const player = this.players[this.currentPlayerIndex];
    const toCall = this.currentBet - player.currentBet;
    const totalBet = toCall + amount;
    
    // Make sure bet is valid
    if (amount < this.minRaise) {
      throw new Error(`Raise must be at least ${this.minRaise}`);
    }
    
    if (totalBet > player.chips) {
      throw new Error("Cannot bet more than you have");
    }
    
    // Update the bet
    player.makeBet(totalBet);
    this.pot += totalBet;
    this.currentBet = player.currentBet;
    this.minRaise = amount; // Update minimum raise
    this.lastRaiseIndex = this.currentPlayerIndex;
    
    if (player.allIn) {
      this.addToLog(`${player.name} raises to ${player.currentBet} and is all-in!`);
    } else {
      this.addToLog(`${player.name} raises to ${player.currentBet}`);
    }
    
    this.actionsThisRound++;
    this.nextPlayer();
    
    return this.getState();
  }
  
  // Move to the next player who can act
  nextPlayer() {
    const startingIndex = this.currentPlayerIndex;
    
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      
      // If we've gone all the way around with no player able to act or
      // if we've returned to the last raiser, betting round is over
      if (this.currentPlayerIndex === startingIndex || 
          (this.lastRaiseIndex !== -1 && this.currentPlayerIndex === this.lastRaiseIndex)) {
        this.endBettingRound();
        return;
      }
    } while (!this.players[this.currentPlayerIndex].canAct());
    
    // If it's an AI player's turn, immediately make their decision
    if (!this.players[this.currentPlayerIndex].isHuman) {
      this.makeAIDecision();
    }
  }
  
  // Simulate AI decision making
  makeAIDecision() {
    const player = this.players[this.currentPlayerIndex];
    const actions = this.getAvailableActions();
    
    // Very simple AI logic for now - randomly choose an action with weighted probabilities
    const random = Math.random();
    
    if (actions.includes('check') && random < 0.6) {
      // Check 60% of the time if possible
      this.check();
    } else if (actions.includes('call') && random < 0.8) {
      // Call 80% of the time when facing a bet
      this.call();
    } else if (actions.includes('raise') && random < 0.3) {
      // Raise 30% of the time when possible
      this.raise(this.minRaise);
    } else if (actions.includes('fold')) {
      // Fold as a last resort
      this.fold();
    } else if (actions.includes('call')) {
      // Call if we can't fold or raise
      this.call();
    } else if (actions.includes('check')) {
      // Check if nothing else is available
      this.check();
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
    
    // Advance to next game phase
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
    // Dealer burns one card
    this.deck.dealCard(); // Burn card
    
    // Deal 3 cards for the flop
    for (let i = 0; i < 3; i++) {
      this.communityCards.push(this.deck.dealCard());
    }
    
    this.gamePhase = 'flop';
    this.addToLog(`Dealing the flop: ${this.communityCards.map(c => c.toString()).join(', ')}`);
    
    // Set first player to act (first active player after dealer)
    this.setFirstToAct();
  }
  
  // Deal the turn (4th community card)
  dealTurn() {
    // Dealer burns one card
    this.deck.dealCard(); // Burn card
    
    // Deal the turn card
    this.communityCards.push(this.deck.dealCard());
    
    this.gamePhase = 'turn';
    this.addToLog(`Dealing the turn: ${this.communityCards[3].toString()}`);
    
    // Set first player to act
    this.setFirstToAct();
  }
  
  // Deal the river (5th community card)
  dealRiver() {
    // Dealer burns one card
    this.deck.dealCard(); // Burn card
    
    // Deal the river card
    this.communityCards.push(this.deck.dealCard());
    
    this.gamePhase = 'river';
    this.addToLog(`Dealing the river: ${this.communityCards[4].toString()}`);
    
    // Set first player to act
    this.setFirstToAct();
  }
  
  // Handle showdown and determine winner
  showdown() {
    this.gamePhase = 'showdown';
    this.addToLog("All betting complete. Time for showdown!");
    
    // For now, just end the game - we'll implement hand evaluation later
    this.addToLog("Showdown logic to be implemented...");
    
    // Temporary: award pot to a random active player
    const activePlayers = this.players.filter(p => !p.folded);
    if (activePlayers.length > 0) {
      const winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
      winner.chips += this.pot;
      this.addToLog(`${winner.name} wins pot of ${this.pot}`);
    }
    
    this.gamePhase = 'endHand';
  }
  
  // Set the first player to act after dealer
  setFirstToAct() {
    // In real poker, first to act is first active player after dealer
    let index = (this.dealerIndex + 1) % this.players.length;
    
    // Find first player who can act
    while (!this.players[index].canAct() && index !== this.dealerIndex) {
      index = (index + 1) % this.players.length;
    }
    
    this.currentPlayerIndex = index;
    
    // If it's an AI player's turn, make their decision
    if (!this.players[this.currentPlayerIndex].isHuman) {
      this.makeAIDecision();
    }
  }
  
  // Check if only one player remains active
  checkForWinner() {
    const activePlayers = this.players.filter(p => !p.folded);
    
    if (activePlayers.length === 1) {
      // Last player standing wins the pot
      const winner = activePlayers[0];
      winner.chips += this.pot;
      this.addToLog(`${winner.name} wins pot of ${this.pot} uncontested`);
      this.gamePhase = 'endHand';
    }
  }
}

// Export our classes
module.exports = {
  Card,
  Deck,
  Player,
  PokerGame
};