// handEvaluator.js
// This module handles poker hand evaluation and comparison

/**
 * Hand types ranked from highest to lowest:
 * 1. Royal Flush (Ace-high straight flush)
 * 2. Straight Flush (Five sequential cards of same suit)
 * 3. Four of a Kind (Four cards of same rank)
 * 4. Full House (Three of a kind plus a pair)
 * 5. Flush (Five cards of the same suit)
 * 6. Straight (Five sequential cards)
 * 7. Three of a Kind (Three cards of same rank)
 * 8. Two Pair (Two different pairs)
 * 9. One Pair (Two cards of same rank)
 * 10. High Card (Highest value card)
 */

// Hand ranking values (higher is better)
const HAND_RANKINGS = {
    ROYAL_FLUSH: 10,
    STRAIGHT_FLUSH: 9,
    FOUR_OF_A_KIND: 8,
    FULL_HOUSE: 7,
    FLUSH: 6,
    STRAIGHT: 5,
    THREE_OF_A_KIND: 4,
    TWO_PAIR: 3,
    ONE_PAIR: 2,
    HIGH_CARD: 1
  };
  
  /**
   * Evaluates the best 5-card hand from the given cards
   * @param {Array} holeCards - Player's 2 hole cards
   * @param {Array} communityCards - The 5 community cards
   * @returns {Object} Hand ranking information
   */
  function evaluateHand(holeCards, communityCards) {
    // Combine hole cards and community cards
    const allCards = [...holeCards, ...communityCards];
    
    // Get all possible 5-card combinations from the 7 cards
    const combinations = getCombinations(allCards, 5);
    
    // Evaluate each 5-card combination and find the best hand
    let bestHand = null;
    let bestHandRank = 0;
    let bestHandTiebreakers = [];
    
    for (const combo of combinations) {
      const { rank, name, tiebreakers } = rankHand(combo);
      
      // If this hand is better than our current best, update
      if (rank > bestHandRank || 
          (rank === bestHandRank && compareHighCards(tiebreakers, bestHandTiebreakers) > 0)) {
        bestHand = combo;
        bestHandRank = rank;
        bestHandTiebreakers = tiebreakers;
        bestHandName = name;
      }
    }
    
    return {
      cards: bestHand,
      rank: bestHandRank,
      name: bestHandName,
      tiebreakers: bestHandTiebreakers
    };
  }
  
  /**
   * Ranks a 5-card poker hand
   * @param {Array} cards - Five card objects
   * @returns {Object} Hand rank, name, and tiebreaker values
   */
  function rankHand(cards) {
    // Sort cards by rank (high to low)
    const sortedCards = [...cards].sort((a, b) => b.rank - a.rank);
    
    // Group by values and suits for easy checking
    const valueCounts = countValues(sortedCards);
    const suitCounts = countSuits(sortedCards);
    
    // Check for each hand type from highest to lowest
    
    // Check for flush
    const isFlush = Object.values(suitCounts).some(count => count === 5);
    
    // Check for straight
    const isStraight = checkStraight(sortedCards);
    
    // Check for royal flush and straight flush
    if (isFlush && isStraight) {
      if (sortedCards[0].rank === 14) { // Ace high
        return { 
          rank: HAND_RANKINGS.ROYAL_FLUSH, 
          name: "Royal Flush",
          tiebreakers: [sortedCards[0].rank] // No tiebreaker needed for royal flush
        };
      }
      return { 
        rank: HAND_RANKINGS.STRAIGHT_FLUSH, 
        name: "Straight Flush",
        tiebreakers: [sortedCards[0].rank] // High card of the straight
      };
    }
    
    // Get value counts sorted by count, then by rank
    const valuePairs = Object.entries(valueCounts)
      .map(([value, count]) => ({ value: parseInt(value), count }))
      .sort((a, b) => b.count - a.count || b.value - a.value);
    
    // Check for four of a kind
    if (valuePairs[0].count === 4) {
      return { 
        rank: HAND_RANKINGS.FOUR_OF_A_KIND, 
        name: "Four of a Kind",
        tiebreakers: [valuePairs[0].value, valuePairs[1].value]
      };
    }
    
    // Check for full house
    if (valuePairs[0].count === 3 && valuePairs[1].count >= 2) {
      return { 
        rank: HAND_RANKINGS.FULL_HOUSE, 
        name: "Full House",
        tiebreakers: [valuePairs[0].value, valuePairs[1].value]
      };
    }
    
    // Check for flush
    if (isFlush) {
      return { 
        rank: HAND_RANKINGS.FLUSH, 
        name: "Flush",
        tiebreakers: sortedCards.map(card => card.rank)
      };
    }
    
    // Check for straight
    if (isStraight) {
      return { 
        rank: HAND_RANKINGS.STRAIGHT, 
        name: "Straight",
        tiebreakers: [sortedCards[0].rank] // High card of the straight
      };
    }
    
    // Check for three of a kind
    if (valuePairs[0].count === 3) {
      return { 
        rank: HAND_RANKINGS.THREE_OF_A_KIND, 
        name: "Three of a Kind",
        tiebreakers: [
          valuePairs[0].value, 
          valuePairs[1].value,
          valuePairs[2].value
        ]
      };
    }
    
    // Check for two pair
    if (valuePairs[0].count === 2 && valuePairs[1].count === 2) {
      return { 
        rank: HAND_RANKINGS.TWO_PAIR, 
        name: "Two Pair",
        tiebreakers: [
          valuePairs[0].value, 
          valuePairs[1].value,
          valuePairs[2].value
        ]
      };
    }
    
    // Check for one pair
    if (valuePairs[0].count === 2) {
      return { 
        rank: HAND_RANKINGS.ONE_PAIR, 
        name: "One Pair",
        tiebreakers: [
          valuePairs[0].value,
          valuePairs[1].value,
          valuePairs[2].value,
          valuePairs[3].value
        ]
      };
    }
    
    // High card
    return { 
      rank: HAND_RANKINGS.HIGH_CARD, 
      name: "High Card",
      tiebreakers: sortedCards.map(card => card.rank)
    };
  }
  
  /**
   * Checks if the hand contains a straight
   * @param {Array} sortedCards - Cards sorted by rank (high to low)
   * @returns {Boolean} True if hand is a straight
   */
  function checkStraight(sortedCards) {
    // Handle special case A-5-4-3-2 straight
    if (sortedCards[0].rank === 14 &&  // Ace
        sortedCards[1].rank === 5 &&
        sortedCards[2].rank === 4 &&
        sortedCards[3].rank === 3 &&
        sortedCards[4].rank === 2) {
      return true;
    }
    
    // Check for sequential cards
    for (let i = 0; i < sortedCards.length - 1; i++) {
      if (sortedCards[i].rank !== sortedCards[i + 1].rank + 1) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Count occurrences of each card value
   * @param {Array} cards - Array of card objects
   * @returns {Object} Value counts
   */
  function countValues(cards) {
    const counts = {};
    for (const card of cards) {
      counts[card.rank] = (counts[card.rank] || 0) + 1;
    }
    return counts;
  }
  
  /**
   * Count occurrences of each suit
   * @param {Array} cards - Array of card objects
   * @returns {Object} Suit counts
   */
  function countSuits(cards) {
    const counts = {};
    for (const card of cards) {
      counts[card.suit] = (counts[card.suit] || 0) + 1;
    }
    return counts;
  }
  
  /**
   * Compares high cards for tiebreakers
   * @param {Array} a - First tiebreaker cards
   * @param {Array} b - Second tiebreaker cards
   * @returns {Number} 1 if a > b, -1 if a < b, 0 if equal
   */
  function compareHighCards(a, b) {
    for (let i = 0; i < a.length && i < b.length; i++) {
      if (a[i] > b[i]) return 1;
      if (a[i] < b[i]) return -1;
    }
    return 0;
  }
  
  /**
   * Gets all combinations of k elements from array
   * @param {Array} array - Array to get combinations from
   * @param {Number} k - Size of each combination
   * @returns {Array} Array of combinations
   */
  function getCombinations(array, k) {
    const result = [];
    
    // Recursive helper function
    function combine(start, combo) {
      if (combo.length === k) {
        result.push([...combo]);
        return;
      }
      
      for (let i = start; i < array.length; i++) {
        combo.push(array[i]);
        combine(i + 1, combo);
        combo.pop();
      }
    }
    
    combine(0, []);
    return result;
  }
  
  /**
   * Compare two hands and determine the winner
   * @param {Object} hand1 - First hand evaluation result
   * @param {Object} hand2 - Second hand evaluation result
   * @returns {Number} 1 if hand1 wins, -1 if hand2 wins, 0 if tie
   */
  function compareHands(hand1, hand2) {
    // Compare hand ranks
    if (hand1.rank > hand2.rank) return 1;
    if (hand1.rank < hand2.rank) return -1;
    
    // If same rank, compare tiebreakers
    return compareHighCards(hand1.tiebreakers, hand2.tiebreakers);
  }
  
  /**
   * Determine winner(s) from multiple player hands
   * @param {Array} players - Array of player objects with evaluated hands
   * @param {Array} communityCards - Shared community cards
   * @returns {Array} Array of winning player indexes
   */
  function determineWinners(players, communityCards) {
    // First, evaluate each player's hand
    const activePlayers = players.filter(p => !p.folded);
    
    const evaluatedHands = activePlayers.map(player => {
      return {
        player: player,
        hand: evaluateHand(player.hand, communityCards)
      };
    });
    
    // Find the best hand
    let bestHand = evaluatedHands[0];
    
    for (let i = 1; i < evaluatedHands.length; i++) {
      const comparison = compareHands(evaluatedHands[i].hand, bestHand.hand);
      if (comparison > 0) {
        bestHand = evaluatedHands[i];
      }
    }
    
    // Find all players with the same hand value (ties)
    const winners = evaluatedHands.filter(evaluation => {
      return compareHands(evaluation.hand, bestHand.hand) === 0;
    }).map(evaluation => evaluation.player);
    
    return winners;
  }
  
  export { evaluateHand, rankHand, compareHands, determineWinners, HAND_RANKINGS };