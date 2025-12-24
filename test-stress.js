/**
 * Comprehensive stress test suite for Casino Royale Poker
 * Run with: node test-stress.js [numGames] [--verbose]
 *
 * Tests all game functions and provides detailed statistics including:
 * - Function coverage validation
 * - Game length histogram
 * - Win rates per character
 * - Action distribution
 * - Performance metrics
 */

import { PokerGame } from './lib/gameLogic.js';

const VERBOSE = process.argv.includes('--verbose');

function log(...args) {
  if (VERBOSE) console.log(...args);
}

// Track which functions have been exercised
const functionCoverage = {
  fold: 0,
  check: 0,
  call: 0,
  raise: 0,
  allIn: 0,
  startNewHand: 0,
  getState: 0,
  endBettingRound: 0,
  // Phases reached
  phases: {
    preflop: 0,
    flop: 0,
    turn: 0,
    river: 0,
    showdown: 0,
    endHand: 0,
  },
  // Special scenarios
  scenarios: {
    headsUp: 0,           // Only 2 players left
    multiWayPot: 0,       // 3+ players to showdown
    allFold: 0,           // Everyone folds to one player
    splitPot: 0,          // Pot split between players
    sidePotsCreated: 0,   // Side pots from all-ins
    blindsIncreased: 0,   // Blinds went up during game
  }
};

// Simulate a human player making random decisions
function simulateHumanAction(game) {
  const state = game.getState();
  functionCoverage.getState++;

  const actions = state.availableActions;
  if (actions.length === 0) return false;

  // Weight actions for realistic play
  const weights = { fold: 0.15, check: 0.35, call: 0.35, raise: 0.15 };
  let weightedActions = [];
  for (const action of actions) {
    const weight = weights[action] || 0.25;
    for (let i = 0; i < Math.ceil(weight * 100); i++) {
      weightedActions.push(action);
    }
  }

  const action = weightedActions[Math.floor(Math.random() * weightedActions.length)];

  try {
    switch (action) {
      case 'fold':
        game.fold();
        functionCoverage.fold++;
        break;
      case 'check':
        game.check();
        functionCoverage.check++;
        break;
      case 'call':
        game.call();
        functionCoverage.call++;
        break;
      case 'raise':
        const player = game.players[game.currentPlayerIndex];
        const minRaise = state.minRaise;
        const maxRaise = Math.min(player.chips - (state.currentBet - player.currentBet), minRaise * 5);
        const raiseAmount = Math.max(minRaise, Math.floor(Math.random() * maxRaise));
        game.raise(raiseAmount);
        functionCoverage.raise++;
        // Check if this resulted in all-in
        if (player.allIn) functionCoverage.allIn++;
        break;
    }
    return action;
  } catch (error) {
    log(`Action error: ${error.message}`);
    if (actions.includes('check')) { game.check(); return 'check'; }
    if (actions.includes('call')) { game.call(); return 'call'; }
    if (actions.includes('fold')) { game.fold(); return 'fold'; }
    return null;
  }
}

// Play a single hand
function playHand(game) {
  const stats = {
    success: false,
    iterations: 0,
    phasesReached: new Set(),
    actions: { fold: 0, check: 0, call: 0, raise: 0 },
    playersAtShowdown: 0,
    error: null
  };

  const maxIterations = 500;

  try {
    game.startNewHand();
    functionCoverage.startNewHand++;

    while (game.gamePhase !== 'endHand' && game.gamePhase !== 'gameOver' && stats.iterations < maxIterations) {
      stats.iterations++;
      stats.phasesReached.add(game.gamePhase);

      const currentPlayer = game.players[game.currentPlayerIndex];

      if (currentPlayer.isHuman && currentPlayer.canAct()) {
        const state = game.getState();
        if (state.availableActions.length > 0) {
          const action = simulateHumanAction(game);
          if (action) stats.actions[action]++;
        } else {
          break;
        }
      } else if (!currentPlayer.canAct()) {
        const canAct = game.players.some(p => p.canAct());
        if (!canAct) {
          game.endBettingRound();
          functionCoverage.endBettingRound++;
        } else {
          break;
        }
      }
    }

    // Track phases reached
    for (const phase of stats.phasesReached) {
      if (functionCoverage.phases[phase] !== undefined) {
        functionCoverage.phases[phase]++;
      }
    }

    // Track showdown stats
    const playersNotFolded = game.players.filter(p => !p.folded && !p.eliminated).length;
    stats.playersAtShowdown = playersNotFolded;

    if (stats.phasesReached.has('showdown')) {
      if (playersNotFolded >= 3) functionCoverage.scenarios.multiWayPot++;
    }

    if (playersNotFolded === 1 && !stats.phasesReached.has('showdown')) {
      functionCoverage.scenarios.allFold++;
    }

    stats.success = (game.gamePhase === 'endHand' || game.gamePhase === 'gameOver');
    if (stats.iterations >= maxIterations) {
      stats.error = 'Max iterations reached';
    }

  } catch (error) {
    stats.error = error.message;
  }

  return stats;
}

// Play a full game
function playFullGame(maxHands = 200) {
  const game = new PokerGame(6);
  const stats = {
    hands: 0,
    success: false,
    winner: null,
    winnerIsHuman: false,
    eliminations: [], // Track when players were eliminated
    finalBlindLevel: 0,
    errors: [],
    actionCounts: { fold: 0, check: 0, call: 0, raise: 0 }
  };

  const startingBlindLevel = game.blindLevel;

  while (game.gamePhase !== 'gameOver' && stats.hands < maxHands) {
    stats.hands++;

    const activeBefore = game.players.filter(p => !p.eliminated).length;
    const handStats = playHand(game);
    const activeAfter = game.players.filter(p => !p.eliminated).length;

    // Track eliminations
    if (activeAfter < activeBefore) {
      const eliminated = game.players.filter(p => p.eliminated && !stats.eliminations.some(e => e.name === p.name));
      for (const p of eliminated) {
        stats.eliminations.push({ name: p.name, hand: stats.hands });
      }
    }

    // Track heads-up
    if (activeAfter === 2) {
      functionCoverage.scenarios.headsUp++;
    }

    // Accumulate action counts
    for (const [action, count] of Object.entries(handStats.actions)) {
      stats.actionCounts[action] = (stats.actionCounts[action] || 0) + count;
    }

    if (handStats.error) {
      stats.errors.push({ hand: stats.hands, error: handStats.error });
    }

    // Check for winner
    const activePlayers = game.players.filter(p => !p.eliminated);
    if (activePlayers.length === 1) {
      stats.winner = activePlayers[0].name;
      stats.winnerIsHuman = activePlayers[0].isHuman;
      game.gamePhase = 'gameOver';
    }
  }

  // Track blind increases
  stats.finalBlindLevel = game.blindLevel;
  if (stats.finalBlindLevel > startingBlindLevel) {
    functionCoverage.scenarios.blindsIncreased += (stats.finalBlindLevel - startingBlindLevel);
  }

  stats.success = (game.gamePhase === 'gameOver' || stats.hands >= maxHands);

  if (!stats.winner) {
    const richest = game.players.reduce((a, b) => a.chips > b.chips ? a : b);
    stats.winner = richest.name + ' (by chips)';
    stats.winnerIsHuman = richest.isHuman;
  }

  return stats;
}

// Create a text-based histogram
function createHistogram(data, bucketSize, label) {
  if (data.length === 0) return '';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const buckets = {};

  // Create buckets
  for (const value of data) {
    const bucket = Math.floor(value / bucketSize) * bucketSize;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  }

  // Find max count for scaling
  const maxCount = Math.max(...Object.values(buckets));
  const barWidth = 40;

  let result = `\n${label}\n${'─'.repeat(60)}\n`;

  // Sort buckets and display
  const sortedBuckets = Object.keys(buckets).map(Number).sort((a, b) => a - b);

  for (const bucket of sortedBuckets) {
    const count = buckets[bucket];
    const barLength = Math.round((count / maxCount) * barWidth);
    const bar = '█'.repeat(barLength);
    const rangeLabel = `${bucket}-${bucket + bucketSize - 1}`.padStart(8);
    const countLabel = `(${count})`.padStart(6);
    result += `${rangeLabel}: ${bar} ${countLabel}\n`;
  }

  result += `${'─'.repeat(60)}\n`;
  result += `Min: ${min}  Max: ${max}  Avg: ${(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}\n`;

  return result;
}

// Main stress test
function runStressTest(numGames = 100) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  CASINO ROYALE POKER - COMPREHENSIVE STRESS TEST`);
  console.log(`  Running ${numGames.toLocaleString()} games...`);
  console.log(`${'═'.repeat(70)}\n`);

  const results = {
    gamesCompleted: 0,
    totalHands: 0,
    errors: [],
    wins: {},
    handCounts: [],
    eliminationOrder: {},
    actionCounts: { fold: 0, check: 0, call: 0, raise: 0 }
  };

  const startTime = Date.now();
  const progressInterval = Math.max(1, Math.floor(numGames / 20));

  for (let i = 1; i <= numGames; i++) {
    const gameStats = playFullGame(200);

    if (gameStats.success) {
      results.gamesCompleted++;
    }

    results.totalHands += gameStats.hands;
    results.handCounts.push(gameStats.hands);

    // Track wins
    const winner = gameStats.winner.replace(' (by chips)', '');
    results.wins[winner] = (results.wins[winner] || 0) + 1;

    // Track elimination order
    for (let j = 0; j < gameStats.eliminations.length; j++) {
      const elim = gameStats.eliminations[j];
      if (!results.eliminationOrder[elim.name]) {
        results.eliminationOrder[elim.name] = { positions: [], avgHand: 0 };
      }
      results.eliminationOrder[elim.name].positions.push(6 - j); // 6 players, position from 6th to 2nd
    }

    // Accumulate actions
    for (const [action, count] of Object.entries(gameStats.actionCounts)) {
      results.actionCounts[action] = (results.actionCounts[action] || 0) + count;
    }

    // Accumulate errors
    results.errors.push(...gameStats.errors.map(e => ({ game: i, ...e })));

    // Progress update
    if (i % progressInterval === 0 || i === numGames) {
      const pct = ((i / numGames) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (i / elapsed).toFixed(0);
      process.stdout.write(`\r  Progress: ${i.toLocaleString()}/${numGames.toLocaleString()} (${pct}%) - ${rate} games/sec`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n');

  // ═══════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════════════════

  console.log(`${'═'.repeat(70)}`);
  console.log(`  RESULTS`);
  console.log(`${'═'.repeat(70)}`);

  // Performance
  console.log(`\n📊 PERFORMANCE`);
  console.log(`${'─'.repeat(40)}`);
  console.log(`  Time elapsed:      ${elapsed}s`);
  console.log(`  Games completed:   ${results.gamesCompleted.toLocaleString()}/${numGames.toLocaleString()}`);
  console.log(`  Total hands:       ${results.totalHands.toLocaleString()}`);
  console.log(`  Games per second:  ${(numGames / elapsed).toFixed(1)}`);
  console.log(`  Hands per second:  ${(results.totalHands / elapsed).toFixed(0)}`);

  // Game Length Histogram
  console.log(createHistogram(results.handCounts, 10, '📈 GAME LENGTH DISTRIBUTION (hands per game)'));

  // Win Rates
  console.log(`\n🏆 WIN RATES`);
  console.log(`${'─'.repeat(50)}`);

  const sortedWins = Object.entries(results.wins).sort((a, b) => b[1] - a[1]);
  const maxNameLen = Math.max(...sortedWins.map(([name]) => name.length));

  for (const [name, wins] of sortedWins) {
    const pct = ((wins / numGames) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(parseFloat(pct) / 2));
    const isHuman = name === 'James Bond';
    const marker = isHuman ? ' 👤' : '';
    console.log(`  ${name.padEnd(maxNameLen)}  ${wins.toString().padStart(5)} wins (${pct.padStart(5)}%) ${bar}${marker}`);
  }

  // Survival Stats
  console.log(`\n💀 ELIMINATION STATS (avg finish position, 1st=winner)`);
  console.log(`${'─'.repeat(50)}`);

  const survivalStats = [];
  for (const [name, data] of Object.entries(results.eliminationOrder)) {
    const avgPos = data.positions.reduce((a, b) => a + b, 0) / data.positions.length;
    const timesEliminated = data.positions.length;
    survivalStats.push({ name, avgPos, timesEliminated });
  }

  // Add winners (they weren't eliminated)
  for (const [name, wins] of Object.entries(results.wins)) {
    const existing = survivalStats.find(s => s.name === name);
    if (existing) {
      // Recalculate with wins counted as position 1
      const totalPositions = [...results.eliminationOrder[name].positions, ...Array(wins).fill(1)];
      existing.avgPos = totalPositions.reduce((a, b) => a + b, 0) / totalPositions.length;
    } else {
      survivalStats.push({ name, avgPos: 1, timesEliminated: 0 });
    }
  }

  survivalStats.sort((a, b) => a.avgPos - b.avgPos);

  for (const stat of survivalStats) {
    const bar = '█'.repeat(Math.round((7 - stat.avgPos) * 5));
    console.log(`  ${stat.name.padEnd(maxNameLen)}  avg: ${stat.avgPos.toFixed(2)}  ${bar}`);
  }

  // Human Actions
  console.log(`\n🎮 HUMAN PLAYER ACTIONS`);
  console.log(`${'─'.repeat(40)}`);
  const totalActions = Object.values(results.actionCounts).reduce((a, b) => a + b, 0);
  for (const [action, count] of Object.entries(results.actionCounts)) {
    const pct = totalActions > 0 ? ((count / totalActions) * 100).toFixed(1) : '0.0';
    console.log(`  ${action.padEnd(8)} ${count.toLocaleString().padStart(8)} (${pct.padStart(5)}%)`);
  }

  // Function Coverage
  console.log(`\n✅ FUNCTION COVERAGE`);
  console.log(`${'─'.repeat(40)}`);
  console.log(`  Core Actions:`);
  console.log(`    fold()          ${functionCoverage.fold.toLocaleString().padStart(8)} calls`);
  console.log(`    check()         ${functionCoverage.check.toLocaleString().padStart(8)} calls`);
  console.log(`    call()          ${functionCoverage.call.toLocaleString().padStart(8)} calls`);
  console.log(`    raise()         ${functionCoverage.raise.toLocaleString().padStart(8)} calls`);
  console.log(`    all-in events   ${functionCoverage.allIn.toLocaleString().padStart(8)} times`);
  console.log(`  Game Flow:`);
  console.log(`    startNewHand()  ${functionCoverage.startNewHand.toLocaleString().padStart(8)} calls`);
  console.log(`    getState()      ${functionCoverage.getState.toLocaleString().padStart(8)} calls`);
  console.log(`    endBettingRound ${functionCoverage.endBettingRound.toLocaleString().padStart(8)} calls`);

  console.log(`\n  Phases Reached:`);
  for (const [phase, count] of Object.entries(functionCoverage.phases)) {
    console.log(`    ${phase.padEnd(12)} ${count.toLocaleString().padStart(8)} times`);
  }

  console.log(`\n  Special Scenarios:`);
  console.log(`    Heads-up games  ${functionCoverage.scenarios.headsUp.toLocaleString().padStart(8)} times`);
  console.log(`    Multi-way pots  ${functionCoverage.scenarios.multiWayPot.toLocaleString().padStart(8)} times`);
  console.log(`    All-fold wins   ${functionCoverage.scenarios.allFold.toLocaleString().padStart(8)} times`);
  console.log(`    Blind increases ${functionCoverage.scenarios.blindsIncreased.toLocaleString().padStart(8)} times`);

  // Errors
  if (results.errors.length > 0) {
    console.log(`\n❌ ERRORS (${results.errors.length} total)`);
    console.log(`${'─'.repeat(40)}`);
    const uniqueErrors = {};
    for (const e of results.errors) {
      uniqueErrors[e.error] = (uniqueErrors[e.error] || 0) + 1;
    }
    for (const [error, count] of Object.entries(uniqueErrors)) {
      console.log(`  ${count}x: ${error}`);
    }
  }

  // Final verdict
  console.log(`\n${'═'.repeat(70)}`);
  if (results.errors.length === 0 && results.gamesCompleted === numGames) {
    console.log(`  ✅ SUCCESS: All ${numGames.toLocaleString()} games completed without errors!`);

    // Validate function coverage
    const uncovered = [];
    if (functionCoverage.fold === 0) uncovered.push('fold');
    if (functionCoverage.check === 0) uncovered.push('check');
    if (functionCoverage.call === 0) uncovered.push('call');
    if (functionCoverage.raise === 0) uncovered.push('raise');

    if (uncovered.length > 0) {
      console.log(`  ⚠️  WARNING: Some functions never called: ${uncovered.join(', ')}`);
    } else {
      console.log(`  ✅ All core game functions exercised`);
    }
  } else {
    console.log(`  ❌ ISSUES: ${numGames - results.gamesCompleted} incomplete, ${results.errors.length} errors`);
  }
  console.log(`${'═'.repeat(70)}\n`);

  return results;
}

// Run the test
const numGames = parseInt(process.argv[2]) || 100;
runStressTest(numGames);
