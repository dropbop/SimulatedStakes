import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { PokerGame } from '../lib/gameLogic';

// Global CSS for custom scrollbar and animations
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #c9a227 0%, #8b7355 100%);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #d4af37 0%, #a08060 100%);
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #c9a227 rgba(0, 0, 0, 0.3);
  }

  /* Keyframe animations */
  @keyframes subtleGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.4), inset 0 1px 0 rgba(255,255,255,0.1); }
    50% { box-shadow: 0 0 30px rgba(201, 162, 39, 0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
  }

  @keyframes cardAppear {
    0% { opacity: 0; transform: translateY(-10px) rotateX(15deg); }
    100% { opacity: 1; transform: translateY(0) rotateX(0); }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes pulseGold {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  /* Button hover effects */
  .poker-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .poker-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }

  .poker-btn:hover::before {
    left: 100%;
  }

  .poker-btn:hover {
    transform: translateY(-2px);
  }

  .poker-btn:active {
    transform: translateY(0);
  }

  /* Card animations */
  .card-animate {
    animation: cardAppear 0.4s ease-out forwards;
  }

  /* Current player glow */
  .current-player {
    animation: subtleGlow 2s ease-in-out infinite;
  }

  /* Slider styling */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
    border-radius: 2px;
    border: 1px solid rgba(201, 162, 39, 0.3);
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7355 100%);
    margin-top: -7px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    border: 2px solid #0a0a0a;
    transition: transform 0.2s;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  input[type="range"]::-moz-range-track {
    height: 4px;
    background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
    border-radius: 2px;
    border: 1px solid rgba(201, 162, 39, 0.3);
  }

  input[type="range"]::-moz-range-thumb {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7355 100%);
    border: 2px solid #0a0a0a;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }
`;

// Casino Royale themed styles - Refined & Cinematic
const styles = {
  container: {
    minHeight: '100vh',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: `
      radial-gradient(ellipse at 50% 0%, rgba(20, 30, 48, 0.8) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(30, 20, 15, 0.6) 0%, transparent 40%),
      radial-gradient(ellipse at 20% 80%, rgba(15, 25, 20, 0.6) 0%, transparent 40%),
      linear-gradient(180deg, #0a0b0d 0%, #0d0e12 50%, #08090a 100%)
    `,
    color: '#e8e0d5',
    fontFamily: "'Outfit', -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  // Subtle film grain overlay
  grainOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    zIndex: 1000,
  },
  // Vignette effect
  vignette: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
    zIndex: 999,
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
    position: 'relative',
    zIndex: 1,
  },
  titleWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: '600',
    color: '#c9a227',
    textShadow: '0 2px 20px rgba(201, 162, 39, 0.3), 0 1px 0 rgba(0,0,0,0.8)',
    letterSpacing: '0.25em',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  titleAccent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.3), transparent)',
    zIndex: -1,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'rgba(200, 195, 185, 0.6)',
    fontWeight: '300',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1200px',
    position: 'relative',
    zIndex: 1,
  },
  table: {
    position: 'relative',
    height: '620px',
    margin: '0 auto',
    width: '100%',
    maxWidth: '1050px',
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(35, 90, 55, 0.95) 0%, rgba(20, 60, 35, 0.95) 40%, rgba(12, 40, 25, 0.98) 70%, rgba(8, 28, 18, 1) 100%)
    `,
    borderRadius: '50%',
    border: '10px solid #1a1410',
    boxShadow: `
      0 0 0 3px rgba(139, 90, 43, 0.4),
      0 0 0 12px #0d0a08,
      0 0 0 14px rgba(139, 90, 43, 0.2),
      inset 0 0 100px rgba(0,0,0,0.5),
      0 25px 80px rgba(0,0,0,0.8)
    `,
  },
  tableRail: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(80, 50, 30, 0.3) 0%, transparent 50%, rgba(40, 25, 15, 0.3) 100%)',
    pointerEvents: 'none',
  },
  feltTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    opacity: 0.4,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='felt'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23felt)'/%3E%3C/svg%3E")`,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
  },
  communityCards: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '10px',
    perspective: '1000px',
  },
  pot: {
    position: 'absolute',
    top: '32%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#c9a227',
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
    background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.85) 0%, rgba(5, 5, 5, 0.9) 100%)',
    padding: '10px 24px',
    borderRadius: '24px',
    border: '1px solid rgba(201, 162, 39, 0.25)',
    backdropFilter: 'blur(8px)',
    letterSpacing: '0.1em',
  },
  phaseIndicator: {
    position: 'absolute',
    top: '22%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.7rem',
    color: 'rgba(200, 195, 185, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    fontWeight: '400',
  },
  playerPosition: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  playerInfo: {
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.92) 0%, rgba(10, 10, 12, 0.95) 100%)',
    padding: '12px 18px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    minWidth: '125px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  playerInfoCurrent: {
    border: '1px solid rgba(201, 162, 39, 0.5)',
    boxShadow: '0 0 25px rgba(201, 162, 39, 0.25), 0 8px 32px rgba(0,0,0,0.4)',
  },
  playerInfoFolded: {
    opacity: 0.45,
  },
  playerInfoEliminated: {
    opacity: 0.25,
    filter: 'grayscale(80%)',
  },
  playerName: {
    marginBottom: '5px',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#e8e0d5',
    letterSpacing: '0.02em',
  },
  playerChips: {
    fontSize: '0.85rem',
    color: '#c9a227',
    fontWeight: '500',
    fontFamily: "'Outfit', sans-serif",
  },
  playerBet: {
    fontSize: '0.75rem',
    color: '#6dba82',
    marginTop: '4px',
    fontWeight: '400',
  },
  dealerButton: {
    position: 'absolute',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #f5f5f0 0%, #d4d0c8 50%, #b8b4ac 100%)',
    color: '#1a1a1a',
    fontSize: '9px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
    border: 'none',
    letterSpacing: '0.05em',
  },
  card: {
    width: '52px',
    height: '72px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f6f3 50%, #ebe8e4 100%)',
    borderRadius: '6px',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.05rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
    fontFamily: "'Outfit', sans-serif",
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)',
  },
  cardRed: {
    color: '#b91c1c',
  },
  cardBlack: {
    color: '#171717',
  },
  cardBack: {
    background: `
      linear-gradient(135deg, #1a2744 0%, #0f1829 50%, #0a1018 100%)
    `,
    border: '2px solid rgba(201, 162, 39, 0.4)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 0 20px rgba(201, 162, 39, 0.1)',
  },
  cardBackPattern: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    right: '4px',
    bottom: '4px',
    borderRadius: '3px',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    background: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 3px,
        rgba(201, 162, 39, 0.05) 3px,
        rgba(201, 162, 39, 0.05) 6px
      )
    `,
  },
  cardPlaceholder: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px dashed rgba(255,255,255,0.1)',
    boxShadow: 'none',
  },
  holeCards: {
    display: 'flex',
    gap: '5px',
    marginTop: '10px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '24px',
    gap: '18px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '14px 28px',
    fontSize: '0.85rem',
    fontWeight: '500',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  foldButton: {
    background: 'linear-gradient(180deg, #7f1d1d 0%, #5c1515 100%)',
    color: '#fecaca',
    boxShadow: '0 4px 15px rgba(127, 29, 29, 0.3)',
  },
  checkButton: {
    background: 'linear-gradient(180deg, #1a4d2e 0%, #0f3320 100%)',
    color: '#a7dbb8',
    boxShadow: '0 4px 15px rgba(26, 77, 46, 0.3)',
  },
  callButton: {
    background: 'linear-gradient(180deg, #166534 0%, #0d4022 100%)',
    color: '#bbf7d0',
    boxShadow: '0 4px 15px rgba(22, 101, 52, 0.3)',
  },
  raiseButton: {
    background: 'linear-gradient(180deg, #c9a227 0%, #a68520 50%, #8b7018 100%)',
    color: '#0a0a0a',
    boxShadow: '0 4px 15px rgba(201, 162, 39, 0.3)',
  },
  newHandButton: {
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    color: '#c9a227',
    border: '1px solid rgba(201, 162, 39, 0.3)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  betControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.9) 0%, rgba(10, 10, 12, 0.95) 100%)',
    padding: '16px 28px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
  },
  betLabel: {
    color: 'rgba(200, 195, 185, 0.6)',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  betSlider: {
    width: '180px',
    height: '20px',
  },
  betAmount: {
    fontSize: '1rem',
    color: '#c9a227',
    fontWeight: '500',
    minWidth: '75px',
    textAlign: 'right',
    fontFamily: "'Outfit', sans-serif",
  },
  gameLog: {
    marginTop: '28px',
    padding: '20px 24px',
    background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(5, 5, 7, 0.98) 100%)',
    borderRadius: '14px',
    maxHeight: '220px',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '700px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  logHeader: {
    fontSize: '0.7rem',
    color: 'rgba(201, 162, 39, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  logEntry: {
    margin: '8px 0',
    fontSize: '0.85rem',
    color: 'rgba(220, 215, 205, 0.75)',
    lineHeight: '1.5',
    paddingLeft: '12px',
    borderLeft: '2px solid rgba(201, 162, 39, 0.2)',
  },
  logEntryLatest: {
    color: 'rgba(232, 224, 213, 0.95)',
    borderLeft: '2px solid rgba(201, 162, 39, 0.6)',
  },
  statusMessage: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.05rem',
    color: 'rgba(201, 162, 39, 0.9)',
    fontWeight: '400',
    letterSpacing: '0.05em',
  },
  statusMessageSecondary: {
    color: 'rgba(200, 195, 185, 0.6)',
  },
};

// Player positions around the table (6 players) - spread out for larger table
const playerPositions = [
  { bottom: '15px', left: '50%', transform: 'translateX(-50%)' },  // Player (bottom center)
  { bottom: '140px', left: '6%' },   // Left bottom
  { top: '100px', left: '6%' },      // Left top
  { top: '15px', left: '50%', transform: 'translateX(-50%)' },     // Top center
  { top: '100px', right: '6%' },     // Right top
  { bottom: '140px', right: '6%' },  // Right bottom
];

// Dealer button offsets - adjusted for larger table
const dealerButtonOffsets = [
  { bottom: '95px', left: 'calc(50% + 75px)' },
  { bottom: '200px', left: 'calc(6% + 140px)' },
  { top: '180px', left: 'calc(6% + 140px)' },
  { top: '95px', left: 'calc(50% + 75px)' },
  { top: '180px', right: 'calc(6% + 140px)' },
  { bottom: '200px', right: 'calc(6% + 140px)' },
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
    if (!game) return;
    if (isProcessing) {
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
        <div
          key={index}
          style={{ ...styles.card, ...styles.cardPlaceholder }}
          className="card-animate"
        />
      );
    }

    if (isHidden) {
      return (
        <div
          key={index}
          style={{ ...styles.card, ...styles.cardBack }}
          className="card-animate"
        >
          <div style={styles.cardBackPattern} />
        </div>
      );
    }

    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    return (
      <div
        key={index}
        style={{
          ...styles.card,
          ...(isRed ? styles.cardRed : styles.cardBlack),
          animationDelay: `${index * 0.1}s`
        }}
        className="card-animate"
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
        <div style={playerStyle} className={isCurrent ? 'current-player' : ''}>
          <div style={styles.playerName}>
            {player.name}
            {player.eliminated && ' (OUT)'}
            {!player.eliminated && player.folded && ' (Folded)'}
            {player.allIn && ' (All-In)'}
          </div>
          <div style={styles.playerChips}>${player.chips.toLocaleString()}</div>
          {player.currentBet > 0 && (
            <div style={styles.playerBet}>Bet: ${player.currentBet.toLocaleString()}</div>
          )}
        </div>

        {/* Hole cards */}
        <div style={styles.holeCards}>
          {player.hand ? (
            player.hand.map((card, i) => renderCard(card, i))
          ) : player.isHuman ? (
            null
          ) : !player.folded && !player.eliminated ? (
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
    if (!gameState) return { main: 'Deal cards to begin', secondary: 'The game awaits' };
    if (gameState.phase === 'gameOver' || gameState.isGameOver) {
      const winner = gameState.players.find(p => !p.eliminated);
      if (winner?.isHuman) return { main: 'Victory', secondary: 'You have won the tournament' };
      return { main: `${winner?.name || 'Unknown'} wins`, secondary: 'Tournament complete' };
    }
    if (gameState.phase === 'endHand') return { main: 'Hand complete', secondary: 'Deal the next hand to continue' };
    if (currentPlayer?.isHuman && actions.length > 0) return { main: 'Your move', secondary: 'Choose your action wisely' };
    return { main: 'In play', secondary: 'Waiting for opponents' };
  };

  const statusMessage = getStatusMessage();
  const isGameOver = gameState?.phase === 'gameOver' || gameState?.isGameOver;

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div style={styles.grainOverlay} />
      <div style={styles.vignette} />

      <Head>
        <title>Casino Royale</title>
        <meta name="description" content="A Casino Royale themed poker game" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <header style={styles.header}>
        <div style={styles.titleWrapper}>
          <h1 style={styles.title}>Casino Royale</h1>
          <div style={styles.titleAccent} />
        </div>
        <div style={styles.subtitle}>Montenegro</div>
      </header>

      <main style={styles.main}>
        <div style={styles.table}>
          <div style={styles.tableRail} />
          <div style={styles.feltTexture} />

          {/* Phase indicator */}
          {gameState && (
            <div style={styles.phaseIndicator}>
              {gameState.phase === 'endHand' ? 'Complete' : gameState.phase}
            </div>
          )}

          {/* Pot */}
          <div style={styles.pot}>
            Pot ${(gameState?.pot || 0).toLocaleString()}
          </div>

          {/* Community cards */}
          {renderCommunityCards()}

          {/* Players */}
          {gameState?.players.map((player, index) => renderPlayer(player, index))}
        </div>

        {/* Status message */}
        <div style={styles.statusMessage}>
          <div>{statusMessage.main}</div>
          <div style={{ ...styles.statusMessage, ...styles.statusMessageSecondary, fontSize: '0.85rem', padding: '4px' }}>
            {statusMessage.secondary}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          {/* Game over - New Game button */}
          {isGameOver && (
            <button
              className="poker-btn"
              style={{ ...styles.button, ...styles.raiseButton }}
              onClick={startNewGame}
            >
              New Tournament
            </button>
          )}

          {/* New hand button */}
          {!isGameOver && (!gameState || gameState.phase === 'endHand') && (
            <button
              className="poker-btn"
              style={{
                ...styles.button,
                ...styles.newHandButton,
                ...(isProcessing ? { opacity: 0.5, cursor: 'not-allowed' } : {})
              }}
              onClick={startNewHand}
              disabled={isProcessing}
            >
              Deal Cards
            </button>
          )}

          {/* Action buttons */}
          {actions.length > 0 && (
            <>
              <div style={styles.buttonRow}>
                {actions.includes('fold') && (
                  <button
                    className="poker-btn"
                    style={{
                      ...styles.button,
                      ...styles.foldButton,
                      ...(isProcessing ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                    onClick={handleFold}
                    disabled={isProcessing}
                  >
                    Fold
                  </button>
                )}
                {actions.includes('check') && (
                  <button
                    className="poker-btn"
                    style={{
                      ...styles.button,
                      ...styles.checkButton,
                      ...(isProcessing ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                    onClick={handleCheck}
                    disabled={isProcessing}
                  >
                    Check
                  </button>
                )}
                {actions.includes('call') && (
                  <button
                    className="poker-btn"
                    style={{
                      ...styles.button,
                      ...styles.callButton,
                      ...(isProcessing ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                    onClick={handleCall}
                    disabled={isProcessing}
                  >
                    Call ${callAmount.toLocaleString()}
                  </button>
                )}
                {actions.includes('raise') && (
                  <button
                    className="poker-btn"
                    style={{
                      ...styles.button,
                      ...styles.raiseButton,
                      ...(isProcessing ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                    onClick={handleRaise}
                    disabled={isProcessing}
                  >
                    Raise ${(gameState.currentBet + betAmount).toLocaleString()}
                  </button>
                )}
              </div>

              {/* Bet slider for raises */}
              {actions.includes('raise') && maxRaise > minRaise && (
                <div style={styles.betControls}>
                  <span style={styles.betLabel}>Raise</span>
                  <input
                    type="range"
                    min={minRaise}
                    max={maxRaise}
                    step={minRaise}
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                    style={styles.betSlider}
                  />
                  <span style={styles.betAmount}>${betAmount.toLocaleString()}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Game Log */}
        {gameState?.log && gameState.log.length > 0 && (
          <div style={styles.gameLog}>
            <div style={styles.logHeader}>Game History</div>
            {gameState.log.slice(-15).map((entry, index, arr) => (
              <div
                key={index}
                style={{
                  ...styles.logEntry,
                  ...(index === arr.length - 1 ? styles.logEntryLatest : {})
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
