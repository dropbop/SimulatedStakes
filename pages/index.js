import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { PokerGame } from '../lib/gameLogic';
import { useBreakpoint } from '../hooks/useBreakpoint';

// Global CSS for custom scrollbar and animations
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
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

  @keyframes dialogueFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; }
    100% { opacity: 0; }
  }

  .dialogue-bubble {
    animation: dialogueFadeIn 4s ease-out forwards;
  }

  @keyframes actionPopup {
    0% { opacity: 0; transform: translateY(5px) scale(0.9); }
    15% { opacity: 1; transform: translateY(0) scale(1); }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }

  .action-popup {
    animation: actionPopup 2s ease-out forwards;
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

  /* Responsive overrides for smaller screens */
  @media (max-width: 1199px) {
    html, body {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  @media (max-width: 767px) {
    input[type="range"]::-webkit-slider-thumb {
      height: 24px;
      width: 24px;
      margin-top: -10px;
    }
    input[type="range"]::-moz-range-thumb {
      height: 20px;
      width: 20px;
    }
  }
`;

// Casino Royale themed styles - Refined & Cinematic
// Helper to generate responsive styles based on scale
const getResponsiveStyles = (scale, isMobile) => ({
  container: {
    minHeight: '100vh',
    padding: `clamp(10px, 2vw, 20px)`,
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
    overflowX: 'hidden',
    overflowY: isMobile ? 'auto' : 'hidden',
    paddingBottom: isMobile ? '140px' : '20px',
  },
  table: {
    position: 'relative',
    height: `clamp(260px, ${62 * scale}vw, 620px)`,
    margin: '0 auto',
    width: '100%',
    maxWidth: `clamp(300px, 90vw, 1050px)`,
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(35, 90, 55, 0.95) 0%, rgba(20, 60, 35, 0.95) 40%, rgba(12, 40, 25, 0.98) 70%, rgba(8, 28, 18, 1) 100%)
    `,
    borderRadius: '50%',
    border: `${Math.max(6, Math.round(12 * scale))}px solid #1a1410`,
    boxShadow: `
      inset 0 0 ${Math.round(100 * scale)}px rgba(0,0,0,0.5),
      0 ${Math.round(25 * scale)}px ${Math.round(80 * scale)}px rgba(0,0,0,0.8)
    `,
  },
  card: {
    width: `clamp(32px, ${4.5 * scale}vw, 48px)`,
    height: `clamp(44px, ${6.3 * scale}vw, 67px)`,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f6f3 50%, #ebe8e4 100%)',
    borderRadius: `clamp(3px, 0.5vw, 5px)`,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: `clamp(0.7rem, ${0.95 * scale}rem, 0.95rem)`,
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
    fontFamily: "'Outfit', sans-serif",
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
  },
  playerInfo: {
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.92) 0%, rgba(10, 10, 12, 0.95) 100%)',
    padding: `clamp(4px, 0.8vw, 10px) clamp(6px, 1.2vw, 14px)`,
    borderRadius: `clamp(6px, 1vw, 10px)`,
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    minWidth: `clamp(55px, 8vw, 110px)`,
    maxWidth: '115px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  button: {
    padding: `clamp(10px, 1.4vw, 14px) clamp(16px, 2.8vw, 28px)`,
    fontSize: `clamp(0.7rem, 0.85rem, 0.85rem)`,
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
    minHeight: '44px',
    minWidth: isMobile ? '80px' : 'auto',
  },
  betControls: {
    display: 'flex',
    alignItems: isMobile ? 'stretch' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '12px' : '20px',
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.9) 0%, rgba(10, 10, 12, 0.95) 100%)',
    padding: `clamp(12px, 1.6vw, 16px) clamp(16px, 2.8vw, 28px)`,
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    width: isMobile ? '100%' : 'auto',
  },
  betSlider: {
    width: isMobile ? '100%' : 'clamp(120px, 18vw, 180px)',
    height: '24px',
  },
  gameLog: {
    marginTop: `clamp(16px, 2.8vw, 28px)`,
    padding: `clamp(14px, 2vw, 20px) clamp(16px, 2.4vw, 24px)`,
    background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(5, 5, 7, 0.98) 100%)',
    borderRadius: '14px',
    maxHeight: isMobile ? '150px' : '220px',
    overflowY: 'auto',
    width: '100%',
    maxWidth: `clamp(300px, 90vw, 700px)`,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
});

const styles = {
  container: {
    minHeight: '100vh',
    padding: 'clamp(10px, 2vw, 20px)',
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
    overflowX: 'hidden',
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
  settingsButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
    border: '1px solid rgba(201, 162, 39, 0.25)',
    color: 'rgba(201, 162, 39, 0.8)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  settingsPanel: {
    position: 'fixed',
    top: '75px',
    right: '20px',
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.98) 0%, rgba(10, 10, 12, 0.99) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    padding: '20px',
    zIndex: 1001,
    minWidth: '200px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  settingsTitle: {
    fontSize: '0.75rem',
    color: 'rgba(201, 162, 39, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  settingsLabel: {
    fontSize: '0.85rem',
    color: 'rgba(220, 215, 205, 0.8)',
    marginBottom: '10px',
    display: 'block',
  },
  settingsOptions: {
    display: 'flex',
    gap: '8px',
  },
  settingsOption: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(200, 195, 185, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  settingsOptionActive: {
    background: 'rgba(201, 162, 39, 0.15)',
    border: '1px solid rgba(201, 162, 39, 0.4)',
    color: '#c9a227',
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
    height: 'clamp(240px, 45vh, 520px)',
    margin: '0 auto',
    width: '100%',
    maxWidth: 'clamp(300px, 90vw, 1050px)',
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(35, 90, 55, 0.95) 0%, rgba(20, 60, 35, 0.95) 40%, rgba(12, 40, 25, 0.98) 70%, rgba(8, 28, 18, 1) 100%)
    `,
    borderRadius: '50%',
    border: 'clamp(6px, 1.2vw, 12px) solid #1a1410',
    boxShadow: `
      inset 0 0 clamp(50px, 10vw, 100px) rgba(0,0,0,0.5),
      0 clamp(12px, 2.5vw, 25px) clamp(40px, 8vw, 80px) rgba(0,0,0,0.8)
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
    gap: 'clamp(4px, 1vw, 10px)',
    perspective: '1000px',
  },
  pot: {
    position: 'absolute',
    top: '32%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(0.75rem, 1vw, 1rem)',
    fontWeight: '500',
    color: '#c9a227',
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
    background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.85) 0%, rgba(5, 5, 5, 0.9) 100%)',
    padding: 'clamp(6px, 1vw, 10px) clamp(12px, 2.4vw, 24px)',
    borderRadius: '24px',
    border: '1px solid rgba(201, 162, 39, 0.25)',
    backdropFilter: 'blur(8px)',
    letterSpacing: '0.1em',
    whiteSpace: 'nowrap',
  },
  phaseIndicator: {
    position: 'absolute',
    top: '22%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(0.55rem, 0.7vw, 0.7rem)',
    color: 'rgba(200, 195, 185, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(0.15em, 0.3em, 0.3em)',
    fontWeight: '400',
  },
  blindsInfo: {
    position: 'absolute',
    bottom: '38%',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    fontSize: 'clamp(0.6rem, 0.75vw, 0.75rem)',
    color: 'rgba(200, 195, 185, 0.6)',
    textAlign: 'center',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  blindsAmount: {
    color: '#c9a227',
    fontWeight: '500',
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
    padding: 'clamp(4px, 0.8vw, 10px) clamp(6px, 1.2vw, 14px)',
    borderRadius: 'clamp(6px, 1vw, 10px)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    minWidth: 'clamp(55px, 8vw, 110px)',
    maxWidth: '115px',
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
    marginBottom: 'clamp(3px, 0.5vw, 5px)',
    fontWeight: '500',
    fontSize: 'clamp(0.7rem, 0.9vw, 0.9rem)',
    color: '#e8e0d5',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 'clamp(70px, 10vw, 120px)',
  },
  playerChips: {
    fontSize: 'clamp(0.65rem, 0.85vw, 0.85rem)',
    color: '#c9a227',
    fontWeight: '500',
    fontFamily: "'Outfit', sans-serif",
  },
  playerBet: {
    fontSize: 'clamp(0.6rem, 0.75vw, 0.75rem)',
    color: '#6dba82',
    marginTop: 'clamp(2px, 0.4vw, 4px)',
    fontWeight: '400',
  },
  dealerButton: {
    position: 'absolute',
    width: 'clamp(18px, 2.6vw, 26px)',
    height: 'clamp(18px, 2.6vw, 26px)',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #f5f5f0 0%, #d4d0c8 50%, #b8b4ac 100%)',
    color: '#1a1a1a',
    fontSize: 'clamp(7px, 0.9vw, 9px)',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
    border: 'none',
    letterSpacing: '0.05em',
  },
  card: {
    width: 'clamp(32px, 4.5vw, 48px)',
    height: 'clamp(44px, 6.3vw, 67px)',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f6f3 50%, #ebe8e4 100%)',
    borderRadius: 'clamp(3px, 0.5vw, 5px)',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(0.7rem, 0.95vw, 0.95rem)',
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
    gap: 'clamp(3px, 0.5vw, 5px)',
    marginTop: 'clamp(6px, 1vw, 10px)',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 'clamp(12px, 2.4vw, 24px)',
    gap: 'clamp(10px, 1.8vw, 18px)',
    width: '100%',
    maxWidth: '600px',
    padding: '0 10px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(6px, 1.2vw, 12px)',
    flexWrap: 'wrap',
    width: '100%',
  },
  button: {
    padding: 'clamp(10px, 1.4vw, 14px) clamp(14px, 2.8vw, 28px)',
    fontSize: 'clamp(0.7rem, 0.85vw, 0.85rem)',
    fontWeight: '500',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(0.08em, 0.15em, 0.15em)',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '44px',
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
    gap: 'clamp(10px, 2vw, 20px)',
    background: 'linear-gradient(180deg, rgba(15, 15, 18, 0.9) 0%, rgba(10, 10, 12, 0.95) 100%)',
    padding: 'clamp(12px, 1.6vw, 16px) clamp(14px, 2.8vw, 28px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  betLabel: {
    color: 'rgba(200, 195, 185, 0.6)',
    fontSize: 'clamp(0.65rem, 0.8vw, 0.8rem)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  betSlider: {
    width: 'clamp(100px, 18vw, 180px)',
    height: '24px',
    flex: '1 1 auto',
    minWidth: '80px',
  },
  betAmount: {
    fontSize: 'clamp(0.85rem, 1vw, 1rem)',
    color: '#c9a227',
    fontWeight: '500',
    minWidth: 'clamp(55px, 7.5vw, 75px)',
    textAlign: 'right',
    fontFamily: "'Outfit', sans-serif",
  },
  gameLog: {
    marginTop: 'clamp(16px, 2.8vw, 28px)',
    padding: 'clamp(12px, 2vw, 20px) clamp(14px, 2.4vw, 24px)',
    background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(5, 5, 7, 0.98) 100%)',
    borderRadius: '14px',
    maxHeight: 'clamp(100px, 15vh, 180px)',
    overflowY: 'auto',
    width: '100%',
    maxWidth: 'clamp(300px, 70vw, 700px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  logHeader: {
    fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)',
    color: 'rgba(201, 162, 39, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    marginBottom: 'clamp(8px, 1.2vw, 12px)',
    paddingBottom: 'clamp(6px, 1vw, 10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  logEntry: {
    margin: 'clamp(4px, 0.8vw, 8px) 0',
    fontSize: 'clamp(0.7rem, 0.85vw, 0.85rem)',
    color: 'rgba(220, 215, 205, 0.75)',
    lineHeight: '1.5',
    paddingLeft: 'clamp(8px, 1.2vw, 12px)',
    borderLeft: '2px solid rgba(201, 162, 39, 0.2)',
  },
  logEntryLatest: {
    color: 'rgba(232, 224, 213, 0.95)',
    borderLeft: '2px solid rgba(201, 162, 39, 0.6)',
  },
  statusMessage: {
    textAlign: 'center',
    padding: 'clamp(10px, 2vw, 20px)',
    fontSize: 'clamp(0.85rem, 1.05vw, 1.05rem)',
    color: 'rgba(201, 162, 39, 0.9)',
    fontWeight: '400',
    letterSpacing: '0.05em',
  },
  statusMessageSecondary: {
    color: 'rgba(200, 195, 185, 0.6)',
  },
  // Dialogue bubble styles
  dialogueBubble: {
    position: 'absolute',
    background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(5, 5, 7, 0.98) 100%)',
    border: '1px solid rgba(201, 162, 39, 0.35)',
    borderRadius: 'clamp(6px, 1vw, 10px)',
    padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)',
    maxWidth: 'clamp(120px, 20vw, 200px)',
    zIndex: 100,
    boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
  },
  dialogueCharacter: {
    fontSize: 'clamp(0.55rem, 0.7vw, 0.7rem)',
    color: 'rgba(201, 162, 39, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 'clamp(2px, 0.4vw, 4px)',
    fontWeight: '500',
  },
  dialogueLine: {
    fontSize: 'clamp(0.7rem, 0.85vw, 0.85rem)',
    color: 'rgba(232, 224, 213, 0.95)',
    lineHeight: '1.4',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  dialogueLineAction: {
    fontStyle: 'italic',
    color: 'rgba(200, 195, 185, 0.8)',
  },
};

// Player positions around the table (6 players) - pure percentage-based for reliable scaling
const getPlayerPositions = () => [
  // Bottom center (human player) - 270° on ellipse
  { bottom: '-2%', left: '50%', transform: 'translateX(-50%)' },
  // Bottom-left - 225° on ellipse
  { top: '65%', left: '8%', transform: 'translateY(-50%)' },
  // Top-left - 135° on ellipse
  { top: '35%', left: '8%', transform: 'translateY(-50%)' },
  // Top center - 90° on ellipse
  { top: '-2%', left: '50%', transform: 'translateX(-50%)' },
  // Top-right - 45° on ellipse
  { top: '35%', right: '8%', transform: 'translateY(-50%)' },
  // Bottom-right - 315° on ellipse
  { top: '65%', right: '8%', transform: 'translateY(-50%)' },
];

// Dealer button offsets - aligned with ellipse positions
const getDealerButtonOffsets = () => [
  { bottom: '12%', left: '56%' },      // Near bottom player
  { top: '72%', left: '18%' },          // Near left-bottom
  { top: '28%', left: '18%' },          // Near left-top
  { top: '8%', left: '56%' },           // Near top player
  { top: '28%', right: '18%' },         // Near right-top
  { top: '72%', right: '18%' },         // Near right-bottom
];

// Dialogue bubble positions - aligned with ellipse positions
const getDialoguePositions = () => [
  { bottom: '22%', left: '50%', transform: 'translateX(-50%)' },   // Above bottom player
  { top: '72%', left: '22%' },                                     // Right of left-bottom
  { top: '28%', left: '22%' },                                     // Right of left-top
  { top: '12%', left: '50%', transform: 'translateX(-50%)' },      // Below top player
  { top: '28%', right: '22%' },                                    // Left of right-top
  { top: '72%', right: '22%' },                                    // Left of right-bottom
];

// Animation speed settings (ms between AI moves)
const SPEED_OPTIONS = {
  slow: { label: 'Slow', delay: 2000 },
  normal: { label: 'Normal', delay: 1200 },
  fast: { label: 'Fast', delay: 500 },
};

export default function PokerTable() {
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [betAmount, setBetAmount] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [showWinnerHand, setShowWinnerHand] = useState(true);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [dialogueKey, setDialogueKey] = useState(0); // For forcing re-animation
  const [currentAction, setCurrentAction] = useState(null);
  const [actionKey, setActionKey] = useState(0); // For forcing re-animation

  // Responsive breakpoint hook
  const { isMobile } = useBreakpoint();

  // Player positions use pure percentages - no scale needed
  const playerPositions = getPlayerPositions();
  const dealerButtonOffsets = getDealerButtonOffsets();
  const dialoguePositions = getDialoguePositions();

  // Initialize game on mount
  useEffect(() => {
    const newGame = new PokerGame(6);
    newGame.setAutoProcessAI(false); // UI controls AI timing for visible delays
    setGame(newGame);
  }, []);

  // Handle dialogue display from game state
  useEffect(() => {
    if (gameState?.pendingDialogue && gameState.pendingDialogue !== currentDialogue) {
      setCurrentDialogue(gameState.pendingDialogue);
      setDialogueKey(prev => prev + 1); // Force re-animation

      // Auto-dismiss after 4 seconds (matches animation duration)
      const timer = setTimeout(() => {
        setCurrentDialogue(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [gameState?.pendingDialogue]);

  // Handle action popup display from game state
  useEffect(() => {
    if (gameState?.lastAction) {
      setCurrentAction(gameState.lastAction);
      setActionKey(prev => prev + 1); // Force re-animation

      // Auto-dismiss after 2 seconds (matches animation duration)
      const timer = setTimeout(() => {
        setCurrentAction(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState?.lastAction?.playerIndex, gameState?.lastAction?.action]);

  // Start a completely new game
  const startNewGame = useCallback(() => {
    const newGame = new PokerGame(6);
    newGame.setAutoProcessAI(false); // UI controls AI timing for visible delays
    setGame(newGame);
    setGameState(null);
    setBetAmount(20);
    setIsProcessing(false);
  }, []);

  // Keep betAmount in sync with minRaise when gameState changes
  useEffect(() => {
    if (gameState && gameState.minRaise) {
      const player = gameState.players.find(p => p.isHuman);
      if (player) {
        const toCall = gameState.currentBet - player.currentBet;
        const maxRaise = player.chips - toCall;
        // Clamp betAmount to valid range [minRaise, maxRaise]
        setBetAmount(prev => {
          if (prev < gameState.minRaise) return gameState.minRaise;
          if (prev > maxRaise) return Math.max(gameState.minRaise, maxRaise);
          return prev;
        });
      }
    }
  }, [gameState?.minRaise, gameState?.currentBet]);

  // Get current delay based on animation speed setting
  const getDelay = useCallback(() => SPEED_OPTIONS[animationSpeed].delay, [animationSpeed]);

  // Start a new hand
  const startNewHand = useCallback(() => {
    if (!game) return;
    if (isProcessing) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const delay = getDelay();

    try {
      const state = game.startNewHand();
      setGameState(state);
      setBetAmount(state.minRaise * 2);

      // Check if first player is AI and process with delays
      if (game.isAITurn()) {
        // AI goes first - process each AI turn with visible delays
        const processNextAI = () => {
          if (game.isAITurn()) {
            const moreAITurns = game.processOneAITurn();
            setGameState(game.getState());

            if (moreAITurns) {
              setTimeout(processNextAI, delay);
            } else {
              setIsProcessing(false);
            }
          } else {
            setGameState(game.getState());
            setIsProcessing(false);
          }
        };
        setTimeout(processNextAI, delay);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('startNewHand error:', error);
      setIsProcessing(false);
    }
  }, [game, isProcessing, getDelay]);

  // Process AI turns with visible delays between each move
  const processWithAIDelays = useCallback(() => {
    const delay = getDelay();

    const processNextAI = () => {
      // Check if it's an AI's turn
      if (game.isAITurn()) {
        // Process one AI move
        const moreAITurns = game.processOneAITurn();
        // Update state to show this AI's action
        setGameState(game.getState());

        if (moreAITurns) {
          // More AI players to process - wait and continue
          setTimeout(processNextAI, delay);
        } else {
          // No more AI turns - either human's turn or hand ended
          setIsProcessing(false);
        }
      } else {
        // Not AI's turn - update state and stop processing
        setGameState(game.getState());
        setIsProcessing(false);
      }
    };

    // Initial delay after human action before first AI moves
    setTimeout(processNextAI, Math.floor(delay * 0.6));
  }, [game, getDelay]);

  // Player action handlers
  const handleFold = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);
    game.fold();
    processWithAIDelays();
  }, [game, isProcessing, processWithAIDelays]);

  const handleCheck = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);
    game.check();
    processWithAIDelays();
  }, [game, isProcessing, processWithAIDelays]);

  const handleCall = useCallback(() => {
    if (!game || isProcessing) return;
    setIsProcessing(true);
    game.call();
    processWithAIDelays();
  }, [game, isProcessing, processWithAIDelays]);

  const handleRaise = useCallback(() => {
    if (!game || isProcessing || !gameState) return;
    setIsProcessing(true);
    try {
      game.raise(betAmount);
    } catch (error) {
      console.error('Raise error:', error.message);
    }
    processWithAIDelays();
  }, [game, isProcessing, gameState, betAmount, processWithAIDelays]);

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

  // Render dialogue bubble
  const renderDialogueBubble = () => {
    if (!currentDialogue || !gameState) return null;

    // Find player index by character name
    const playerIndex = gameState.players.findIndex(p => p.name === currentDialogue.character);
    if (playerIndex === -1) return null;

    const position = dialoguePositions[playerIndex];
    const isAction = currentDialogue.isAction || currentDialogue.line.startsWith('*');

    // Parse the line to separate action from speech
    let displayLine = currentDialogue.line;
    if (isAction && !displayLine.includes('"')) {
      // Pure action like "*silent*"
      displayLine = displayLine.replace(/^\*|\*$/g, '');
    }

    return (
      <div
        key={dialogueKey}
        className="dialogue-bubble"
        style={{
          ...styles.dialogueBubble,
          ...position,
        }}
      >
        <div style={styles.dialogueCharacter}>{currentDialogue.character}</div>
        <div style={{
          ...styles.dialogueLine,
          ...(isAction && !currentDialogue.line.includes('"') ? styles.dialogueLineAction : {}),
        }}>
          {displayLine}
        </div>
      </div>
    );
  };

  // Render action popup
  const renderActionPopup = () => {
    if (!currentAction || !gameState) return null;

    const position = dialoguePositions[currentAction.playerIndex];

    // Format action text
    let actionText;
    if (currentAction.action === 'raise') {
      actionText = `Raise $${currentAction.amount?.toLocaleString()}`;
    } else if (currentAction.action === 'call') {
      actionText = `Call $${currentAction.amount?.toLocaleString()}`;
    } else {
      actionText = currentAction.action.charAt(0).toUpperCase() + currentAction.action.slice(1);
    }

    // Color based on action type
    const actionColors = {
      fold: '#ef4444',    // red
      check: '#3b82f6',   // blue
      call: '#22c55e',    // green
      raise: '#c9a227',   // gold
    };
    const color = actionColors[currentAction.action] || '#ffffff';

    return (
      <div
        key={actionKey}
        className="action-popup"
        style={{
          position: 'absolute',
          ...position,
          background: 'rgba(0,0,0,0.9)',
          border: `2px solid ${color}`,
          borderRadius: '6px',
          padding: '8px 14px',
          color: color,
          fontWeight: '600',
          fontSize: '14px',
          zIndex: 90,
          pointerEvents: 'none',
        }}
      >
        {actionText}
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
            // Human player or winner's hand being shown
            player.hand.map((card, i) => renderCard(card, i))
          ) : (
            // Check if this is the winner and we should show their hand
            gameState.isGameOver && showWinnerHand && gameState.winner?.id === player.id && gameState.winner?.hand ? (
              gameState.winner.hand.map((card, i) => renderCard(card, i))
            ) : player.isHuman ? (
              null
            ) : !player.folded && !player.eliminated ? (
              <>
                {renderCard({}, 0, true)}
                {renderCard({}, 1, true)}
              </>
            ) : null
          )}
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
    <div style={{
      ...styles.container,
      overflowY: 'auto',
      paddingBottom: '20px',
    }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div style={styles.grainOverlay} />
      <div style={styles.vignette} />

      {/* Settings Button */}
      <button
        style={styles.settingsButton}
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
      >
        ⚙
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div style={styles.settingsPanel}>
          <div style={styles.settingsTitle}>Settings</div>
          <label style={styles.settingsLabel}>Animation Speed</label>
          <div style={styles.settingsOptions}>
            {Object.entries(SPEED_OPTIONS).map(([key, { label }]) => (
              <button
                key={key}
                style={{
                  ...styles.settingsOption,
                  ...(animationSpeed === key ? styles.settingsOptionActive : {})
                }}
                onClick={() => setAnimationSpeed(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <label style={{ ...styles.settingsLabel, marginTop: '16px' }}>Show Winner's Hand</label>
          <div style={styles.settingsOptions}>
            <button
              style={{
                ...styles.settingsOption,
                ...(showWinnerHand ? styles.settingsOptionActive : {})
              }}
              onClick={() => setShowWinnerHand(true)}
            >
              On
            </button>
            <button
              style={{
                ...styles.settingsOption,
                ...(!showWinnerHand ? styles.settingsOptionActive : {})
              }}
              onClick={() => setShowWinnerHand(false)}
            >
              Off
            </button>
          </div>
          <a
            href="https://github.com/dropbop/SimulatedStakes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(201, 162, 39, 0.3)',
              color: '#c9a227',
              textDecoration: 'none',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            GitHub Repository →
          </a>
        </div>
      )}

      <Head>
        <title>Casino Royale</title>
        <meta name="description" content="A Casino Royale themed poker game" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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

          {/* Blinds info */}
          {gameState?.blinds && (
            <div style={styles.blindsInfo}>
              <span>Blinds </span>
              <span style={styles.blindsAmount}>
                ${gameState.blinds.small.toLocaleString()}/${gameState.blinds.big.toLocaleString()}
              </span>
              {gameState.handsUntilBlindIncrease <= 3 && (
                <span style={{ color: '#e57373', marginLeft: '8px' }}>
                  (increase in {gameState.handsUntilBlindIncrease})
                </span>
              )}
            </div>
          )}

          {/* Community cards */}
          {renderCommunityCards()}

          {/* Players */}
          {gameState?.players.map((player, index) => renderPlayer(player, index))}

          {/* Dialogue bubble */}
          {renderDialogueBubble()}

          {/* Action popup */}
          {renderActionPopup()}
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
            {gameState.log.slice(-15).reverse().map((entry, index) => (
              <div
                key={index}
                style={{
                  ...styles.logEntry,
                  ...(index === 0 ? styles.logEntryLatest : {})
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
