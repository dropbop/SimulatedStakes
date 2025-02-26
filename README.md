# Poker Game Project

A single-player poker game built with Next.js where you play against AI opponents.

## Current Development Status

### Phase 1: Cards and Basic Setup ✓
- ✅ Implemented card and deck management
- ✅ Created player objects with basic properties
- ✅ Set up game state structure
- ✅ Added blind posting and initial dealing
- ✅ Created test page to verify functionality

### Phase 2: Game Flow (Current Phase)
- ✅ Implemented player actions (fold, check, call, raise)
- ✅ Added community card dealing (flop, turn, river)
- ✅ Created betting round management
- ✅ Implemented simple AI decision-making
- ✅ Added game phase progression
- ⬜ Implement proper showdown logic

### Future Phases:
- Phase 3: Hand Evaluation (determine winners, pot distribution)
- Phase 4: Advanced AI Players (improved decision-making)
- Phase 5: UI Integration (fully functional game interface)

## Current Project Structure
```
poker-game/
├── lib/
│   └── gameLogic.js         # Core game logic classes (Card, Deck, Player, PokerGame)
│
├── pages/
│   ├── index.js             # Main poker table UI
│   └── test.js              # Test page to verify game logic
│
├── public/                  # Static assets folder
│
├── next.config.js           # Next.js configuration
└── package.json             # Project dependencies
```

## Core Components

### Card Class
Represents a single playing card with:
- Suit (spades, hearts, diamonds, clubs)
- Value (2-10, J, Q, K, A)
- Methods to display and compare cards

### Deck Class
Manages a collection of 52 cards with:
- Shuffling functionality
- Card dealing
- Deck reset capability

### Player Class
Represents a player in the game with:
- Chip management
- Hand cards
- Betting capabilities
- Fold/All-in status tracking

### PokerGame Class
Orchestrates the entire game with:
- Game phase management (preflop, flop, turn, river, showdown)
- Player turn tracking and action handling
- Dealer and blind position rotation
- Pot management and betting rounds
- Community card dealing
- Simple AI decision making
- Game action logging

## Game Flow
1. New hand is started
2. Cards are dealt to players
3. Blinds are posted
4. Pre-flop betting round
5. Flop is dealt (3 community cards)
6. Flop betting round
7. Turn is dealt (4th community card)
8. Turn betting round
9. River is dealt (5th community card)
10. River betting round
11. Showdown (compare hands and determine winner)
12. Award pot to winner

## Testing
Visit the `/test` page to see the card system in action and verify game initialization.

## Next Steps
- Implement betting actions (check, call, raise, fold)
- Add game flow progression (flop, turn, river)
- Create hand evaluation logic