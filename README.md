# Simulated Stakes

A single-player poker game built with Next.js where you play against AI opponents.

## Current Development Status

### Phase 1: Cards and Basic Setup (Current Phase)
- ✅ Implemented card and deck management
- ✅ Created player objects with basic properties
- ✅ Set up game state structure
- ✅ Added blind posting and initial dealing
- ✅ Created test page to verify functionality

### Future Phases:
- Phase 2: Game Flow (dealing, game phases, turn structure, betting)
- Phase 3: Hand Evaluation (determine winners, pot distribution)
- Phase 4: AI Players (decision-making logic)
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
- Game phase management
- Player turn tracking
- Dealer and blind position rotation
- Pot management
- Game action logging

## Testing
Visit the `/test` page to see the card system in action and verify game initialization.

## Next Steps
- Implement betting actions (check, call, raise, fold)
- Add game flow progression (flop, turn, river)
- Create hand evaluation logic