import { useState } from 'react';
import Head from 'next/head';

// Define some basic styles
const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#121212',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1200px',
  },
  table: {
    position: 'relative',
    height: '600px',
    margin: '2rem 0',
    background: '#076324',
    borderRadius: '50%',
    border: '15px solid #5D4037',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  },
  communityCards: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '10px',
  },
  pot: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
  },
  playerPosition: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfo: {
    background: 'rgba(0,0,0,0.6)',
    padding: '8px',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'center',
  },
  playerName: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  playerChips: {
    fontSize: '0.9rem',
  },
  card: {
    width: '60px',
    height: '84px',
    background: 'white',
    borderRadius: '5px',
    border: '1px solid #666',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    margin: '0 2px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  },
  foldButton: {
    background: '#f44336',
    color: 'white',
  },
  checkButton: {
    background: '#2196f3',
    color: 'white',
  },
  callButton: {
    background: '#4caf50',
    color: 'white',
  },
  raiseButton: {
    background: '#ff9800',
    color: 'white',
  },
  betSlider: {
    width: '100%',
    margin: '15px 0',
  },
  betAmount: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '1.2rem',
  },
  gameLog: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '10px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  logEntry: {
    margin: '5px 0',
    fontSize: '0.9rem',
  },
};

export default function PokerGame() {
  // State for the bet slider
  const [betAmount, setBetAmount] = useState(10);
  // State for game log
  const [gameLog, setGameLog] = useState([
    "Welcome to Poker Game!",
    "Game started. Waiting for your action...",
  ]);

  // Sample player data (would be dynamic in the real game)
  const players = [
    { id: 1, name: "You", chips: 1000, position: { bottom: '10px', left: '50%', transform: 'translateX(-50%)' }, isHuman: true },
    { id: 2, name: "AI 1", chips: 850, position: { bottom: '150px', left: '10%' } },
    { id: 3, name: "AI 2", chips: 1200, position: { top: '10%', left: '10%' } },
    { id: 4, name: "AI 3", chips: 750, position: { top: '10%', right: '10%' } },
    { id: 5, name: "AI 4", chips: 900, position: { bottom: '150px', right: '10%' } },
    { id: 6, name: "AI 5", chips: 1100, position: { top: '50%', right: '10px', transform: 'translateY(-50%)' } },
  ];

  // Placeholder for community cards (would be dynamic)
  const communityCards = ['🂠', '🂠', '🂠', '🂠', '🂠'];

  // Sample action handlers (would have real game logic later)
  const handleFold = () => {
    addToGameLog("You folded. Waiting for next hand...");
  };

  const handleCheck = () => {
    addToGameLog("You checked. Action moves to next player.");
  };

  const handleCall = () => {
    addToGameLog("You called. Action moves to next player.");
  };

  const handleRaise = () => {
    addToGameLog(`You raised to $${betAmount}. Action moves to next player.`);
  };

  const addToGameLog = (message) => {
    setGameLog(prevLog => [...prevLog, message]);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Poker Game</title>
        <meta name="description" content="A simple poker game" />
      </Head>

      <main style={styles.main}>
        <h1>Poker Table</h1>
        
        <div style={styles.table}>
          {/* Players */}
          {players.map(player => (
            <div 
              key={player.id} 
              style={{
                ...styles.playerPosition,
                ...player.position
              }}
            >
              <div style={styles.playerInfo}>
                <div style={styles.playerName}>{player.name}</div>
                <div style={styles.playerChips}>${player.chips}</div>
              </div>
              
              {/* Player cards (facedown for AI, visible for human) */}
              {player.isHuman && (
                <div style={{ display: 'flex', marginTop: '10px' }}>
                  <div style={styles.card}>A♠</div>
                  <div style={styles.card}>K♥</div>
                </div>
              )}
            </div>
          ))}

          {/* Community cards */}
          <div style={styles.communityCards}>
            {communityCards.map((card, index) => (
              <div key={index} style={styles.card}>{card}</div>
            ))}
          </div>

          {/* Pot */}
          <div style={styles.pot}>Pot: $150</div>
        </div>

        {/* Controls */}
        <div>
          <div style={styles.betAmount}>Bet Amount: ${betAmount}</div>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            value={betAmount} 
            onChange={(e) => setBetAmount(parseInt(e.target.value))} 
            style={styles.betSlider} 
          />
          
          <div style={styles.controls}>
            <button style={{...styles.button, ...styles.foldButton}} onClick={handleFold}>Fold</button>
            <button style={{...styles.button, ...styles.checkButton}} onClick={handleCheck}>Check</button>
            <button style={{...styles.button, ...styles.callButton}} onClick={handleCall}>Call</button>
            <button style={{...styles.button, ...styles.raiseButton}} onClick={handleRaise}>Raise</button>
          </div>
        </div>

        {/* Game Log */}
        <div style={styles.gameLog}>
          <h3>Game Log</h3>
          {gameLog.map((entry, index) => (
            <div key={index} style={styles.logEntry}>{entry}</div>
          ))}
        </div>
      </main>
    </div>
  );
}