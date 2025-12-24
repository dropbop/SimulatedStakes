import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { PokerGame } from '../lib/gameLogic';

// Casino Royale themed styles
const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    color: '#f0e6d3',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#d4af37',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    letterSpacing: '3px',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#888',
    fontStyle: 'italic',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1000px',
  },
  table: {
    position: 'relative',
    height: '500px',
    margin: '0 auto',
    width: '100%',
    maxWidth: '900px',
    background: 'radial-gradient(ellipse at center, #1e5631 0%, #0d3320 70%, #0a2818 100%)',
    borderRadius: '200px',
    border: '12px solid #3d2914',
    boxShadow: '0 0 30px rgba(0,0,0,0.8), inset 0 0 50px rgba(0,0,0,0.3)',
  },
  communityCards: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '8px',
  },
  pot: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#d4af37',
    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
    background: 'rgba(0,0,0,0.4)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #d4af37',
  },
  phaseIndicator: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.9rem',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  playerPosition: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfo: {
    background: 'rgba(0,0,0,0.7)',
    padding: '10px 15px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #333',
    minWidth: '120px',
  },
  playerInfoCurrent: {
    border: '2px solid #d4af37',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
  },
  playerInfoFolded: {
    opacity: 0.5,
  },
  playerInfoEliminated: {
    opacity: 0.3,
    filter: 'grayscale(100%)',
  },
  playerName: {
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    color: '#f0e6d3',
  },
  playerChips: {
    fontSize: '0.85rem',
    color: '#d4af37',
  },
  playerBet: {
    fontSize: '0.8rem',
    color: '#88c999',
    marginTop: '2px',
  },
  dealerButton: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
    color: '#000',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
    border: '2px solid #333',
  },
  card: {
    width: '50px',
    height: '70px',
    background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
    borderRadius: '5px',
    border: '1px solid #999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  cardRed: {
    color: '#c41e3a',
  },
  cardBlack: {
    color: '#1a1a1a',
  },
  cardBack: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
    border: '2px solid #d4af37',
  },
  cardPlaceholder: {
    background: 'rgba(255,255,255,0.1)',
    border: '2px dashed rgba(255,255,255,0.2)',
  },
  holeCards: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    gap: '15px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  foldButton: {
    background: 'linear-gradient(135deg, #8b0000 0%, #5c0000 100%)',
    color: 'white',
  },
  checkButton: {
    background: 'linear-gradient(135deg, #1e5631 0%, #0d3320 100%)',
    color: 'white',
  },
  callButton: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    color: 'white',
  },
  raiseButton: {
    background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
    color: '#1a1a1a',
  },
  newHandButton: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
    color: '#d4af37',
    border: '1px solid #d4af37',
  },
  betControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'rgba(0,0,0,0.3)',
    padding: '15px 25px',
    borderRadius: '10px',
  },
  betSlider: {
    width: '200px',
    accentColor: '#d4af37',
  },
  betAmount: {
    fontSize: '1.1rem',
    color: '#d4af37',
    fontWeight: 'bold',
    minWidth: '80px',
  },
  gameLog: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '10px',
    maxHeight: '150px',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '600px',
    border: '1px solid #333',
  },
  logEntry: {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: '#aaa',
  },
  statusMessage: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.2rem',
    color: '#d4af37',
  },
};

// Player positions around the table (6 players)
const playerPositions = [
  { bottom: '10px', left: '50%', transform: 'translateX(-50%)' }, // Player (bottom center)
  { bottom: '120px', left: '5%' },   // Left bottom
  { top: '80px', left: '5%' },       // Left top
  { top: '10px', left: '50%', transform: 'translateX(-50%)' },    // Top center
  { top: '80px', right: '5%' },      // Right top
  { bottom: '120px', right: '5%' },  // Right bottom
];

// Dealer button offsets
const dealerButtonOffsets = [
  { bottom: '90px', left: 'calc(50% + 70px)' },
  { bottom: '180px', left: 'calc(5% + 130px)' },
  { top: '160px', left: 'calc(5% + 130px)' },
  { top: '90px', left: 'calc(50% + 70px)' },
  { top: '160px', right: 'calc(5% + 130px)' },
  { bottom: '180px', right: 'calc(5% + 130px)' },
];

export default function PokerTable() {
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [betAmount, setBetAmount] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    const newGame = new PokerGame(6);
    setGame(newGame);
  }, []);

  // Start a completely new game
  const startNewGame = useCallback(() => {
    const newGame = new PokerGame(6);
    setGame(newGame);
    setGameState(null);
    setBetAmount(20);
    setIsProcessing(false);
  }, []);

  // Start a new hand
  const startNewHand = useCallback(() => {
    console.log('startNewHand called', { game: !!game, isProcessing });
    if (!game) return;
    if (isProcessing) {
      console.log('Blocked by isProcessing, forcing reset');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    try {
      const state = game.startNewHand();
      setGameState(state);
      setBetAmount(state.minRaise * 2);
    } catch (error) {
      console.error('startNewHand error:', error);
    }

    // Small delay to let AI actions complete
    setTimeout(() => {
      setGameState(game.getState());
      setIsProcessing(false);
    }, 100);
  }, [game, isProcessing]);

  // Player action handlers
  const handleFold = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);

    game.fold();

    setTimeout(() => {
      setGameState(game.getState());
      setIsProcessing(false);
    }, 100);
  }, [game, isProcessing]);

  const handleCheck = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);

    game.check();

    setTimeout(() => {
      setGameState(game.getState());
      setIsProcessing(false);
    }, 100);
  }, [game, isProcessing]);

  const handleCall = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);

    game.call();

    setTimeout(() => {
      setGameState(game.getState());
      setIsProcessing(false);
    }, 100);
  }, [game, isProcessing]);

  const handleRaise = useCallback(() => {
    if (!game || isProcessing || !gameState) return;
    setIsProcessing(true);

    try {
      game.raise(betAmount);
    } catch (error) {
      console.error('Raise error:', error.message);
    }

    setTimeout(() => {
      setGameState(game.getState());
      setIsProcessing(false);
    }, 100);
  }, [game, isProcessing, gameState, betAmount]);

  // Render a card
  const renderCard = (card, index, isHidden = false) => {
    if (!card) {
      return (
        <div key={index} style={{ ...styles.card, ...styles.cardPlaceholder }} />
      );
    }

    if (isHidden) {
      return (
        <div key={index} style={{ ...styles.card, ...styles.cardBack }} />
      );
    }

    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    return (
      <div
        key={index}
        style={{
          ...styles.card,
          ...(isRed ? styles.cardRed : styles.cardBlack)
        }}
      >
        {card.toString()}
      </div>
    );
  };

  // Render community cards
  const renderCommunityCards = () => {
    if (!gameState) return null;

    const cards = gameState.communityCards;
    const placeholders = 5 - cards.length;

    return (
      <div style={styles.communityCards}>
        {cards.map((card, i) => renderCard(card, i))}
        {[...Array(placeholders)].map((_, i) => renderCard(null, cards.length + i))}
      </div>
    );
  };

  // Render a player
  const renderPlayer = (player, index) => {
    if (!gameState) return null;

    const isCurrent = gameState.currentPlayer === index && gameState.phase !== 'endHand' && gameState.phase !== 'gameOver';
    const isDealer = gameState.dealer === index;
    const position = playerPositions[index];

    const playerStyle = {
      ...styles.playerInfo,
      ...(isCurrent ? styles.playerInfoCurrent : {}),
      ...(player.eliminated ? styles.playerInfoEliminated : player.folded ? styles.playerInfoFolded : {}),
    };

    return (
      <div key={player.id} style={{ ...styles.playerPosition, ...position }}>
        <div style={playerStyle}>
          <div style={styles.playerName}>
            {player.name}
            {player.eliminated && ' (OUT)'}
            {!player.eliminated && player.folded && ' (Folded)'}
            {player.allIn && ' (All-In)'}
          </div>
          <div style={styles.playerChips}>${player.chips}</div>
          {player.currentBet > 0 && (
            <div style={styles.playerBet}>Bet: ${player.currentBet}</div>
          )}
        </div>

        {/* Hole cards */}
        <div style={styles.holeCards}>
          {player.hand ? (
            // Human player - show cards
            player.hand.map((card, i) => renderCard(card, i))
          ) : player.isHuman ? (
            // Human but no cards yet
            null
          ) : !player.folded ? (
            // AI player - show card backs
            <>
              {renderCard({}, 0, true)}
              {renderCard({}, 1, true)}
            </>
          ) : null}
        </div>

        {/* Dealer button */}
        {isDealer && (
          <div style={{ ...styles.dealerButton, ...dealerButtonOffsets[index] }}>
            D
          </div>
        )}
      </div>
    );
  };

  // Get available actions for current player
  const getActions = () => {
    if (!gameState || gameState.phase === 'endHand') return [];
    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (!currentPlayer?.isHuman) return [];
    return gameState.availableActions || [];
  };

  const actions = getActions();
  const currentPlayer = gameState?.players[gameState.currentPlayer];
  const callAmount = gameState ? gameState.currentBet - (currentPlayer?.currentBet || 0) : 0;
  const maxRaise = currentPlayer ? currentPlayer.chips - callAmount : 0;
  const minRaise = gameState?.minRaise || 10;

  // Determine what message to show
  const getStatusMessage = () => {
    if (!gameState) return 'Click "Deal New Hand" to start playing';
    if (gameState.phase === 'gameOver' || gameState.isGameOver) {
      const winner = gameState.players.find(p => !p.eliminated);
      if (winner?.isHuman) return 'Congratulations! You win the tournament!';
      return `${winner?.name || 'Someone'} wins the tournament!`;
    }
    if (gameState.phase === 'endHand') return 'Hand complete! Deal a new hand to continue.';
    if (currentPlayer?.isHuman && actions.length > 0) return 'Your turn - choose an action';
    return 'Waiting...';
  };

  const isGameOver = gameState?.phase === 'gameOver' || gameState?.isGameOver;

  return (
    <div style={styles.container}>
      <Head>
        <title>Casino Royale Poker</title>
        <meta name="description" content="A Casino Royale themed poker game" />
      </Head>

      <div style={styles.header}>
        <h1 style={styles.title}>CASINO ROYALE</h1>
        <div style={styles.subtitle}>Montenegro • Texas Hold'em</div>
      </div>

      <main style={styles.main}>
        <div style={styles.table}>
          {/* Phase indicator */}
          {gameState && (
            <div style={styles.phaseIndicator}>
              {gameState.phase === 'endHand' ? 'Hand Complete' : gameState.phase}
            </div>
          )}

          {/* Pot */}
          <div style={styles.pot}>
            Pot: ${gameState?.pot || 0}
          </div>

          {/* Community cards */}
          {renderCommunityCards()}

          {/* Players */}
          {gameState?.players.map((player, index) => renderPlayer(player, index))}
        </div>

        {/* Status message */}
        <div style={styles.statusMessage}>
          {getStatusMessage()}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          {/* Game over - New Game button */}
          {isGameOver && (
            <button
              style={{ ...styles.button, ...styles.raiseButton }}
              onClick={startNewGame}
            >
              New Game
            </button>
          )}

          {/* New hand button */}
          {!isGameOver && (!gameState || gameState.phase === 'endHand') && (
            <button
              style={{ ...styles.button, ...styles.newHandButton }}
              onClick={startNewHand}
              disabled={isProcessing}
            >
              Deal New Hand
            </button>
          )}

          {/* Action buttons */}
          {actions.length > 0 && (
            <>
              <div style={styles.buttonRow}>
                {actions.includes('fold') && (
                  <button
                    style={{ ...styles.button, ...styles.foldButton }}
                    onClick={handleFold}
                    disabled={isProcessing}
                  >
                    Fold
                  </button>
                )}
                {actions.includes('check') && (
                  <button
                    style={{ ...styles.button, ...styles.checkButton }}
                    onClick={handleCheck}
                    disabled={isProcessing}
                  >
                    Check
                  </button>
                )}
                {actions.includes('call') && (
                  <button
                    style={{ ...styles.button, ...styles.callButton }}
                    onClick={handleCall}
                    disabled={isProcessing}
                  >
                    Call ${callAmount}
                  </button>
                )}
                {actions.includes('raise') && (
                  <button
                    style={{ ...styles.button, ...styles.raiseButton }}
                    onClick={handleRaise}
                    disabled={isProcessing}
                  >
                    Raise to ${gameState.currentBet + betAmount}
                  </button>
                )}
              </div>

              {/* Bet slider for raises */}
              {actions.includes('raise') && maxRaise > minRaise && (
                <div style={styles.betControls}>
                  <span style={{ color: '#888' }}>Raise:</span>
                  <input
                    type="range"
                    min={minRaise}
                    max={maxRaise}
                    step={minRaise}
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                    style={styles.betSlider}
                  />
                  <span style={styles.betAmount}>${betAmount}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Game Log */}
        {gameState?.log && gameState.log.length > 0 && (
          <div style={styles.gameLog}>
            {gameState.log.slice(-10).map((entry, index) => (
              <div key={index} style={styles.logEntry}>{entry}</div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
