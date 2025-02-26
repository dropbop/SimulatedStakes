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
      this.players = [];
      this.currentPlayerIndex = 0;
      this.dealerIndex = 0;
      this.smallBlindIndex = 1;
      this.bigBlindIndex = 2;
      this.gamePhase = 'setup'; // setup, preflop, flop, turn, river, showdown
      this.log = [];
      
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
        log: this.log
      };
    }
  }
  
  // Export our classes
  module.exports = {
    Card,
    Deck,
    Player,
    PokerGame
  };