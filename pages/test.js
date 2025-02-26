import { useState, useEffect } from 'react';
import { Card, Deck, Player, PokerGame } from '../lib/gameLogic';

// Simple styling
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  cardTest: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  card: {
    width: '60px',
    height: '80px',
    border: '1px solid #000',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    backgroundColor: 'white',
  },
  redCard: {
    color: 'red',
  },
  gameState: {
    marginTop: '20px',
  },
  log: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    marginTop: '10px',
  },
  logEntry: {
    margin: '5px 0',
    fontSize: '14px',
  },
  playerInfo: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    backgroundColor: '#e9e9e9',
  },
  currentPlayer: {
    backgroundColor: '#d4f0d4',
  },
  button: {
    padding: '8px 15px',
    margin: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default function TestPage() {
  const [gameInstance, setGameInstance] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [deckTest, setDeckTest] = useState({ cards: [] });

  // Initialize game
  useEffect(() => {
    // Test card display
    const deck = new Deck();
    deck.shuffle();
    setDeckTest({
      cards: deck.cards.slice(0, 10), // Just show 10 cards
      remaining: deck.remaining
    });

    // Create game instance
    const game = new PokerGame();
    setGameInstance(game);
    
    // No need to start a hand yet - we'll do that with a button
  }, []);

  // Start a new hand
  const startNewHand = () => {
    if (!gameInstance) return;
    
    gameInstance.startNewHand();
    setGameState(gameInstance.getState());
  };
  
  // Player actions
  const handleFold = () => {
    if (!gameInstance) return;
    const newState = gameInstance.fold();
    setGameState(newState);
  };
  
  const handleCheck = () => {
    if (!gameInstance) return;
    const newState = gameInstance.check();
    setGameState(newState);
  };
  
  const handleCall = () => {
    if (!gameInstance) return;
    const newState = gameInstance.call();
    setGameState(newState);
  };
  
  const handleRaise = () => {
    if (!gameInstance) return;
    // Simple fixed raise for testing
    const raiseAmount = gameState.minRaise;
    try {
      const newState = gameInstance.raise(raiseAmount);
      setGameState(newState);
    } catch (error) {
      alert(error.message);
    }
  };

  // Render card for testing
  const renderCard = (card) => {
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    return (
      <div 
        key={`${card.value}${card.suit}`} 
        style={{
          ...styles.card,
          ...(isRed ? styles.redCard : {})
        }}
      >
        {card.toString()}
      </div>
    );
  };

  // Render player info
  const renderPlayer = (player, index) => {
    const isCurrent = gameState && gameState.currentPlayer === index;
    const isDealer = gameState && gameState.dealer === index;
    const isSB = gameState && gameState.smallBlind === index;
    const isBB = gameState && gameState.bigBlind === index;
    
    let position = '';
    if (isDealer) position += 'D ';
    if (isSB) position += 'SB ';
    if (isBB) position += 'BB ';
    
    return (
      <div 
        key={player.id} 
        style={{
          ...styles.playerInfo,
          ...(isCurrent ? styles.currentPlayer : {})
        }}
      >
        <div><strong>{player.name}</strong> {position}</div>
        <div>Chips: ${player.chips}</div>
        <div>Bet: ${player.currentBet}</div>
        {player.folded && <div>Folded</div>}
        {player.allIn && <div>All In</div>}
        {player.isHuman && player.hand.length > 0 && (
          <div style={styles.cardTest}>
            Hand: {player.hand.map(renderCard)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Poker Game Test Page</h1>
      
      {/* Card Test Section */}
      <div style={styles.section}>
        <h2 style={styles.title}>Card Test</h2>
        <p>Displaying 10 random cards from a shuffled deck:</p>
        <div style={styles.cardTest}>
          {deckTest.cards.map(renderCard)}
        </div>
        <p>Cards remaining in deck: {deckTest.remaining}</p>
      </div>
      
      {/* Game Test Section */}
      <div style={styles.section}>
        <h2 style={styles.title}>Game Test</h2>
        <button 
          style={styles.button} 
          onClick={startNewHand}
        >
          Start New Hand
        </button>
        
        {gameState && gameState.phase !== 'endHand' && gameState.players[gameState.currentPlayer].isHuman && (
          <div style={{ marginTop: '10px' }}>
            <h3>Your Turn - Available Actions:</h3>
            <div>
              {gameState.availableActions.includes('fold') && (
                <button style={{...styles.button, backgroundColor: '#f44336'}} onClick={handleFold}>Fold</button>
              )}
              {gameState.availableActions.includes('check') && (
                <button style={{...styles.button, backgroundColor: '#2196f3'}} onClick={handleCheck}>Check</button>
              )}
              {gameState.availableActions.includes('call') && (
                <button style={{...styles.button, backgroundColor: '#4CAF50'}} onClick={handleCall}>
                  Call ${gameState.currentBet - gameState.players[gameState.currentPlayer].currentBet}
                </button>
              )}
              {gameState.availableActions.includes('raise') && (
                <button style={{...styles.button, backgroundColor: '#FF9800'}} onClick={handleRaise}>
                  Raise to ${gameState.currentBet + gameState.minRaise}
                </button>
              )}
            </div>
          </div>
        )}
        
        {gameState && (
          <div style={styles.gameState}>
            <h3>Game State</h3>
            <p>Phase: {gameState.phase}</p>
            <p>Pot: ${gameState.pot}</p>
            <p>Current Bet: ${gameState.currentBet}</p>
            
            {gameState.communityCards.length > 0 && (
              <div>
                <h3>Community Cards</h3>
                <div style={styles.cardTest}>
                  {gameState.communityCards.map((card, index) => renderCard(card))}
                </div>
              </div>
            )}
            
            <h3>Players</h3>
            {gameState.players.map((player, index) => renderPlayer(player, index))}
            
            <h3>Game Log</h3>
            <div style={styles.log}>
              {gameState.log.map((entry, index) => (
                <div key={index} style={styles.logEntry}>{entry}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}