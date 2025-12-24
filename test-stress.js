/**
 * Comprehensive stress test for Casino Royale Poker
 * Simulates real gameplay with random player decisions
 */

import { PokerGame } from './lib/gameLogic.js';

const VERBOSE = false; // Set to true for detailed output

function log(...args) {
  if (VERBOSE) console.log(...args);
}

// Simulate a human player making random decisions
function simulateHumanAction(game) {
  const state = game.getState();
  const actions = state.availableActions;

  if (actions.length === 0) {
    log('  No actions available for human');
    return false;
  }

  // Weight the actions to simulate realistic play
  // Sometimes fold, sometimes call, sometimes raise
  const weights = {
    'fold': 0.15,
    'check': 0.35,
    'call': 0.35,
    'raise': 0.15
  };

  // Build weighted action list
  let weightedActions = [];
  for (const action of actions) {
    const weight = weights[action] || 0.25;
    const count = Math.ceil(weight * 100);
    for (let i = 0; i < count; i++) {
      weightedActions.push(action);
    }
  }

  const action = weightedActions[Math.floor(Math.random() * weightedActions.length)];

  try {
    switch (action) {
      case 'fold':
        log('  Human folds');
        game.fold();
        break;
      case 'check':
        log('  Human checks');
        game.check();
        break;
      case 'call':
        log('  Human calls');
        game.call();
        break;
      case 'raise':
        // Random raise amount between min and 3x min (or all-in)
        const player = game.players[game.currentPlayerIndex];
        const minRaise = state.minRaise;
        const maxRaise = Math.min(player.chips - (state.currentBet - player.currentBet), minRaise * 5);
        const raiseAmount = Math.max(minRaise, Math.floor(Math.random() * maxRaise));
        log(`  Human raises ${raiseAmount}`);
        game.raise(raiseAmount);
        break;
    }
    return true;
  } catch (error) {
    console.error(`  Action error: ${error.message}`);
    // Fallback
    if (actions.includes('check')) game.check();
    else if (actions.includes('call')) game.call();
    else if (actions.includes('fold')) game.fold();
    return true;
  }
}

// Run a single hand and return stats
function playHand(game, handNum) {
  const stats = {
    success: false,
    iterations: 0,
    phase: null,
    actions: { fold: 0, check: 0, call: 0, raise: 0 },
    error: null
  };

  const maxIterations = 500;

  try {
    game.startNewHand();
    log(`\n--- Hand ${handNum} started ---`);

    while (game.gamePhase !== 'endHand' && game.gamePhase !== 'gameOver' && stats.iterations < maxIterations) {
      stats.iterations++;

      const currentPlayer = game.players[game.currentPlayerIndex];

      // Log state occasionally
      if (stats.iterations % 50 === 0) {
        log(`  Iteration ${stats.iterations}: Phase=${game.gamePhase}, Player=${currentPlayer.name}`);
      }

      if (currentPlayer.isHuman && currentPlayer.canAct()) {
        const state = game.getState();
        if (state.availableActions.length > 0) {
          const action = state.availableActions[Math.floor(Math.random() * state.availableActions.length)];
          stats.actions[action] = (stats.actions[action] || 0) + 1;
          simulateHumanAction(game);
        } else {
          // No actions but human's turn - might be stuck
          log(`  WARNING: Human's turn but no actions. Phase=${game.gamePhase}`);
          break;
        }
      } else if (!currentPlayer.canAct()) {
        // Current player can't act - check if anyone can
        const canAct = game.players.some(p => p.canAct());
        if (!canAct) {
          log(`  No players can act, forcing end of betting round`);
          game.endBettingRound();
        } else {
          // Something's wrong - we're on a player who can't act
          log(`  WARNING: Current player ${currentPlayer.name} can't act but others can`);
          break;
        }
      }
      // AI players act automatically via game logic
    }

    stats.phase = game.gamePhase;
    stats.success = (game.gamePhase === 'endHand' || game.gamePhase === 'gameOver');

    if (stats.iterations >= maxIterations) {
      stats.error = 'Max iterations reached';
      console.error(`Hand ${handNum}: STUCK after ${stats.iterations} iterations`);
    }

  } catch (error) {
    stats.error = error.message;
    stats.phase = game.gamePhase;
    console.error(`Hand ${handNum}: ERROR - ${error.message}`);
  }

  return stats;
}

// Play a full game (multiple hands until game over or max hands)
function playFullGame(gameNum, maxHands = 100) {
  const game = new PokerGame(6);
  const gameStats = {
    hands: 0,
    success: false,
    winner: null,
    humanSurvived: false,
    totalIterations: 0,
    errors: [],
    actionCounts: { fold: 0, check: 0, call: 0, raise: 0 }
  };

  log(`\n========== GAME ${gameNum} ==========`);

  while (game.gamePhase !== 'gameOver' && gameStats.hands < maxHands) {
    gameStats.hands++;

    const handStats = playHand(game, gameStats.hands);
    gameStats.totalIterations += handStats.iterations;

    // Accumulate action counts
    for (const [action, count] of Object.entries(handStats.actions)) {
      gameStats.actionCounts[action] = (gameStats.actionCounts[action] || 0) + count;
    }

    if (handStats.error) {
      gameStats.errors.push({ hand: gameStats.hands, error: handStats.error });
    }

    // Check chip counts
    const activePlayers = game.players.filter(p => !p.eliminated);
    log(`  Hand ${gameStats.hands} complete. Active players: ${activePlayers.length}`);

    if (activePlayers.length === 1) {
      gameStats.winner = activePlayers[0].name;
      gameStats.humanSurvived = activePlayers[0].isHuman;
      game.gamePhase = 'gameOver';
    }
  }

  gameStats.success = (game.gamePhase === 'gameOver' || gameStats.hands >= maxHands);

  if (!gameStats.winner) {
    const richest = game.players.reduce((a, b) => a.chips > b.chips ? a : b);
    gameStats.winner = richest.name + ' (by chips)';
    gameStats.humanSurvived = richest.isHuman;
  }

  return gameStats;
}

// Main stress test
function runStressTest(numGames = 20) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`STRESS TEST: ${numGames} full games`);
  console.log(`${'='.repeat(60)}\n`);

  const results = {
    gamesCompleted: 0,
    totalHands: 0,
    totalIterations: 0,
    errors: [],
    humanWins: 0,
    aiWins: {},
    actionCounts: { fold: 0, check: 0, call: 0, raise: 0 },
    avgHandsPerGame: 0,
    avgIterationsPerHand: 0
  };

  const startTime = Date.now();

  for (let i = 1; i <= numGames; i++) {
    const gameStats = playFullGame(i, 200); // Max 200 hands per game

    if (gameStats.success) {
      results.gamesCompleted++;
    }

    results.totalHands += gameStats.hands;
    results.totalIterations += gameStats.totalIterations;

    // Track wins
    if (gameStats.humanSurvived) {
      results.humanWins++;
    } else {
      results.aiWins[gameStats.winner] = (results.aiWins[gameStats.winner] || 0) + 1;
    }

    // Accumulate actions
    for (const [action, count] of Object.entries(gameStats.actionCounts)) {
      results.actionCounts[action] = (results.actionCounts[action] || 0) + count;
    }

    // Accumulate errors
    results.errors.push(...gameStats.errors.map(e => ({ game: i, ...e })));

    // Progress update
    if (i % 5 === 0 || i === numGames) {
      console.log(`Progress: ${i}/${numGames} games (${results.gamesCompleted} completed, ${results.errors.length} errors)`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  results.avgHandsPerGame = (results.totalHands / numGames).toFixed(1);
  results.avgIterationsPerHand = (results.totalIterations / results.totalHands).toFixed(1);

  // Print results
  console.log(`\n${'='.repeat(60)}`);
  console.log('RESULTS');
  console.log(`${'='.repeat(60)}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Games completed: ${results.gamesCompleted}/${numGames}`);
  console.log(`Total hands played: ${results.totalHands}`);
  console.log(`Avg hands per game: ${results.avgHandsPerGame}`);
  console.log(`Avg iterations per hand: ${results.avgIterationsPerHand}`);
  console.log(`Total errors: ${results.errors.length}`);

  console.log(`\nPlayer Actions (human):`);
  console.log(`  Folds: ${results.actionCounts.fold}`);
  console.log(`  Checks: ${results.actionCounts.check}`);
  console.log(`  Calls: ${results.actionCounts.call}`);
  console.log(`  Raises: ${results.actionCounts.raise}`);

  console.log(`\nWin Distribution:`);
  console.log(`  James Bond (human): ${results.humanWins} wins (${((results.humanWins/numGames)*100).toFixed(1)}%)`);
  for (const [name, wins] of Object.entries(results.aiWins)) {
    console.log(`  ${name}: ${wins} wins (${((wins/numGames)*100).toFixed(1)}%)`);
  }

  if (results.errors.length > 0) {
    console.log(`\nFirst 5 errors:`);
    results.errors.slice(0, 5).forEach(e => {
      console.log(`  Game ${e.game}, Hand ${e.hand}: ${e.error}`);
    });
  }

  console.log(`\n${'='.repeat(60)}`);
  if (results.errors.length === 0 && results.gamesCompleted === numGames) {
    console.log('SUCCESS: All games completed without errors!');
  } else {
    console.log(`ISSUES: ${numGames - results.gamesCompleted} incomplete games, ${results.errors.length} errors`);
  }
  console.log(`${'='.repeat(60)}\n`);

  return results;
}

// Run the test
const numGames = parseInt(process.argv[2]) || 20;
runStressTest(numGames);
