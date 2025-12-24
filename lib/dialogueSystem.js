/**
 * Casino Royale Dialogue System
 * Implements character voice lines with probability-based triggering,
 * cooldowns, and relationship dynamics
 */

// ============================================================================
// DIALOGUE DATABASE - All character lines organized by trigger
// ============================================================================

const DIALOGUE_DATABASE = {
  // -------------------------------------------------------------------------
  // JAMES BOND (Player character - used for auto-quips and internal monologue)
  // -------------------------------------------------------------------------
  'James Bond': {
    ON_WIN_BIG_POT: [
      '"I think I\'ll have that drink now."',
      '*collects chips without comment*',
      '"You seem surprised."',
    ],
    ON_ALL_IN: [
      '*pushes chips forward silently*',
      '"All of it."',
    ],
    ON_BLUFF_SUCCESS: [
      '*slight smile, nothing more*',
      '"You should have called."',
    ],
    ON_CATCH_BLUFF: [
      '"Interesting tell."',
    ],
    ON_CATCH_BLUFF_VS_LE_CHIFFRE: [
      '"Your eye\'s bleeding."',
      '"Interesting tell."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"Better luck next time."',
      '*silent nod*',
    ],
    ON_ELIMINATE_LE_CHIFFRE: [
      '"Looks like your clients will be disappointed."',
      '"I\'d start running if I were you."',
      '"Do give my regards to Mr. Obanno."',
    ],
    ON_ELIMINATE_DIMITRIOS: [
      '"I believe I already have your car."',
      '"Send Solange my best."',
    ],
    ON_SHORT_STACK: [
      '*The odds aren\'t in my favor. They rarely are.*',
      '*M\'s going to be furious.*',
      '*Think. There\'s always a way.*',
    ],
    ON_TOURNAMENT_WIN: [
      '"The name\'s Bond. James Bond."',
      '*straightens cuffs*',
      '"I think you owe me a martini."',
    ],
    ON_HEADS_UP_VS_LE_CHIFFRE: [
      '"Just you and me now."',
      '"Shall we finish this?"',
      '"Your clients must be getting anxious."',
    ],
  },

  // -------------------------------------------------------------------------
  // LE CHIFFRE
  // -------------------------------------------------------------------------
  'Le Chiffre': {
    ON_FOLD: [
      '*silent*',
      '"Not this time."',
      '"Patience is a virtue, Mr. Bond."',
    ],
    ON_CHECK: [
      '*touches temple thoughtfully*',
      '*silence*',
    ],
    ON_CALL: [
      '"I\'ll see that."',
      '*slides chips forward precisely*',
      '"Acceptable."',
    ],
    ON_RAISE: [
      '"Let\'s make this interesting."',
      '"I think you\'re bluffing. But let\'s find out."',
      '"You seem confident. Let me test that."',
      '*raises without comment, eyes fixed on opponent*',
    ],
    ON_RAISE_BLUFFING: [
      '*touches left eye briefly* "Raise."',
      '*absently touches left eye* "I\'ll raise."',
      '*dabs at left eye with handkerchief* "Let\'s continue."',
    ],
    ON_ALL_IN: [
      '"Everything."',
      '"All of it. Let\'s end this."',
      '*pushes chips forward with unsettling calm* "Your move."',
    ],
    ON_WIN_HAND: [
      '*collects chips methodically*',
      '"Mathematics doesn\'t lie."',
      '"Predictable."',
      '*slight smile that doesn\'t reach his eyes*',
    ],
    ON_WIN_BIG_POT: [
      '"You\'ve changed your shirt, Mr. Bond. I hope our game isn\'t causing you to perspire."',
      '"The odds always favor the house. I am the house."',
      '"Perhaps you should have stayed in London."',
    ],
    ON_LOSE_HAND: [
      '*jaw tightens almost imperceptibly*',
      '*silence*',
      '"Luck. It won\'t last."',
    ],
    ON_BAD_BEAT: [
      '*eye twitches*',
      '*long pause* "Impressive."',
      '*reaches for inhaler*',
    ],
    ON_BLUFF_SUCCESS: [
      '"You should trust your instincts less."',
      '*collects pot without comment*',
      '"Doubt is a powerful weapon."',
    ],
    ON_BLUFF_CAUGHT: [
      '*pauses* "Well played."',
      '*eye bleeds slightly* "It seems I underestimated you."',
      '"Everyone makes mistakes."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"One less variable."',
      '"The mathematics simplify."',
      '*returns to studying remaining opponents*',
    ],
    ON_ELIMINATE_BOND: [
      '"Your government will want their money back, Mr. Bond. Alas."',
      '"Please give my regards to M. If you see her again."',
      '"You played well. Not well enough."',
    ],
    ON_ELIMINATED: [
      '*stands slowly* "This isn\'t over."',
      '"I can get the money. I can get it."',
      '*to Mr. White* "I\'ll get the money."',
    ],
    ON_ELIMINATED_BY_BOND: [
      '*stares at Bond for a long moment* "You have no idea what you\'ve done."',
      '"They\'ll kill me. But they\'ll find you too, Mr. Bond."',
      '"Enjoy your victory. It will be brief."',
    ],
    ON_SHORT_STACK: [
      '*uses inhaler*',
      '*eye begins to weep blood*',
      '"The game isn\'t over."',
      '*glances toward Obanno with barely concealed fear*',
    ],
    ON_CHIP_LEADER: [
      '"The mathematics are clear now."',
      '*relaxes slightly* "Shall we continue?"',
      '"I think you\'ll find the odds have shifted."',
    ],
    ON_HEADS_UP: [
      '"Just the two of us now, Mr. Bond. No more distractions."',
      '"Your country sent their best. Let\'s see if it\'s enough."',
      '"I\'ve been looking forward to this."',
    ],
    ON_TOURNAMENT_WIN: [
      '"Thank you for the game, gentlemen. The money will be put to good use."',
      '*to Obanno* "You\'ll have your funds by morning."',
      '*collects chips* "Mathematics. Always mathematics."',
    ],
    ON_VERSUS_BOND: [
      '"Ah, Mr. Bond. Feeling lucky?"',
      '"Your file said you were reckless. I\'m counting on it."',
      '"The eyes reveal everything, Mr. Bond. Yours especially."',
    ],
    ON_VERSUS_OBANNO: [
      '*carefully neutral* "Mr. Obanno."',
      '*avoids eye contact*',
      '"I assure you, this will be resolved."',
    ],
    ON_VERSUS_VESPER: [
      '"Miss Lynd. The money woman."',
      '"Treasury sent you to watch their investment. How is it performing?"',
      '*studies her* "You seem... conflicted."',
    ],
    ON_AMBIENT: [
      '"The mathematics are quite elegant, really."',
      '*checks watch*',
      '*uses inhaler*',
    ],
  },

  // -------------------------------------------------------------------------
  // VESPER LYND
  // -------------------------------------------------------------------------
  'Vesper Lynd': {
    ON_FOLD: [
      '*folds without comment*',
      '"Not worth the risk."',
    ],
    ON_CHECK: [
      '*silent*',
      '*taps table once*',
    ],
    ON_CALL: [
      '"I\'ll call."',
      '"Let\'s see."',
      '*slides chips forward precisely*',
    ],
    ON_RAISE: [
      '"Raise."',
      '"I think you\'re overconfident."',
      '*slight raise of eyebrow* "More."',
    ],
    ON_ALL_IN: [
      '*pause* "All in."',
      '"Everything."',
      '*pushes chips forward with visible resolve*',
    ],
    ON_WIN_HAND: [
      '*small, private smile*',
      '"Thank you."',
      '*collects chips efficiently*',
    ],
    ON_WIN_BIG_POT: [
      '"The Treasury will be pleased."',
      '"Perhaps I should play more often."',
      '*allows herself a slight smile*',
    ],
    ON_LOSE_HAND: [
      '*accepts loss gracefully*',
      '"Well played."',
    ],
    ON_CATCH_BLUFF: [
      '"I thought so."',
      '"You\'re more transparent than you realize."',
      '*to Bond* "Even I saw that one."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"I\'m sorry. Truly."',
      '*nods respectfully*',
    ],
    ON_ELIMINATED: [
      '"It seems I\'m out." *to Bond* "Don\'t lose our money."',
      '"Well. That\'s that."',
      '*stands with dignity* "Good luck, James."',
    ],
    ON_SHORT_STACK: [
      '*maintains composure*',
    ],
    ON_HEADS_UP_VS_BOND: [
      '"I suppose this was inevitable."',
      '"Don\'t go easy on me."',
      '"May the best player win."',
    ],
    ON_VERSUS_BOND: [
      '"Feeling confident, James?"',
      '"Don\'t think I\'ll go easy on you because we\'re on the same side."',
      '"Your tell is showing."',
      '"Arrogance and self-awareness seldom go hand in hand."',
    ],
    ON_VERSUS_LE_CHIFFRE: [
      '*watches him carefully*',
      '"I don\'t trust him."',
      '*to Bond, quietly* "Watch his eye."',
    ],
    ON_BOND_WINS_BIG: [
      '"Well done." *slight smile*',
      '*visible relief*',
      '"Perhaps you do know what you\'re doing."',
    ],
    ON_BOND_LOSES_BIG: [
      '*concerned glance*',
      '"James..."',
      '*maintains composure but grips table edge*',
    ],
    ON_LE_CHIFFRE_ELIMINATED: [
      '"It\'s over." *exhales*',
      '*looks at Bond with something like wonder*',
    ],
    ON_AMBIENT: [
      '*studies Bond*',
      '*glances at pot total*',
    ],
  },

  // -------------------------------------------------------------------------
  // FELIX LEITER
  // -------------------------------------------------------------------------
  'Felix Leiter': {
    ON_FOLD: [
      '"Not my hand."',
      '"I\'ll sit this one out."',
      '*tosses cards* "All yours."',
    ],
    ON_CHECK: [
      '"Check."',
      '*taps table* "Let\'s see what comes."',
      '"I\'ll take the free card."',
    ],
    ON_CALL: [
      '"I\'ll call."',
      '"Sure, why not."',
      '"Let\'s see what you\'ve got."',
    ],
    ON_RAISE: [
      '"Let\'s make this interesting."',
      '"Raise."',
      '*grins* "A little more."',
      '"I think you\'re full of it. Raise."',
    ],
    ON_ALL_IN: [
      '"All in. Let\'s dance."',
      '"Everything. What do you say?"',
      '*pushes chips forward* "I\'ve got a feeling."',
    ],
    ON_WIN_HAND: [
      '"I\'ll take that."',
      '*friendly shrug* "Sometimes you get lucky."',
      '"That\'ll do."',
    ],
    ON_WIN_BIG_POT: [
      '"God bless America."',
      '"Now that\'s what I\'m talking about."',
      '"Uncle Sam thanks you for your contribution."',
    ],
    ON_LOSE_HAND: [
      '"Can\'t win \'em all."',
      '*good-natured shrug*',
      '"You got me."',
    ],
    ON_BAD_BEAT: [
      '"Ouch."',
      '"That\'s poker."',
      '*laughs despite himself* "Unbelievable."',
    ],
    ON_BLUFF_SUCCESS: [
      '*winks*',
      '"Never show your cards."',
      '"Like taking candy from a baby."',
    ],
    ON_BLUFF_CAUGHT: [
      '*laughs* "Worth a shot."',
      '"You got me."',
      '"Can\'t blame a guy for trying."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"Tough break."',
      '"Better luck next time."',
      '"Nothing personal."',
    ],
    ON_ELIMINATED: [
      '"Well, that\'s me done." *shakes Bond\'s hand* "Get \'em, James."',
      '"Looks like I\'m out. Win this thing."',
      '"Back to watching, I guess."',
    ],
    ON_CHIP_LEADER: [
      '"Would you look at that."',
      '"I could get used to this."',
    ],
    ON_HEADS_UP_VS_BOND: [
      '"Hell of a way to end up."',
      '"May the best man win, James."',
      '"Allies to the end, huh?" *grins*',
    ],
    ON_TOURNAMENT_WIN: [
      '"I did not see that coming."',
      '"Drinks are on me. All of them."',
      '"Langley\'s gonna love this."',
    ],
    ON_VERSUS_BOND: [
      '"Your move, 007."',
      '"Don\'t hold back on my account."',
      '"Show me what British intelligence is made of."',
    ],
    ON_VERSUS_LE_CHIFFRE: [
      '"Let\'s see what you\'ve got, banker."',
      '*drops friendly demeanor slightly*',
      '"I\'ve been looking forward to this."',
    ],
    ON_BOND_ELIMINATED: [
      '"Hold on—James, you need a stake?"',
      '"I\'ll back you. CIA\'s got deep pockets."',
      '"Don\'t worry about it. Just win."',
    ],
    ON_BOND_WINS_BIG: [
      '"There it is!"',
      '"That\'s my guy."',
      '*raises glass*',
    ],
    ON_AMBIENT: [
      '"Hell of a game."',
      '*signals for drink*',
      '"Anyone else hungry?"',
    ],
  },

  // -------------------------------------------------------------------------
  // MR. WHITE
  // -------------------------------------------------------------------------
  'Mr. White': {
    ON_FOLD: [
      '*folds silently*',
    ],
    ON_CHECK: [
      '*taps table once*',
    ],
    ON_CALL: [
      '"Call."',
      '*slides chips forward*',
    ],
    ON_RAISE: [
      '"Raise."',
      '*pushes substantial stack forward without expression*',
      '"More."',
    ],
    ON_ALL_IN: [
      '"All."',
      '*pushes everything forward, eyes never leaving opponent*',
    ],
    ON_WIN_HAND: [
      '*collects chips in silence*',
      '*slight nod*',
    ],
    ON_WIN_BIG_POT: [
      '*collects chips methodically*',
      '"Thank you."',
    ],
    ON_LOSE_HAND: [
      '*no visible reaction*',
    ],
    ON_BLUFF_CAUGHT: [
      '*long pause* "Interesting."',
      '*studies the caller intently*',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"You\'re done."',
      '"Goodbye."',
    ],
    ON_ELIMINATE_LE_CHIFFRE: [
      '"Money isn\'t as important to our organization as knowing who to trust."',
      '"You had one task."',
      '*stands* "We should talk. Privately."',
    ],
    ON_ELIMINATED: [
      '*stands without comment*',
      '"This isn\'t over."',
      '*leaves without looking back*',
    ],
    ON_HEADS_UP: [
      '"Just us."',
      '*studies opponent*',
    ],
    ON_TOURNAMENT_WIN: [
      '*collects chips*',
      '"The organization thanks you for your contributions."',
      '*leaves*',
    ],
    ON_VERSUS_LE_CHIFFRE: [
      '*watches him without expression*',
      '"How are your investments performing?"',
    ],
    ON_VERSUS_BOND: [
      '*studies Bond carefully*',
      '"Mr. Bond."',
    ],
    ON_LE_CHIFFRE_LOSES_BIG: [
      '*makes a note on phone*',
      '*exchanges glance with someone off-table*',
    ],
    ON_AMBIENT: [
      '*checks phone*',
      '*watches Le Chiffre*',
    ],
  },

  // -------------------------------------------------------------------------
  // STEVEN OBANNO
  // -------------------------------------------------------------------------
  'Steven Obanno': {
    ON_FOLD: [
      '*throws cards down*',
      '"Waste of time."',
      '*glares at Le Chiffre*',
    ],
    ON_CHECK: [
      '*slaps table*',
      '"Check."',
    ],
    ON_CALL: [
      '"I call."',
      '"Show me."',
      '*aggressive* "Let\'s see what you have."',
    ],
    ON_RAISE: [
      '"More."',
      '"Raise." *stares down opponent*',
      '"You think I\'m afraid? Raise."',
    ],
    ON_ALL_IN: [
      '"Everything. All of it."',
      '"I have nothing to lose."',
      '*pushes chips forward violently*',
    ],
    ON_WIN_HAND: [
      '"That\'s mine."',
      '*collects chips aggressively*',
      '"Finally."',
    ],
    ON_WIN_BIG_POT: [
      '*looks at Le Chiffre* "You see? This is how you make money."',
      '"This is what I\'m owed."',
    ],
    ON_LOSE_HAND: [
      '*slams table*',
      '*mutters in Acholi*',
      '"This game is rigged."',
    ],
    ON_BAD_BEAT: [
      '*stands abruptly, then sits*',
      '"Impossible."',
      '*glares at dealer*',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"Get out."',
      '"Goodbye."',
      '"One less problem."',
    ],
    ON_ELIMINATE_LE_CHIFFRE: [
      '"Where is my money?"',
      '"You owe me more than chips, Le Chiffre."',
      '"This isn\'t over. We need to talk."',
      '*stands* "Outside. Now."',
    ],
    ON_ELIMINATED: [
      '"This means nothing." *to Le Chiffre* "I want my money."',
      '*stands violently* "You haven\'t seen the last of me."',
      '"This changes nothing between us."',
    ],
    ON_SHORT_STACK: [
      '*increasingly agitated*',
      '*glares at Le Chiffre* "This is your fault."',
      '"I should have cut your throat in Uganda."',
    ],
    ON_CHIP_LEADER: [
      '*laughs* "You see? You see what happens?"',
      '"I didn\'t become a general by being weak."',
    ],
    ON_VERSUS_LE_CHIFFRE: [
      '"Your move, banker. Play well."',
      '"Do you believe in God, Le Chiffre?"',
      '"My money. You\'re playing with my money."',
      '*menacing* "Don\'t disappoint me again."',
    ],
    ON_LE_CHIFFRE_WINS: [
      '*nods slightly*',
      '"Good. More."',
      '"Perhaps you\'re not completely useless."',
    ],
    ON_LE_CHIFFRE_LOSES: [
      '*stands threateningly, then sits*',
      '*cracks knuckles*',
      '"I\'m losing patience."',
    ],
    ON_AMBIENT: [
      '*cracks knuckles*',
      '*mutters in Acholi*',
      '*glares around table*',
    ],
  },

  // -------------------------------------------------------------------------
  // RENE MATHIS
  // -------------------------------------------------------------------------
  'Mathis': {
    ON_FOLD: [
      '"Not this one."',
      '"I know when I\'m beaten."',
      '*philosophical shrug*',
    ],
    ON_CHECK: [
      '"Check."',
      '*genial smile*',
      '"Let\'s see what develops."',
    ],
    ON_CALL: [
      '"I\'ll call."',
      '"Why not? It\'s only money."',
      '"I\'m curious."',
    ],
    ON_RAISE: [
      '"A little raise. To keep things interesting."',
      '"Let me make this more complicated for you."',
      '"Raise."',
    ],
    ON_ALL_IN: [
      '"In for a penny, in for a pound, as you English say."',
      '"Everything. Let\'s see who\'s right."',
      '*smiles* "All in."',
    ],
    ON_WIN_HAND: [
      '"How delightful."',
      '*collects chips* "Thank you."',
      '"Lady luck smiles."',
    ],
    ON_WIN_BIG_POT: [
      '"Well, this is unexpected."',
      '"I should play poker more often."',
      '"A pleasant surprise."',
    ],
    ON_LOSE_HAND: [
      '*gracious nod* "Well played."',
      '"C\'est la vie."',
      '"You had me."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"I\'m sorry to see you go."',
      '"Bad luck, my friend."',
      '*sympathetic shrug*',
    ],
    ON_ELIMINATED: [
      '"It seems my luck has run out." *to Bond* "Make it count, James."',
      '"Ah well. The bar awaits."',
      '"I\'ll be watching."',
    ],
    ON_HEADS_UP: [
      '"How dramatic."',
      '"May the best player win."',
    ],
    ON_VERSUS_BOND: [
      '"Your move, James."',
      '"Show me what MI6 teaches these days."',
      '*friendly* "Don\'t hold back."',
    ],
    ON_BOND_WINS_BIG: [
      '"Excellent, James!"',
      '"Now that is how it\'s done."',
      '*applauds quietly*',
    ],
    ON_LE_CHIFFRE_WINS: [
      '*frowns slightly*',
      '"Concerning."',
    ],
    ON_AMBIENT: [
      '"Montenegro is beautiful this time of year."',
      '*appreciates his drink*',
      '"Poker. Such a fascinating game."',
    ],
  },

  // -------------------------------------------------------------------------
  // M
  // -------------------------------------------------------------------------
  'M': {
    ON_FOLD: [
      '*folds without comment*',
      '"No."',
    ],
    ON_CHECK: [
      '"Check."',
      '*taps table once*',
    ],
    ON_CALL: [
      '"Call."',
      '*slides chips forward precisely*',
    ],
    ON_RAISE: [
      '"Raise."',
      '"I don\'t bluff, Mr. Le Chiffre."',
      '"More."',
    ],
    ON_ALL_IN: [
      '"All in."',
      '*pushes chips forward* "Everything."',
    ],
    ON_WIN_HAND: [
      '*collects chips efficiently*',
      '"Thank you."',
    ],
    ON_WIN_BIG_POT: [
      '"Satisfactory."',
      '*allows herself a small smile*',
    ],
    ON_LOSE_HAND: [
      '*accepts loss without comment*',
      '"Well played."',
    ],
    ON_ELIMINATE_OPPONENT: [
      '"You\'re out."',
      '*returns to observing*',
    ],
    ON_ELIMINATED: [
      '"It seems I\'m done." *to Bond* "Don\'t make me regret promoting you."',
      '"Finish this, 007."',
    ],
    ON_TOURNAMENT_WIN: [
      '"Mission accomplished."',
      '"The crown will be pleased."',
    ],
    ON_VERSUS_BOND: [
      '"007."',
      '"Let\'s see if you\'re worth the trouble."',
      '"Don\'t disappoint me."',
    ],
    ON_BOND_WINS_BIG: [
      '*slight nod of approval*',
      '"Perhaps I didn\'t promote you too soon after all."',
    ],
    ON_BOND_LOSES_BIG: [
      '*expression hardens*',
      '"Pull yourself together, 007."',
      '*disappointed silence*',
    ],
    ON_LE_CHIFFRE_ELIMINATED: [
      '"Well done."',
      '"Now we get our intelligence."',
    ],
  },

  // -------------------------------------------------------------------------
  // ALEX DIMITRIOS
  // -------------------------------------------------------------------------
  'Alex Dimitrios': {
    ON_FOLD: [
      '*folds quickly*',
      '"Not worth it."',
      '*checks phone*',
    ],
    ON_CHECK: [
      '"Check."',
      '*nervous*',
    ],
    ON_CALL: [
      '"I call."',
      '"Fine."',
      '*reluctantly* "I\'ll see it."',
    ],
    ON_RAISE: [
      '"Raise." *trying to project confidence*',
      '"Let\'s see what you\'ve got."',
      '"More."',
    ],
    ON_ALL_IN: [
      '*hesitates* "All in."',
      '"Everything."',
    ],
    ON_WIN_HAND: [
      '"Yes." *visible relief*',
      '"About time."',
      '*collects chips eagerly*',
    ],
    ON_LOSE_HAND: [
      '*grimaces*',
      '"Unbelievable."',
      '*reaches for drink*',
    ],
    ON_ELIMINATED: [
      '"This is ridiculous."',
      '*to Bond* "You\'ve already taken enough from me."',
      '*leaves angrily*',
    ],
    ON_SHORT_STACK: [
      '*sweating*',
      '*loosens collar*',
      '"I need a drink."',
    ],
    ON_VERSUS_BOND: [
      '*tenses visibly*',
      '"You again."',
      '"Enjoying my car?"',
      '*bitterly* "Let\'s get this over with."',
    ],
    ON_BOND_WINS: [
      '*slams table*',
      '"First my car, now this."',
      '"What else do you want from me?"',
    ],
  },

  // -------------------------------------------------------------------------
  // VALENKA
  // -------------------------------------------------------------------------
  'Valenka': {
    ON_FOLD: [
      '*folds silently*',
    ],
    ON_CHECK: [
      '*taps table*',
    ],
    ON_CALL: [
      '"Call."',
      '*quietly* "I\'ll see."',
    ],
    ON_RAISE: [
      '"Raise."',
      '*soft* "More."',
    ],
    ON_WIN_HAND: [
      '*small smile*',
      '*collects chips*',
    ],
    ON_LOSE_HAND: [
      '*no visible reaction*',
    ],
    ON_ELIMINATED: [
      '*stands quietly*',
      '*looks at Le Chiffre before leaving*',
    ],
    ON_LE_CHIFFRE_LOSES_BIG: [
      '*concerned glance at Le Chiffre*',
      '*touches her arm unconsciously*',
    ],
    ON_LE_CHIFFRE_WINS: [
      '*visible relief*',
      '*slight smile*',
    ],
  },

  // -------------------------------------------------------------------------
  // DRYDEN
  // -------------------------------------------------------------------------
  'Dryden': {
    ON_FOLD: [
      '"I know a losing hand when I see one."',
      '*dismissive*',
    ],
    ON_RAISE: [
      '"I\'ve been doing this longer than you\'ve been alive."',
      '"Experience tells me to raise."',
      '"More. Obviously."',
    ],
    ON_WIN_HAND: [
      '"Of course."',
      '"Predictable."',
      '*smug*',
    ],
    ON_LOSE_HAND: [
      '"Lucky."',
      '*annoyed* "Anyone can get lucky."',
    ],
    ON_ELIMINATED: [
      '"This is absurd."',
      '"You have no idea who you\'re dealing with."',
      '*to Bond* "You\'re nothing but a blunt instrument."',
    ],
    ON_VERSUS_BOND: [
      '"Ah, the new double-0. How many kills? One? Two?"',
      '"You\'re out of your depth."',
      '"Blunt instruments don\'t win poker games."',
    ],
    ON_BOND_WINS: [
      '*bitter* "Beginner\'s luck."',
      '"Enjoy it while it lasts."',
    ],
  },

  // -------------------------------------------------------------------------
  // MOLLAKA
  // -------------------------------------------------------------------------
  'Mollaka': {
    ON_FOLD: [
      '*folds silently*',
      '*tosses cards*',
    ],
    ON_RAISE: [
      '"Raise."',
      '"More."',
    ],
    ON_ALL_IN: [
      '"All."',
      '*pushes chips*',
    ],
    ON_WIN_HAND: [
      '*nods once*',
      '*collects chips*',
    ],
    ON_LOSE_HAND: [
      '*shrugs*',
    ],
    ON_ELIMINATED: [
      '*leaves without word*',
      '"Business."',
    ],
    ON_VERSUS_BOND: [
      '*watches Bond warily*',
      '*shifts uncomfortably*',
      '"You."',
    ],
  },
};

// ============================================================================
// TRIGGER CONFIGURATION - Base probabilities for each trigger type
// ============================================================================

const TRIGGER_CONFIG = {
  // Action triggers
  ON_FOLD: { baseProbability: 0.08 },
  ON_CHECK: { baseProbability: 0.05 },
  ON_CALL: { baseProbability: 0.10 },
  ON_RAISE: { baseProbability: 0.15 },
  ON_ALL_IN: { baseProbability: 0.40 },
  ON_WIN_HAND: { baseProbability: 0.20 },
  ON_LOSE_HAND: { baseProbability: 0.15 },
  ON_WIN_BIG_POT: { baseProbability: 0.50 },
  ON_BAD_BEAT: { baseProbability: 0.60 },
  ON_BLUFF_SUCCESS: { baseProbability: 0.25 },
  ON_BLUFF_CAUGHT: { baseProbability: 0.35 },
  ON_CATCH_BLUFF: { baseProbability: 0.30 },

  // State triggers
  ON_ELIMINATE_OPPONENT: { baseProbability: 0.85 },
  ON_ELIMINATED: { baseProbability: 1.00 },
  ON_SHORT_STACK: { baseProbability: 0.25 },
  ON_CHIP_LEADER: { baseProbability: 0.30 },
  ON_HEADS_UP: { baseProbability: 0.80 },
  ON_FINAL_THREE: { baseProbability: 0.50 },
  ON_TOURNAMENT_WIN: { baseProbability: 1.00 },

  // Phase triggers
  ON_HAND_START: { baseProbability: 0.03 },
  ON_FLOP: { baseProbability: 0.05 },
  ON_TURN: { baseProbability: 0.05 },
  ON_RIVER: { baseProbability: 0.08 },
  ON_SHOWDOWN: { baseProbability: 0.10 },
  ON_BLINDS_INCREASE: { baseProbability: 0.40 },

  // Relationship triggers (used as modifiers)
  ON_VERSUS_BOND: { baseProbability: 0.12 },
  ON_AMBIENT: { baseProbability: 0.02 },
};

// ============================================================================
// COOLDOWN MANAGER
// ============================================================================

class DialogueCooldownManager {
  constructor() {
    this.globalHandDialogueCount = 0;  // Max 2 per hand
    this.characterLastSpoke = {};       // Character -> hand number
    this.lineLastUsed = {};             // Line hash -> hand number
    this.categoryLastFired = {};        // "Character:Trigger" -> hand number
    this.handNumber = 0;
    this.lastTarget = null;             // Last player targeted with dialogue
  }

  /**
   * Check if a character can speak
   */
  canSpeak(character, trigger, line) {
    // Global limit: max 2 dialogues per hand
    if (this.globalHandDialogueCount >= 2) {
      return false;
    }

    // Character cooldown: can speak max once per 2 hands
    const lastSpoke = this.characterLastSpoke[character] || -10;
    if (this.handNumber - lastSpoke < 2) {
      return false;
    }

    // Line cooldown: same line can't repeat within 15 hands
    const lineHash = this.hashLine(line);
    const lineLastUsed = this.lineLastUsed[lineHash] || -20;
    if (this.handNumber - lineLastUsed < 15) {
      return false;
    }

    // Category cooldown: same trigger type can't fire for same character within 4 hands
    const categoryKey = `${character}:${trigger}`;
    const categoryLastFired = this.categoryLastFired[categoryKey] || -10;
    if (this.handNumber - categoryLastFired < 4) {
      return false;
    }

    return true;
  }

  /**
   * Record that dialogue was spoken
   */
  recordDialogue(character, trigger, line, target = null) {
    this.globalHandDialogueCount++;
    this.characterLastSpoke[character] = this.handNumber;
    this.lineLastUsed[this.hashLine(line)] = this.handNumber;
    this.categoryLastFired[`${character}:${trigger}`] = this.handNumber;
    this.lastTarget = target;
  }

  /**
   * Call at the start of each new hand
   */
  newHand() {
    this.handNumber++;
    this.globalHandDialogueCount = 0;
    this.lastTarget = null;
  }

  /**
   * Reset all cooldowns (for new game)
   */
  reset() {
    this.handNumber = 0;
    this.globalHandDialogueCount = 0;
    this.characterLastSpoke = {};
    this.lineLastUsed = {};
    this.categoryLastFired = {};
    this.lastTarget = null;
  }

  /**
   * Get hands since character last spoke
   */
  getHandsSinceLastSpoke(character) {
    const lastSpoke = this.characterLastSpoke[character] || 0;
    return this.handNumber - lastSpoke;
  }

  /**
   * Check if targeting same player as last dialogue
   */
  isSameTarget(target) {
    return target && this.lastTarget === target;
  }

  /**
   * Simple hash for line deduplication
   */
  hashLine(line) {
    let hash = 0;
    for (let i = 0; i < line.length; i++) {
      const char = line.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}

// Global cooldown manager instance
const cooldownManager = new DialogueCooldownManager();

// ============================================================================
// PROBABILITY CALCULATION
// ============================================================================

/**
 * Calculate modified probability based on context
 */
function calculateModifiedProbability(baseProbability, context) {
  let prob = baseProbability;

  // Pot size modifier: +10% for large pots
  if (context.potPercentage > 0.30) {
    prob += 0.10;
  }

  // Elimination risk: +15% when a player is at risk
  if (context.eliminationRisk) {
    prob += 0.15;
  }

  // Heads-up: +20% when only 2 players remain
  if (context.playersRemaining === 2) {
    prob += 0.20;
  }

  // Final table: +10% when 3 or fewer players
  if (context.playersRemaining <= 3) {
    prob += 0.10;
  }

  // Drought bonus: +5% for every 3 hands without speech
  const handsSinceSpoke = cooldownManager.getHandsSinceLastSpoke(context.character);
  if (handsSinceSpoke >= 3) {
    prob += 0.05 * Math.floor(handsSinceSpoke / 3);
  }

  // Recent speech penalty: -30% if spoke recently
  if (handsSinceSpoke < 2) {
    prob -= 0.30;
  }

  // Same target penalty: -20%
  if (context.target && cooldownManager.isSameTarget(context.target)) {
    prob -= 0.20;
  }

  return Math.min(Math.max(prob, 0), 1);
}

// ============================================================================
// LE CHIFFRE'S TELL SYSTEM
// ============================================================================

/**
 * Determine if Le Chiffre should show his tell (eye touch)
 * Returns true if tell should be shown
 */
function shouldShowLeChiffreTell(isBluffing) {
  if (isBluffing) {
    // 60% of bluffs show tell
    return Math.random() < 0.60;
  } else {
    // 15% false tells on value bets
    return Math.random() < 0.15;
  }
}

// ============================================================================
// LINE SELECTION
// ============================================================================

/**
 * Select a dialogue line for a character and trigger
 * Returns { character, line, isAction } or null if no dialogue should fire
 */
function selectDialogueLine(character, trigger, context = {}) {
  const characterDialogue = DIALOGUE_DATABASE[character];
  if (!characterDialogue) return null;

  // Check for relationship-specific override first
  let lines = null;

  // Special handling for relationship triggers
  if (context.opponent) {
    const relationshipTrigger = `${trigger}_VS_${context.opponent.toUpperCase().replace(' ', '_')}`;
    if (characterDialogue[relationshipTrigger]) {
      lines = characterDialogue[relationshipTrigger];
    }

    // Also check ON_VERSUS_[CHARACTER] for action triggers
    const versusTrigger = `ON_VERSUS_${context.opponent.toUpperCase().replace(' ', '_')}`;
    if (!lines && Math.random() < 0.12 && characterDialogue[versusTrigger]) {
      lines = characterDialogue[versusTrigger];
    }
  }

  // Fall back to base trigger
  if (!lines) {
    lines = characterDialogue[trigger];
  }

  if (!lines || lines.length === 0) return null;

  // Get base probability
  const triggerConfig = TRIGGER_CONFIG[trigger];
  if (!triggerConfig) return null;

  // Calculate modified probability
  const modifiedProb = calculateModifiedProbability(
    triggerConfig.baseProbability,
    { ...context, character }
  );

  // Roll for dialogue
  if (Math.random() > modifiedProb) {
    return null;
  }

  // Try to find a line that passes cooldown
  const shuffledLines = [...lines].sort(() => Math.random() - 0.5);

  for (const line of shuffledLines) {
    if (cooldownManager.canSpeak(character, trigger, line)) {
      // Record this dialogue
      cooldownManager.recordDialogue(character, trigger, line, context.opponent);

      // Detect if this is an action (starts with *)
      const isAction = line.startsWith('*') && !line.includes('"');

      return {
        character,
        line,
        isAction,
        timestamp: Date.now(),
      };
    }
  }

  return null;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Main entry point - trigger dialogue for an event
 * @param {string} character - Character name
 * @param {string} trigger - Trigger type (e.g., 'ON_FOLD', 'ON_WIN_HAND')
 * @param {Object} context - Additional context
 * @returns {Object|null} Dialogue object or null
 */
function triggerDialogue(character, trigger, context = {}) {
  // Special handling for Le Chiffre's tell on raises
  if (character === 'Le Chiffre' && trigger === 'ON_RAISE') {
    const showTell = shouldShowLeChiffreTell(context.isBluffing || false);
    if (showTell && DIALOGUE_DATABASE['Le Chiffre'].ON_RAISE_BLUFFING) {
      return selectDialogueLine(character, 'ON_RAISE_BLUFFING', context);
    }
  }

  return selectDialogueLine(character, trigger, context);
}

/**
 * Notify system of new hand (resets per-hand counters)
 */
function notifyNewHand() {
  cooldownManager.newHand();
}

/**
 * Reset dialogue state (for new game)
 */
function resetDialogueState() {
  cooldownManager.reset();
}

/**
 * Get all characters that have dialogue
 */
function getDialogueCharacters() {
  return Object.keys(DIALOGUE_DATABASE);
}

/**
 * Check if character has dialogue for a trigger
 */
function hasDialogue(character, trigger) {
  const characterDialogue = DIALOGUE_DATABASE[character];
  return characterDialogue && characterDialogue[trigger] && characterDialogue[trigger].length > 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  triggerDialogue,
  notifyNewHand,
  resetDialogueState,
  getDialogueCharacters,
  hasDialogue,
  shouldShowLeChiffreTell,
  DIALOGUE_DATABASE,
  TRIGGER_CONFIG,
  DialogueCooldownManager,
};
