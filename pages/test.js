import { useState, useEffect } from 'react';
import { Card, Deck, Player, PokerGame } from '../lib/gameLogic';
import { evaluateHand, rankHand, determineWinners, HAND_RANKINGS } from '../lib/handEvaluator';

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
  },
  testResult: {
    padding: '8px',
    margin: '5px 0',
    borderRadius: '4px',
  },
  testPass: {
    backgroundColor: '#a5d6a7',
    color: '#1b5e20',
  },
  testFail: {
    backgroundColor: '#ef9a9a',
    color: '#b71c1c',
  }
};

export default function TestPage() {
  const [gameInstance, setGameInstance] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [deckTest, setDeckTest] = useState({ cards: [] });
  const [handEvaluatorTests, setHandEvaluatorTests] = useState([]);
  const [showdownTests, setShowdownTests] = useState([]);

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
    
    // Run hand evaluator tests
    runHandEvaluatorTests();
    
    // No need to start a hand yet - we'll do that with a button
  }, []);

  // Run tests for the hand evaluator
  const runHandEvaluatorTests = () => {
    const results = [];
    
    // Test 1: Check Royal Flush
    try {
      const royalFlush = [
        new Card('spades', 'A'),
        new Card('spades', 'K'),
        new Card('spades', 'Q'),
        new Card('spades', 'J'),
        new Card('spades', '10')
      ];
      
      const evaluation = rankHand(royalFlush);
      results.push({
        name: "Royal Flush Detection",
        description: "Check if a royal flush is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.ROYAL_FLUSH,
        expected: "Royal Flush",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Royal Flush Detection",
        description: "Check if a royal flush is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 2: Check Straight Flush
    try {
      const straightFlush = [
        new Card('hearts', '9'),
        new Card('hearts', '8'),
        new Card('hearts', '7'),
        new Card('hearts', '6'),
        new Card('hearts', '5')
      ];
      
      const evaluation = rankHand(straightFlush);
      results.push({
        name: "Straight Flush Detection",
        description: "Check if a straight flush is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.STRAIGHT_FLUSH,
        expected: "Straight Flush",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Straight Flush Detection",
        description: "Check if a straight flush is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 3: Check Four of a Kind
    try {
      const fourOfAKind = [
        new Card('spades', '8'),
        new Card('hearts', '8'),
        new Card('diamonds', '8'),
        new Card('clubs', '8'),
        new Card('hearts', 'K')
      ];
      
      const evaluation = rankHand(fourOfAKind);
      results.push({
        name: "Four of a Kind Detection",
        description: "Check if four of a kind is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.FOUR_OF_A_KIND,
        expected: "Four of a Kind",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Four of a Kind Detection",
        description: "Check if four of a kind is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 4: Check Full House
    try {
      const fullHouse = [
        new Card('spades', 'J'),
        new Card('hearts', 'J'),
        new Card('diamonds', 'J'),
        new Card('clubs', '9'),
        new Card('hearts', '9')
      ];
      
      const evaluation = rankHand(fullHouse);
      results.push({
        name: "Full House Detection",
        description: "Check if a full house is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.FULL_HOUSE,
        expected: "Full House",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Full House Detection",
        description: "Check if a full house is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 5: Check Flush
    try {
      const flush = [
        new Card('diamonds', 'A'),
        new Card('diamonds', '10'),
        new Card('diamonds', '8'),
        new Card('diamonds', '6'),
        new Card('diamonds', '4')
      ];
      
      const evaluation = rankHand(flush);
      results.push({
        name: "Flush Detection",
        description: "Check if a flush is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.FLUSH,
        expected: "Flush",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Flush Detection",
        description: "Check if a flush is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 6: Check Straight
    try {
      const straight = [
        new Card('spades', 'Q'),
        new Card('hearts', 'J'),
        new Card('diamonds', '10'),
        new Card('clubs', '9'),
        new Card('hearts', '8')
      ];
      
      const evaluation = rankHand(straight);
      results.push({
        name: "Straight Detection",
        description: "Check if a straight is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.STRAIGHT,
        expected: "Straight",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Straight Detection",
        description: "Check if a straight is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 7: Check Three of a Kind
    try {
      const threeOfAKind = [
        new Card('spades', '5'),
        new Card('hearts', '5'),
        new Card('diamonds', '5'),
        new Card('clubs', 'K'),
        new Card('hearts', '7')
      ];
      
      const evaluation = rankHand(threeOfAKind);
      results.push({
        name: "Three of a Kind Detection",
        description: "Check if three of a kind is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.THREE_OF_A_KIND,
        expected: "Three of a Kind",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Three of a Kind Detection",
        description: "Check if three of a kind is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 8: Check Two Pair
    try {
      const twoPair = [
        new Card('spades', 'Q'),
        new Card('hearts', 'Q'),
        new Card('diamonds', '6'),
        new Card('clubs', '6'),
        new Card('hearts', 'A')
      ];
      
      const evaluation = rankHand(twoPair);
      results.push({
        name: "Two Pair Detection",
        description: "Check if two pair is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.TWO_PAIR,
        expected: "Two Pair",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "Two Pair Detection",
        description: "Check if two pair is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 9: Check One Pair
    try {
      const onePair = [
        new Card('spades', '10'),
        new Card('hearts', '10'),
        new Card('diamonds', 'K'),
        new Card('clubs', '7'),
        new Card('hearts', '2')
      ];
      
      const evaluation = rankHand(onePair);
      results.push({
        name: "One Pair Detection",
        description: "Check if one pair is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.ONE_PAIR,
        expected: "One Pair",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "One Pair Detection",
        description: "Check if one pair is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 10: Check High Card
    try {
      const highCard = [
        new Card('spades', 'A'),
        new Card('hearts', 'J'),
        new Card('diamonds', '9'),
        new Card('clubs', '7'),
        new Card('hearts', '3')
      ];
      
      const evaluation = rankHand(highCard);
      results.push({
        name: "High Card Detection",
        description: "Check if high card is correctly identified",
        passed: evaluation.rank === HAND_RANKINGS.HIGH_CARD,
        expected: "High Card",
        actual: evaluation.name
      });
    } catch (error) {
      results.push({
        name: "High Card Detection",
        description: "Check if high card is correctly identified",
        passed: false,
        error: error.message
      });
    }
    
    // Test 11: Check Hand Comparison - Royal Flush vs Straight Flush
    try {
      const royalFlush = [
        new Card('spades', 'A'),
        new Card('spades', 'K'),
        new Card('spades', 'Q'),
        new Card('spades', 'J'),
        new Card('spades', '10')
      ];
      
      const straightFlush = [
        new Card('hearts', '9'),
        new Card('hearts', '8'),
        new Card('hearts', '7'),
        new Card('hearts', '6'),
        new Card('hearts', '5')
      ];
      
      const royalEval = rankHand(royalFlush);
      const straightEval = rankHand(straightFlush);
      
      // Using a helper function to compare hands
      const compareResult = royalEval.rank > straightEval.rank ? 1 : -1;
      
      results.push({
        name: "Hand Comparison - Royal Flush vs Straight Flush",
        description: "Check if royal flush beats straight flush",
        passed: compareResult === 1,
        expected: "Royal Flush wins",
        actual: compareResult === 1 ? "Royal Flush wins" : "Straight Flush wins"
      });
    } catch (error) {
      results.push({
        name: "Hand Comparison - Royal Flush vs Straight Flush",
        description: "Check if royal flush beats straight flush",
        passed: false,
        error: error.message
      });
    }
    
    setHandEvaluatorTests(results);
  };

  // Test the showdown functionality with mock players and hands
  const testShowdown = () => {
    if (!gameInstance) return;
    
    const results = [];
    
    try {
      // Create a test game with known cards
      const testGame = new PokerGame(2); // Just 2 players for simplicity
      
      // Set up community cards
      testGame.communityCards = [
        new Card('spades', '2'),
        new Card('hearts', '4'),
        new Card('diamonds', '6'),
        new Card('clubs', '8'),
        new Card('spades', '10')
      ];
      
      // Set up player hands
      testGame.players[0].hand = [
        new Card('hearts', 'A'),
        new Card('diamonds', 'A')
      ]; // Player 0 has a pair of Aces
      
      testGame.players[1].hand = [
        new Card('clubs', 'K'),
        new Card('spades', 'K')
      ]; // Player 1 has a pair of Kings
      
      // Set up some pot amount
      testGame.pot = 100;
      
      // Execute showdown
      testGame.showdown();
      
      results.push({
        name: "Basic Showdown Test",
        description: "Check if higher pair (Aces) wins against lower pair (Kings)",
        passed: testGame.players[0].chips > testGame.players[1].chips,
        expected: "Player with Aces wins the pot",
        actual: `Player 0 has ${testGame.players[0].chips} chips, Player 1 has ${testGame.players[1].chips} chips`
      });
    } catch (error) {
      results.push({
        name: "Basic Showdown Test",
        description: "Check if higher pair (Aces) wins against lower pair (Kings)",
        passed: false,
        error: error.message
      });
    }
    
    try {
      // Test handling of tied hands
      const testGame = new PokerGame(2);
      
      // Set up community cards for a tie scenario
      testGame.communityCards = [
        new Card('spades', 'A'),
        new Card('hearts', 'A'),
        new Card('diamonds', '2'),
        new Card('clubs', '3'),
        new Card('spades', '4')
      ];
      
      // Both players have the same pair of aces with the same kickers
      testGame.players[0].hand = [
        new Card('hearts', 'K'),
        new Card('hearts', 'Q')
      ];
      
      testGame.players[1].hand = [
        new Card('clubs', 'K'),
        new Card('clubs', 'Q')
      ];
      
      // Set up some pot amount
      testGame.pot = 100;
      const initialChips0 = testGame.players[0].chips;
      const initialChips1 = testGame.players[1].chips;
      
      // Execute showdown
      testGame.showdown();
      
      // Check if pot was split evenly
      const player0Won = testGame.players[0].chips > initialChips0;
      const player1Won = testGame.players[1].chips > initialChips1;
      const splitEvenly = testGame.players[0].chips - initialChips0 === testGame.players[1].chips - initialChips1;
      
      results.push({
        name: "Tied Hands Showdown Test",
        description: "Check if pot is split evenly when hands tie",
        passed: player0Won && player1Won && splitEvenly,
        expected: "Pot split evenly",
        actual: `Player 0 won ${testGame.players[0].chips - initialChips0}, Player 1 won ${testGame.players[1].chips - initialChips1}`
      });
    } catch (error) {
      results.push({
        name: "Tied Hands Showdown Test",
        description: "Check if pot is split evenly when hands tie",
        passed: false,
        error: error.message
      });
    }
    
    setShowdownTests(results);
  };

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

  // Render test results
  const renderTestResult = (test) => {
    return (
      <div 
        key={test.name} 
        style={{
          ...styles.testResult,
          ...(test.passed ? styles.testPass : styles.testFail)
        }}
      >
        <div><strong>{test.name}</strong> - {test.passed ? 'PASS' : 'FAIL'}</div>
        <div>{test.description}</div>
        {test.expected && <div>Expected: {test.expected}</div>}
        {test.actual && <div>Actual: {test.actual}</div>}
        {test.error && <div>Error: {test.error}</div>}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Poker Game Test Page</h1>
      
      {/* Hand Evaluator Tests Section */}
      <div style={styles.section}>
        <h2 style={styles.title}>Hand Evaluator Tests</h2>
        <div>
          {handEvaluatorTests.length > 0 ? (
            handEvaluatorTests.map(renderTestResult)
          ) : (
            <p>No hand evaluator tests have been run yet.</p>
          )}
        </div>
      </div>
      
      {/* Showdown Tests Section */}
      <div style={styles.section}>
        <h2 style={styles.title}>Showdown Tests</h2>
        <button 
          style={styles.button} 
          onClick={testShowdown}
        >
          Run Showdown Tests
        </button>
        <div style={{ marginTop: '10px' }}>
          {showdownTests.length > 0 ? (
            showdownTests.map(renderTestResult)
          ) : (
            <p>No showdown tests have been run yet.</p>
          )}
        </div>
      </div>
      
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