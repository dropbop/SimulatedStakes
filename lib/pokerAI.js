/**
 * Poker AI System
 * Implements skilled decision-making for AI opponents with distinct personalities
 * Based on Casino Royale characters
 */

import { evaluateHand, HAND_RANKINGS } from './handEvaluator.js';

/**
 * Pre-flop hand rankings using a simplified Chen formula approach
 * Returns a value from 0-1 representing hand strength
 */
const PREFLOP_RANKINGS = {
  // Premium hands (0.85-1.0)
  'AA': 1.0, 'KK': 0.95, 'QQ': 0.90, 'JJ': 0.87, 'AKs': 0.86,
  // Strong hands (0.70-0.85)
  'TT': 0.82, 'AQs': 0.80, 'AJs': 0.78, 'KQs': 0.77, 'AK': 0.76,
  '99': 0.75, 'ATs': 0.74, 'KJs': 0.73, 'QJs': 0.72, 'JTs': 0.71,
  // Good hands (0.55-0.70)
  '88': 0.68, 'AQ': 0.67, 'KTs': 0.66, 'QTs': 0.65, 'A9s': 0.64,
  'AJ': 0.63, 'KQ': 0.62, '77': 0.61, 'T9s': 0.60, 'A8s': 0.59,
  'K9s': 0.58, 'AT': 0.57, '98s': 0.56, 'J9s': 0.55,
  // Playable hands (0.40-0.55)
  '66': 0.54, 'A7s': 0.53, 'Q9s': 0.52, 'KJ': 0.51, '87s': 0.50,
  'A5s': 0.49, 'A6s': 0.48, 'A4s': 0.47, 'A3s': 0.46, 'KT': 0.45,
  '55': 0.44, 'QJ': 0.43, '76s': 0.42, 'A2s': 0.41, '97s': 0.40,
  // Marginal hands (0.25-0.40)
  '44': 0.39, 'JT': 0.38, '65s': 0.37, '86s': 0.36, 'K8s': 0.35,
  'T8s': 0.34, 'QT': 0.33, '33': 0.32, '54s': 0.31, 'Q8s': 0.30,
  'K7s': 0.29, 'J8s': 0.28, '22': 0.27, '75s': 0.26, 'K6s': 0.25,
  // Weak hands (0.15-0.25)
  '64s': 0.24, 'T7s': 0.23, 'K5s': 0.22, 'K4s': 0.21, 'K3s': 0.20,
  'Q7s': 0.19, 'K2s': 0.18, '53s': 0.17, 'Q6s': 0.16, 'J7s': 0.15,
};

/**
 * Casino Royale character personalities
 * Each has distinct playing style parameters
 */
const PERSONALITIES = {
  'Le Chiffre': {
    name: 'Le Chiffre',
    tightness: 0.70,      // Only plays good hands
    aggression: 0.80,     // Bets/raises frequently
    bluffFrequency: 0.15, // Occasional calculated bluffs
    description: 'Calculating and ruthless. Plays tight but strikes hard.',
  },
  'Vesper Lynd': {
    name: 'Vesper Lynd',
    tightness: 0.80,      // Very selective
    aggression: 0.35,     // Passive, calls more than raises
    bluffFrequency: 0.05, // Rarely bluffs
    description: 'Cautious and methodical. Only plays premium hands.',
  },
  'Felix Leiter': {
    name: 'Felix Leiter',
    tightness: 0.35,      // Plays many hands
    aggression: 0.70,     // Aggressive betting
    bluffFrequency: 0.25, // Bluffs frequently
    description: 'Loose and fearless. Applies constant pressure.',
  },
  'Mathis': {
    name: 'Mathis',
    tightness: 0.50,      // Balanced
    aggression: 0.55,     // Slightly aggressive
    bluffFrequency: 0.30, // Unpredictable
    description: 'Tricky and deceptive. Hard to read.',
  },
  'M': {
    name: 'M',
    tightness: 0.75,      // Tight
    aggression: 0.45,     // Balanced
    bluffFrequency: 0.08, // Rarely bluffs
    description: 'Disciplined and patient. Waits for the right moment.',
  },
};

/**
 * Get pre-flop hand strength
 * @param {Array} holeCards - Player's two hole cards
 * @returns {number} Strength value from 0-1
 */
function getPreflopStrength(holeCards) {
  if (!holeCards || holeCards.length !== 2) return 0.1;

  const card1 = holeCards[0];
  const card2 = holeCards[1];

  // Get values sorted high to low
  const values = [card1.value, card2.value].sort((a, b) => {
    const order = ['A', 'K', 'Q', 'J', 'T', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    return order.indexOf(a === '10' ? 'T' : a) - order.indexOf(b === '10' ? 'T' : b);
  });

  // Normalize 10 to T for lookup
  const v1 = values[0] === '10' ? 'T' : values[0];
  const v2 = values[1] === '10' ? 'T' : values[1];

  const suited = card1.suit === card2.suit;
  const paired = v1 === v2;

  // Build hand key
  let handKey;
  if (paired) {
    handKey = `${v1}${v2}`;
  } else if (suited) {
    handKey = `${v1}${v2}s`;
  } else {
    handKey = `${v1}${v2}`;
  }

  // Look up in rankings, or calculate a default
  if (PREFLOP_RANKINGS[handKey]) {
    return PREFLOP_RANKINGS[handKey];
  }

  // Default calculation for unlisted hands
  const rank1 = cardRank(v1);
  const rank2 = cardRank(v2);
  let strength = (rank1 + rank2) / 28; // Max is 28 (A+A)

  if (suited) strength += 0.05;
  if (Math.abs(rank1 - rank2) <= 2) strength += 0.03; // Connected

  return Math.min(0.35, strength); // Cap unlisted hands
}

/**
 * Convert card value to numeric rank
 */
function cardRank(value) {
  const ranks = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '10': 10,
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
  };
  return ranks[value] || 2;
}

/**
 * Get post-flop hand strength using the evaluator
 * @param {Array} holeCards - Player's hole cards
 * @param {Array} communityCards - Community cards on board
 * @returns {number} Strength value from 0-1
 */
function getPostflopStrength(holeCards, communityCards) {
  if (!holeCards || !communityCards || communityCards.length === 0) {
    return getPreflopStrength(holeCards);
  }

  try {
    const evaluation = evaluateHand(holeCards, communityCards);

    // Map hand rankings to strength values
    const strengthMap = {
      [HAND_RANKINGS.ROYAL_FLUSH]: 1.0,
      [HAND_RANKINGS.STRAIGHT_FLUSH]: 0.97,
      [HAND_RANKINGS.FOUR_OF_A_KIND]: 0.94,
      [HAND_RANKINGS.FULL_HOUSE]: 0.88,
      [HAND_RANKINGS.FLUSH]: 0.82,
      [HAND_RANKINGS.STRAIGHT]: 0.75,
      [HAND_RANKINGS.THREE_OF_A_KIND]: 0.62,
      [HAND_RANKINGS.TWO_PAIR]: 0.52,
      [HAND_RANKINGS.ONE_PAIR]: 0.38,
      [HAND_RANKINGS.HIGH_CARD]: 0.18,
    };

    let baseStrength = strengthMap[evaluation.rank] || 0.18;

    // Adjust based on kicker strength for pairs
    if (evaluation.rank === HAND_RANKINGS.ONE_PAIR) {
      const pairValue = evaluation.tiebreakers[0];
      baseStrength += (pairValue - 2) * 0.01; // Higher pairs are stronger
    }

    // Adjust based on high card for high card hands
    if (evaluation.rank === HAND_RANKINGS.HIGH_CARD) {
      const highCard = evaluation.tiebreakers[0];
      baseStrength = 0.10 + (highCard - 2) * 0.01;
    }

    // Consider board texture
    baseStrength = adjustForBoardTexture(baseStrength, holeCards, communityCards, evaluation);

    return Math.min(1.0, Math.max(0.05, baseStrength));
  } catch (error) {
    console.error('Error evaluating hand:', error);
    return 0.2;
  }
}

/**
 * Adjust strength based on board texture
 */
function adjustForBoardTexture(strength, holeCards, communityCards, evaluation) {
  // Check for draws and scary boards
  const allCards = [...holeCards, ...communityCards];
  const suits = {};
  const values = [];

  allCards.forEach(card => {
    suits[card.suit] = (suits[card.suit] || 0) + 1;
    values.push(card.rank);
  });

  // Flush draw present (4 of same suit on board)
  const maxSuit = Math.max(...Object.values(suits));
  if (maxSuit >= 4 && evaluation.rank < HAND_RANKINGS.FLUSH) {
    strength -= 0.08; // Our non-flush is vulnerable
  }

  // Straight draw possible (connected board)
  values.sort((a, b) => a - b);
  let connected = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] - values[i - 1] === 1) connected++;
  }
  if (connected >= 3 && evaluation.rank < HAND_RANKINGS.STRAIGHT) {
    strength -= 0.05;
  }

  // Paired board makes our pair less valuable
  const boardValues = communityCards.map(c => c.rank);
  const boardPaired = new Set(boardValues).size < boardValues.length;
  if (boardPaired && evaluation.rank === HAND_RANKINGS.ONE_PAIR) {
    strength -= 0.05;
  }

  return strength;
}

/**
 * Calculate position value (0-1, higher is better)
 * @param {number} playerIndex - Player's position at table
 * @param {number} dealerIndex - Current dealer position
 * @param {number} totalPlayers - Total players at table
 * @returns {number} Position value 0-1
 */
function getPositionValue(playerIndex, dealerIndex, totalPlayers) {
  // Calculate position relative to dealer
  const relativePosition = (playerIndex - dealerIndex + totalPlayers) % totalPlayers;

  // Early positions (UTG, UTG+1): 0-0.3
  // Middle positions: 0.3-0.6
  // Late positions (CO, BTN): 0.6-1.0
  // Blinds: 0.1-0.2

  if (relativePosition === 0) return 1.0;  // Button (best)
  if (relativePosition === totalPlayers - 1) return 0.85; // Cutoff
  if (relativePosition === 1) return 0.15; // Small blind
  if (relativePosition === 2) return 0.20; // Big blind

  // Calculate for other positions
  const middlePositions = totalPlayers - 4;
  if (middlePositions <= 0) return 0.5;

  const positionInMiddle = relativePosition - 3;
  return 0.3 + (positionInMiddle / middlePositions) * 0.4;
}

/**
 * Calculate pot odds
 * @param {number} callAmount - Amount needed to call
 * @param {number} potSize - Current pot size
 * @returns {number} Pot odds as decimal
 */
function calculatePotOdds(callAmount, potSize) {
  if (callAmount <= 0) return 0;
  return callAmount / (potSize + callAmount);
}

/**
 * Main AI decision function
 * @param {Object} player - Player object with hand and chips
 * @param {Object} gameState - Current game state
 * @param {Object} personality - AI personality parameters
 * @returns {Object} Decision { action, amount? }
 */
function makeAIDecision(player, gameState, personality) {
  const { communityCards, pot, currentBet, minRaise, phase } = gameState;
  const availableActions = gameState.availableActions || [];
  const callAmount = currentBet - player.currentBet;

  // Get hand strength based on phase
  let handStrength;
  if (phase === 'preflop' || communityCards.length === 0) {
    handStrength = getPreflopStrength(player.hand);
  } else {
    handStrength = getPostflopStrength(player.hand, communityCards);
  }

  // Get position value
  const positionValue = getPositionValue(
    player.id,
    gameState.dealer,
    gameState.players.length
  );

  // Calculate pot odds
  const potOdds = calculatePotOdds(callAmount, pot);

  // Adjust hand strength based on personality and position
  let effectiveStrength = handStrength;

  // Loose players overvalue hands
  effectiveStrength += (1 - personality.tightness) * 0.12;

  // Position bonus
  effectiveStrength += positionValue * 0.08;

  // Clamp to valid range
  effectiveStrength = Math.min(1.0, Math.max(0.0, effectiveStrength));

  // Decision thresholds adjusted by personality
  const raiseThreshold = 0.60 - (personality.aggression * 0.15);
  const callThreshold = 0.30 - ((1 - personality.tightness) * 0.10);

  // Add some randomness to prevent predictability
  const randomFactor = (Math.random() - 0.5) * 0.15;
  effectiveStrength += randomFactor;

  // Stack-aware betting limits to prevent reckless all-ins
  const bigBlind = gameState.blinds?.big || minRaise;
  const stackToBlinds = player.chips / bigBlind;
  const isEarlyGame = stackToBlinds > 30; // Still have 30+ big blinds

  // Maximum % of stack willing to risk based on hand strength
  let maxStackRisk;
  if (effectiveStrength >= 0.85) {
    maxStackRisk = 1.0;  // Premium hands can go all-in
  } else if (effectiveStrength >= 0.70) {
    maxStackRisk = 0.50; // Strong hands risk up to 50%
  } else if (effectiveStrength >= 0.55) {
    maxStackRisk = 0.25; // Medium hands risk up to 25%
  } else {
    maxStackRisk = 0.15; // Marginal hands risk up to 15%
  }

  // In early game, be more conservative
  if (isEarlyGame) {
    maxStackRisk *= 0.6;
  }

  const maxRaiseFromStack = Math.floor(player.chips * maxStackRisk);

  // Bluff consideration (but don't bluff with huge portions of stack)
  const shouldBluff = Math.random() < personality.bluffFrequency;
  if (shouldBluff && effectiveStrength < callThreshold && callAmount < pot * 0.5) {
    if (availableActions.includes('raise') && player.chips > callAmount + minRaise * 2) {
      // Bluff raise - capped by stack risk
      const bluffAmount = Math.floor(pot * (0.5 + Math.random() * 0.3));
      const actualRaise = Math.min(bluffAmount, player.chips - callAmount, minRaise * 5, maxRaiseFromStack);
      if (actualRaise >= minRaise) {
        return { action: 'raise', amount: actualRaise };
      }
    }
  }

  // Value betting / raising
  if (effectiveStrength >= raiseThreshold && availableActions.includes('raise')) {
    // Calculate raise size based on strength
    let raiseMultiplier = 0.5 + (effectiveStrength - raiseThreshold) * 2;
    raiseMultiplier *= (0.8 + Math.random() * 0.4); // Add variance

    let raiseAmount = Math.floor(pot * raiseMultiplier);
    raiseAmount = Math.min(raiseAmount, maxRaiseFromStack); // Cap by stack risk
    const actualRaise = Math.max(minRaise, Math.min(raiseAmount, player.chips - callAmount));

    if (actualRaise >= minRaise && player.chips >= callAmount + actualRaise) {
      return { action: 'raise', amount: actualRaise };
    }
  }

  // Calling decision
  if (callAmount > 0) {
    // Fold marginal hands when facing bets that commit too much of stack
    const callPercentOfStack = callAmount / player.chips;
    if (callPercentOfStack > 0.20 && effectiveStrength < 0.65) {
      if (availableActions.includes('fold')) {
        return { action: 'fold' };
      }
    }

    // Call if hand strength justifies it or pot odds are good
    const shouldCall = effectiveStrength >= callThreshold ||
                       (potOdds < effectiveStrength * 0.8 && effectiveStrength > 0.2);

    if (shouldCall && availableActions.includes('call')) {
      return { action: 'call' };
    } else if (availableActions.includes('fold')) {
      return { action: 'fold' };
    }
  }

  // No bet to call - check or bet
  if (availableActions.includes('check')) {
    // Sometimes bet for value even when we can check
    if (effectiveStrength >= raiseThreshold * 0.9 && availableActions.includes('raise')) {
      let betAmount = Math.floor(pot * (0.4 + effectiveStrength * 0.4));
      betAmount = Math.min(betAmount, maxRaiseFromStack); // Cap by stack risk
      const actualBet = Math.max(minRaise, Math.min(betAmount, player.chips));
      if (actualBet >= minRaise) {
        return { action: 'raise', amount: actualBet };
      }
    }
    return { action: 'check' };
  }

  // Fallback
  if (availableActions.includes('call')) return { action: 'call' };
  if (availableActions.includes('check')) return { action: 'check' };
  return { action: 'fold' };
}

/**
 * Get a personality for an AI player
 * @param {number} playerIndex - Index of the player (1-5 for AIs)
 * @returns {Object} Personality object
 */
function getPersonalityForPlayer(playerIndex) {
  const characters = Object.values(PERSONALITIES);
  const index = (playerIndex - 1) % characters.length;
  return characters[index];
}

/**
 * Get all available personalities
 */
function getAllPersonalities() {
  return PERSONALITIES;
}

export {
  makeAIDecision,
  getPreflopStrength,
  getPostflopStrength,
  getPositionValue,
  calculatePotOdds,
  getPersonalityForPlayer,
  getAllPersonalities,
  PERSONALITIES,
  PREFLOP_RANKINGS,
};
