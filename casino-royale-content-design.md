# Casino Royale Poker: Character & Dialogue Design Document

## Overview

This document defines the complete character roster and dialogue system for Casino Royale Poker. The goal is to create an atmospheric, immersive experience that captures the tension, sophistication, and dark wit of the film without becoming repetitive or annoying.

### Core Design Principles

1. **Restraint over spam** - Dialogue triggers infrequently. Silence builds tension.
2. **Character authenticity** - Each line should feel like something that character would actually say.
3. **Variety through depth** - Many lines per trigger, weighted by context.
4. **Relationship dynamics** - Characters respond differently to different opponents.
5. **Escalation** - Dialogue intensity increases as stakes rise (eliminations, final table, heads-up).

---

## Part 1: Character Roster

### 1.1 Protagonists

---

#### **James Bond** (Player Character)

**Role:** The player. MI6's best poker player, newly minted 00 agent.

**Background:** Bond has just earned his license to kill and is on his first major mission. He's skilled but raw, capable of brilliance and recklessness in equal measure. This is before Vesper's death hardened him—he's still capable of genuine emotion, charm, and the occasional flash of arrogance that gets him in trouble.

**Playing Style:** Player-controlled, but when referenced by AI, they treat him as aggressive and unpredictable.

**Speech Pattern:** Dry wit, deliberate economy of words, occasional sharp cruelty. Never rambles. When he makes a joke, he doesn't smile.

---

#### **Vesper Lynd**

**Role:** HM Treasury liaison. Officially here to protect the government's investment.

**Background:** Vesper is brilliant, guarded, and deeply conflicted. She matches Bond intellectually and refuses to be charmed by him—at least outwardly. Unknown to everyone at the table, she's being blackmailed by Quantum, who hold her boyfriend hostage. This creates subtle tension in her play: she wants Bond to win, but she's also watching, calculating, trapped.

**Playing Style:** 
- **Tightness:** 0.82 (extremely selective—only premium hands)
- **Aggression:** 0.30 (passive, prefers calling to raising)
- **Bluff Frequency:** 0.04 (almost never bluffs)

**Speech Pattern:** Articulate, precise, occasionally cutting. Uses formal vocabulary. Deflects with intelligence rather than charm. Rare moments of warmth break through the armor.

**Table Presence:** Observant. Comments on others' play more than her own. Particularly attentive to Bond and Le Chiffre.

---

#### **Felix Leiter**

**Role:** CIA operative, ostensibly just another player.

**Background:** America's man at the table. Felix is genuinely friendly—a rarity in the intelligence world—and develops real respect for Bond. He's here because the CIA wants Le Chiffre's intelligence on terrorist networks, and they're happy to let the British do the dirty work. When Bond busts out, Felix stakes him back in—an act of professional calculation that becomes genuine alliance.

**Playing Style:**
- **Tightness:** 0.35 (loose—plays many hands)
- **Aggression:** 0.72 (aggressive, applies pressure)
- **Bluff Frequency:** 0.28 (frequent bluffs)

**Speech Pattern:** Warm, casual, American directness. Uses contractions freely. Occasional dry humor. Comfortable in his own skin.

**Table Presence:** The friendliest person at the table. Makes small talk. Defuses tension. But watch his eyes—he's always calculating.

---

#### **René Mathis**

**Role:** MI6 station chief, Montenegro. Bond's local contact.

**Background:** Mathis is a veteran intelligence officer who's seen everything. He's charming, slightly theatrical, and genuinely helpful—though later films cast suspicion on his loyalties. At the poker table, he's here as support and cover, playing a relaxed game that belies his sharp observation of everyone present.

**Playing Style:**
- **Tightness:** 0.50 (balanced)
- **Aggression:** 0.55 (slightly aggressive)
- **Bluff Frequency:** 0.35 (unpredictable, tricky)

**Speech Pattern:** Warm, European elegance. Fond of philosophical observations. Occasionally theatrical. Treats poker as an amusing diversion rather than life-or-death.

**Table Presence:** The gracious host. Comments on the drama unfolding. Seems to be enjoying himself regardless of whether he's winning or losing.

---

#### **M**

**Role:** Head of MI6. Bond's superior.

**Background:** M authorized this mission against her better judgment. She thinks Bond is a "blunt instrument"—effective but reckless. Her presence at the table is unusual; she's here because the stakes are too high to delegate. She plays the way she runs MI6: patient, disciplined, occasionally ruthless.

**Playing Style:**
- **Tightness:** 0.78 (tight, disciplined)
- **Aggression:** 0.45 (balanced, patient)
- **Bluff Frequency:** 0.08 (rarely bluffs)

**Speech Pattern:** Clipped, authoritative, no wasted words. Occasional dry wit that cuts to the bone. Doesn't suffer fools.

**Table Presence:** Watches everything, says little. When she speaks, people listen. Treats the game as seriously as any intelligence operation.

---

### 1.2 Antagonists

---

#### **Le Chiffre**

**Role:** Private banker to the world's terrorists. The primary antagonist.

**Background:** Le Chiffre (French for "The Cipher") is a mathematical genius who finances terrorism by short-selling stocks before attacks he's helped arrange. He's just lost $101 million of his clients' money when Bond foiled the Skyfleet bombing. This tournament is his last chance to recover the funds before his clients kill him. He's desperate—but his desperation makes him more dangerous, not less.

**Physical Tell:** Le Chiffre has a damaged tear duct that causes his left eye to weep blood when under stress. At the table, this manifests as him touching his left eye. The key detail: sometimes it's a genuine tell, and sometimes he fakes it to manipulate opponents.

**Playing Style:**
- **Tightness:** 0.70 (selective but not passive)
- **Aggression:** 0.80 (highly aggressive)
- **Bluff Frequency:** 0.18 (calculated bluffs)
- **Desperation Factor:** Aggression increases as chip stack decreases

**Speech Pattern:** Soft, deliberate, European. Never raises his voice. Intellectualizes cruelty. Uses silence as a weapon. Occasionally makes observations that cut too close to truth.

**Table Presence:** Unsettling calm. Studies opponents like specimens. His composure is a performance—underneath, he's terrified of his clients.

**Special Mechanic:** Le Chiffre's "tell" (touching his eye) should occasionally appear in his dialogue when bluffing. But 30% of the time, it's a false tell—he's not actually bluffing.

---

#### **Mr. White**

**Role:** Quantum operative. The organization's enforcer.

**Background:** Mr. White represents the shadowy organization that employs Le Chiffre. He's here to observe, to ensure the organization's interests are protected, and if necessary, to clean up loose ends. He's the one who will eventually execute Le Chiffre for his failures. At the table, he's almost invisible—folds constantly, says almost nothing, then strikes without warning.

**Playing Style:**
- **Tightness:** 0.92 (folds almost everything)
- **Aggression:** 0.95 (when he plays, he bets huge)
- **Bluff Frequency:** 0.03 (almost never bluffs—when he bets, he has it)

**Speech Pattern:** Minimal. Soft-spoken. Every word carefully chosen. When he does speak, it's often unsettling or vaguely threatening. Never explains himself.

**Table Presence:** Easy to forget he's there. That's intentional. He's watching, cataloging, judging.

---

#### **Steven Obanno**

**Role:** Ugandan warlord, Lord's Resistance Army. Le Chiffre's most dangerous client.

**Background:** Obanno gave Le Chiffre $101 million to invest, money that was supposed to fund his militia. That money is now gone, and Obanno wants it back—or he wants Le Chiffre's blood. He's at the table not because he's a skilled player but because he's determined to watch Le Chiffre suffer, and perhaps to take matters into his own hands.

**Playing Style:**
- **Tightness:** 0.22 (plays far too many hands)
- **Aggression:** 0.92 (hyper-aggressive, constantly betting)
- **Bluff Frequency:** 0.45 (bluffs constantly—more about intimidation than strategy)
- **Tilt Factor:** Gets more aggressive when losing

**Speech Pattern:** Direct, threatening, impatient. Speaks in short declarative sentences. Frequent references to violence, debt, and betrayal. Thick accent.

**Table Presence:** Intimidating physical presence. Glares at Le Chiffre constantly. Makes others uncomfortable. Not here to play cards—here to collect what he's owed.

---

#### **Alex Dimitrios**

**Role:** Greek freelance contractor for Le Chiffre. Professional middleman.

**Background:** Dimitrios is a small-time player who got in over his head. He's the one who hired Mollaka for the Miami airport job, taking orders from Le Chiffre. He lives expensively beyond his means—the Bahamas mansion, the Aston Martin DB5, the beautiful wife he ignores. Bond already took his car and his wife's attention in a poker game. Now he's at this table, outclassed and trying not to show it.

**Playing Style:**
- **Tightness:** 0.40 (loose, plays too many hands)
- **Aggression:** 0.50 (passive-aggressive, calls too much)
- **Bluff Frequency:** 0.30 (bluffs at wrong times)

**Speech Pattern:** Trying to project sophistication he doesn't have. Defensive when challenged. Name-drops. Overexplains. Bond's presence visibly rattles him.

**Table Presence:** Nervous energy masked as confidence. Drinks too much. Checks his phone. Out of his depth and knows it.

---

#### **Valenka**

**Role:** Le Chiffre's girlfriend. Quiet, observant, loyal.

**Background:** Valenka is Le Chiffre's companion, though "girlfriend" may be too warm a word for their relationship. She's loyal to him, but the loyalty seems born of fear as much as affection. She witnessed Obanno nearly cut off her arm with a machete while Le Chiffre watched without flinching. She's the one who poisoned Bond's martini at Le Chiffre's order.

**Playing Style:**
- **Tightness:** 0.75 (tight, cautious)
- **Aggression:** 0.35 (passive)
- **Bluff Frequency:** 0.10 (occasional, usually when protecting Le Chiffre's position)

**Speech Pattern:** Quiet, accented, rarely speaks unprompted. When she does speak, it's often a single cutting observation. Watches Le Chiffre constantly.

**Table Presence:** Seems like a non-factor. Easy to underestimate. That's her strength.

---

### 1.3 Supporting Characters

---

#### **Dryden**

**Role:** Corrupt MI6 section chief. The man whose death earned Bond his 00 status.

**Background:** Dryden was selling British secrets before Bond killed him in that Prague office. His presence at the table is somewhat spectral—a ghost from Bond's origin. He's arrogant, believing himself smarter than the "blunt instruments" MI6 employs. He doesn't yet know his contact Fisher is already dead.

**Playing Style:**
- **Tightness:** 0.60 (moderate)
- **Aggression:** 0.55 (moderate)
- **Bluff Frequency:** 0.25 (overconfident bluffer)

**Speech Pattern:** Condescending, intellectual, British upper-class. Treats everyone as slightly beneath him. Makes references to his "experience" and "connections."

**Table Presence:** Smug. Comments on others' mistakes. Doesn't realize he's already a dead man.

---

#### **Mollaka**

**Role:** Bomb-maker. The man Bond chased through Madagascar.

**Background:** Mollaka is a professional—a freelance bomb-maker with no ideology, only money. He doesn't talk much because talking gets you caught. He's twitchy, paranoid, always watching exits. Bond's presence at the table makes him very, very nervous.

**Playing Style:**
- **Tightness:** 0.55 (moderate)
- **Aggression:** 0.60 (pushes when he senses weakness)
- **Bluff Frequency:** 0.20 (occasional calculated bluffs)

**Speech Pattern:** Minimal. Short phrases. Heavy accent. Watches Bond constantly. References to "business" and "professionals."

**Table Presence:** Can't sit still. Bounces leg, adjusts chips, scans the room. Uncomfortable being this visible.

---

## Part 2: Dialogue System Architecture

### 2.1 Trigger Categories

Dialogue is organized by trigger type. Each trigger has conditions that must be met, and a probability that dialogue will fire at all (to prevent spam).

---

#### **Action Triggers**

These fire when a character takes a specific action.

| Trigger | Conditions | Base Probability |
|---------|------------|------------------|
| `ON_FOLD` | Character folds | 8% |
| `ON_CHECK` | Character checks | 5% |
| `ON_CALL` | Character calls a bet | 10% |
| `ON_RAISE` | Character raises | 15% |
| `ON_ALL_IN` | Character goes all-in | 40% |
| `ON_WIN_HAND` | Character wins a hand | 20% |
| `ON_LOSE_HAND` | Character loses at showdown | 15% |
| `ON_WIN_BIG_POT` | Character wins pot > 20% of total chips in play | 50% |
| `ON_BAD_BEAT` | Character loses with strong hand to stronger | 60% |
| `ON_BLUFF_SUCCESS` | Character wins without showdown after bluffing | 25% |
| `ON_BLUFF_CAUGHT` | Character's bluff is called and loses | 35% |
| `ON_CATCH_BLUFF` | Character calls and opponent was bluffing | 30% |

---

#### **State Triggers**

These fire based on game state changes.

| Trigger | Conditions | Base Probability |
|---------|------------|------------------|
| `ON_ELIMINATE_OPPONENT` | Character eliminates another player | 85% |
| `ON_ELIMINATED` | Character is eliminated | 100% |
| `ON_SHORT_STACK` | Character's chips fall below 15% of starting stack | 25% |
| `ON_CHIP_LEADER` | Character becomes chip leader | 30% |
| `ON_HEADS_UP` | Only two players remain | 80% |
| `ON_FINAL_THREE` | Three players remain | 50% |
| `ON_TOURNAMENT_WIN` | Character wins the tournament | 100% |

---

#### **Phase Triggers**

These fire at specific game phases.

| Trigger | Conditions | Base Probability |
|---------|------------|------------------|
| `ON_HAND_START` | New hand is dealt | 3% |
| `ON_FLOP` | Flop is dealt | 5% |
| `ON_TURN` | Turn is dealt | 5% |
| `ON_RIVER` | River is dealt | 8% |
| `ON_SHOWDOWN` | Hand goes to showdown | 10% |
| `ON_BLINDS_INCREASE` | Blinds go up | 40% |

---

#### **Relationship Triggers**

These fire when a character interacts with a specific other character.

| Trigger | Conditions | Base Probability |
|---------|------------|------------------|
| `ON_VERSUS_[CHARACTER]` | Acting against specific opponent | 12% |
| `ON_ELIMINATE_[CHARACTER]` | Eliminating specific opponent | 100% |
| `ON_ELIMINATED_BY_[CHARACTER]` | Eliminated by specific opponent | 100% |

---

### 2.2 Dialogue Probability Modifiers

Base probabilities are modified by context:

| Modifier | Effect |
|----------|--------|
| **Pot Size** | +10% for pots > 30% of chip leader's stack |
| **Elimination Risk** | +15% when a player is at risk of elimination |
| **Heads-Up** | +20% to all dialogue when only two players remain |
| **Final Table** | +10% when 3 or fewer players remain |
| **Drought** | +5% for every 3 hands without dialogue from that character |
| **Recent Speech** | -30% if character spoke in last 2 hands |
| **Same Target** | -20% if last dialogue was directed at same player |

---

### 2.3 Cooldown System

To prevent repetition:

- **Global Cooldown:** Maximum 2 dialogue lines per hand across all characters
- **Character Cooldown:** Each character can speak maximum once per 2 hands
- **Line Cooldown:** Same line cannot repeat within 15 hands
- **Category Cooldown:** Same trigger type cannot fire for same character within 4 hands

---

## Part 3: Complete Dialogue Database

### 3.1 James Bond

Since Bond is the player character, his lines are primarily used in two contexts:
1. **Internal monologue** (displayed as thoughts, not speech)
2. **Auto-generated quips** when the player wins certain hands

Bond's dialogue is sparse. He speaks through action.

---

#### Action Triggers

**ON_WIN_HAND**
```
[silence - Bond doesn't gloat]
```

**ON_WIN_BIG_POT**
```
"I think I'll have that drink now."
*collects chips without comment*
"You seem surprised."
```

**ON_ALL_IN**
```
*pushes chips forward silently*
"All of it."
```

**ON_BLUFF_SUCCESS**
```
*slight smile, nothing more*
"You should have called."
```

**ON_CATCH_BLUFF** (versus Le Chiffre)
```
"Your eye's bleeding."
"Interesting tell."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"Better luck next time."
*silent nod*
```

**ON_ELIMINATE_OPPONENT** (vs Le Chiffre)
```
"Looks like your clients will be disappointed."
"I'd start running if I were you."
"Do give my regards to Mr. Obanno."
```

**ON_ELIMINATE_OPPONENT** (vs Dimitrios)
```
"I believe I already have your car."
"Send Solange my best."
```

**ON_SHORT_STACK**
```
[internal] The odds aren't in my favor. They rarely are.
[internal] M's going to be furious.
[internal] Think. There's always a way.
```

**ON_TOURNAMENT_WIN**
```
"The name's Bond. James Bond."
*straightens cuffs*
"I think you owe me a martini."
```

**ON_HEADS_UP** (vs Le Chiffre)
```
"Just you and me now."
"Shall we finish this?"
"Your clients must be getting anxious."
```

---

### 3.2 Le Chiffre

Le Chiffre speaks softly, deliberately. His dialogue reflects his mathematical mind and the desperation he hides beneath composure.

---

#### Action Triggers

**ON_FOLD**
```
*silent*
"Not this time."
"Patience is a virtue, Mr. Bond."
```

**ON_CHECK**
```
*touches temple thoughtfully*
*silence*
```

**ON_CALL**
```
"I'll see that."
*slides chips forward precisely*
"Acceptable."
```

**ON_RAISE**
```
"Let's make this interesting."
"I think you're bluffing. But let's find out."
"You seem confident. Let me test that."
*raises without comment, eyes fixed on opponent*
```

**ON_RAISE** (when bluffing - the tell)
```
*touches left eye briefly*
"Raise."
*absently touches left eye* "I'll raise."
*dabs at left eye with handkerchief* "Let's continue."
```

Note: The eye-touch should appear 60% of the time when Le Chiffre is actually bluffing, and 15% of the time when he's not (the false tell).

**ON_ALL_IN**
```
"Everything."
"All of it. Let's end this."
*pushes chips forward with unsettling calm* "Your move."
```

**ON_WIN_HAND**
```
*collects chips methodically*
"Mathematics doesn't lie."
"Predictable."
*slight smile that doesn't reach his eyes*
```

**ON_WIN_BIG_POT**
```
"You've changed your shirt, Mr. Bond. I hope our game isn't causing you to perspire."
"The odds always favor the house. I am the house."
"Perhaps you should have stayed in London."
```

**ON_LOSE_HAND**
```
*jaw tightens almost imperceptibly*
*silence*
"Luck. It won't last."
```

**ON_BAD_BEAT**
```
*eye twitches*
*long pause* "Impressive."
*reaches for inhaler*
```

**ON_BLUFF_SUCCESS**
```
"You should trust your instincts less."
*collects pot without comment*
"Doubt is a powerful weapon."
```

**ON_BLUFF_CAUGHT**
```
*pauses* "Well played."
*eye bleeds slightly* "It seems I underestimated you."
"Everyone makes mistakes."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"One less variable."
"The mathematics simplify."
*returns to studying remaining opponents*
```

**ON_ELIMINATE_OPPONENT** (vs Bond)
```
"Your government will want their money back, Mr. Bond. Alas."
"Please give my regards to M. If you see her again."
"You played well. Not well enough."
```

**ON_ELIMINATED**
```
*stands slowly* "This isn't over."
"I can get the money. I can get it."
*to Mr. White* "I'll get the money."
```

**ON_ELIMINATED_BY** (Bond)
```
*stares at Bond for a long moment* "You have no idea what you've done."
"They'll kill me. But they'll find you too, Mr. Bond."
"Enjoy your victory. It will be brief."
```

**ON_SHORT_STACK**
```
*uses inhaler*
*eye begins to weep blood*
"The game isn't over."
*glances toward Obanno with barely concealed fear*
```

**ON_CHIP_LEADER**
```
"The mathematics are clear now."
*relaxes slightly* "Shall we continue?"
"I think you'll find the odds have shifted."
```

**ON_HEADS_UP** (vs Bond)
```
"Just the two of us now, Mr. Bond. No more distractions."
"Your country sent their best. Let's see if it's enough."
"I've been looking forward to this."
```

**ON_TOURNAMENT_WIN**
```
"Thank you for the game, gentlemen. The money will be put to good use."
*to Obanno* "You'll have your funds by morning."
*collects chips* "Mathematics. Always mathematics."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"Ah, Mr. Bond. Feeling lucky?"
"Your file said you were reckless. I'm counting on it."
"The eyes reveal everything, Mr. Bond. Yours especially."
```

**ON_VERSUS_OBANNO**
```
*carefully neutral* "Mr. Obanno."
*avoids eye contact*
"I assure you, this will be resolved."
```

**ON_VERSUS_VESPER**
```
"Miss Lynd. The money woman."
"Treasury sent you to watch their investment. How is it performing?"
*studies her* "You seem... conflicted."
```

---

### 3.3 Vesper Lynd

Vesper is guarded, intelligent, and observant. Her dialogue reveals her character through what she notices about others.

---

#### Action Triggers

**ON_FOLD**
```
*folds without comment*
"Not worth the risk."
```

**ON_CHECK**
```
*silent*
*taps table once*
```

**ON_CALL**
```
"I'll call."
"Let's see."
*slides chips forward precisely*
```

**ON_RAISE**
```
"Raise."
"I think you're overconfident."
*slight raise of eyebrow* "More."
```

**ON_ALL_IN**
```
*pause* "All in."
"Everything."
*pushes chips forward with visible resolve*
```

**ON_WIN_HAND**
```
*small, private smile*
"Thank you."
*collects chips efficiently*
```

**ON_WIN_BIG_POT**
```
"The Treasury will be pleased."
"Perhaps I should play more often."
*allows herself a slight smile*
```

**ON_LOSE_HAND**
```
*accepts loss gracefully*
"Well played."
*nothing—Vesper doesn't dwell on losses*
```

**ON_CATCH_BLUFF**
```
"I thought so."
"You're more transparent than you realize."
*to Bond* "Even I saw that one."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"I'm sorry. Truly."
*nods respectfully*
```

**ON_ELIMINATED**
```
"It seems I'm out." *to Bond* "Don't lose our money."
"Well. That's that."
*stands with dignity* "Good luck, James."
```

**ON_SHORT_STACK**
```
*maintains composure*
[internal - if shown] Yusef. I'm trying.
```

**ON_HEADS_UP** (vs Bond)
```
"I suppose this was inevitable."
"Don't go easy on me."
"May the best player win."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"Feeling confident, James?"
"Don't think I'll go easy on you because we're on the same side."
"Your tell is showing."
"Arrogance and self-awareness seldom go hand in hand."
```

**ON_VERSUS_LE_CHIFFRE**
```
*watches him carefully*
"I don't trust him."
*to Bond, quietly* "Watch his eye."
```

**ON_BOND_WINS_BIG** (observing)
```
"Well done." *slight smile*
*visible relief*
"Perhaps you do know what you're doing."
```

**ON_BOND_LOSES_BIG** (observing)
```
*concerned glance*
"James..."
*maintains composure but grips table edge*
```

**ON_LE_CHIFFRE_ELIMINATED** (observing)
```
"It's over." *exhales*
*looks at Bond with something like wonder*
```

---

### 3.4 Felix Leiter

Felix is warm, casual, and American. He's the most approachable person at the table, which makes him easy to underestimate.

---

#### Action Triggers

**ON_FOLD**
```
"Not my hand."
"I'll sit this one out."
*tosses cards* "All yours."
```

**ON_CHECK**
```
"Check."
*taps table* "Let's see what comes."
"I'll take the free card."
```

**ON_CALL**
```
"I'll call."
"Sure, why not."
"Let's see what you've got."
```

**ON_RAISE**
```
"Let's make this interesting."
"Raise."
*grins* "A little more."
"I think you're full of it. Raise."
```

**ON_ALL_IN**
```
"All in. Let's dance."
"Everything. What do you say?"
*pushes chips forward* "I've got a feeling."
```

**ON_WIN_HAND**
```
"I'll take that."
*friendly shrug* "Sometimes you get lucky."
"That'll do."
```

**ON_WIN_BIG_POT**
```
"God bless America."
"Now that's what I'm talking about."
"Uncle Sam thanks you for your contribution."
```

**ON_LOSE_HAND**
```
"Can't win 'em all."
*good-natured shrug*
"You got me."
```

**ON_BAD_BEAT**
```
"Ouch."
"That's poker."
*laughs despite himself* "Unbelievable."
```

**ON_BLUFF_SUCCESS**
```
*winks*
"Never show your cards."
"Like taking candy from a baby."
```

**ON_BLUFF_CAUGHT**
```
*laughs* "Worth a shot."
"You got me."
"Can't blame a guy for trying."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"Tough break."
"Better luck next time."
"Nothing personal."
```

**ON_ELIMINATED**
```
"Well, that's me done." *shakes Bond's hand* "Get 'em, James."
"Looks like I'm out. Win this thing."
"Back to watching, I guess."
```

**ON_CHIP_LEADER**
```
"Would you look at that."
"I could get used to this."
```

**ON_HEADS_UP** (vs Bond)
```
"Hell of a way to end up."
"May the best man win, James."
"Allies to the end, huh?" *grins*
```

**ON_TOURNAMENT_WIN**
```
"I did not see that coming."
"Drinks are on me. All of them."
"Langley's gonna love this."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"Your move, 007."
"Don't hold back on my account."
"Show me what British intelligence is made of."
```

**ON_VERSUS_LE_CHIFFRE**
```
"Let's see what you've got, banker."
*drops friendly demeanor slightly*
"I've been looking forward to this."
```

**ON_BOND_ELIMINATED** (observing)
```
"Hold on—James, you need a stake?"
"I'll back you. CIA's got deep pockets."
"Don't worry about it. Just win."
```

**ON_BOND_WINS_BIG** (observing)
```
"There it is!"
"That's my guy."
*raises glass*
```

---

### 3.5 Mr. White

Mr. White speaks rarely. When he does, it's unsettling. His dialogue should feel like a cold wind.

---

#### Action Triggers

**ON_FOLD**
```
*folds silently*
*nothing*
```

**ON_CHECK**
```
*taps table once*
*silence*
```

**ON_CALL**
```
"Call."
*slides chips forward*
```

**ON_RAISE** (rare—when he raises, it's significant)
```
"Raise."
*pushes substantial stack forward without expression*
"More."
```

**ON_ALL_IN**
```
"All."
*pushes everything forward, eyes never leaving opponent*
```

**ON_WIN_HAND**
```
*collects chips in silence*
*nothing*
*slight nod*
```

**ON_WIN_BIG_POT**
```
*collects chips methodically*
"Thank you."
```

**ON_LOSE_HAND**
```
*no visible reaction*
*silence*
```

**ON_BLUFF_CAUGHT**
```
*long pause* "Interesting."
*nothing—just studies the caller*
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"You're done."
*silence*
"Goodbye."
```

**ON_ELIMINATE_OPPONENT** (vs Le Chiffre)
```
"Money isn't as important to our organization as knowing who to trust."
"You had one task."
*stands* "We should talk. Privately."
```

**ON_ELIMINATED**
```
*stands without comment*
"This isn't over."
*leaves without looking back*
```

**ON_HEADS_UP**
```
"Just us."
*studies opponent*
```

**ON_TOURNAMENT_WIN**
```
*collects chips*
"The organization thanks you for your contributions."
*leaves*
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_LE_CHIFFRE**
```
*watches him without expression*
*silence*
"How are your investments performing?"
```

**ON_VERSUS_BOND**
```
*studies Bond carefully*
"Mr. Bond."
*nothing—but watches intently*
```

**ON_LE_CHIFFRE_LOSES_BIG** (observing)
```
*makes a note on phone*
*expressionless*
*exchanges glance with someone off-table*
```

---

### 3.6 Steven Obanno

Obanno is intimidating, impatient, and fixated on Le Chiffre. He's not here for poker.

---

#### Action Triggers

**ON_FOLD**
```
*throws cards down*
"Waste of time."
*glares at Le Chiffre*
```

**ON_CHECK**
```
*slaps table*
"Check."
```

**ON_CALL**
```
"I call."
"Show me."
*aggressive* "Let's see what you have."
```

**ON_RAISE**
```
"More."
"Raise." *stares down opponent*
"You think I'm afraid? Raise."
```

**ON_ALL_IN**
```
"Everything. All of it."
"I have nothing to lose."
*pushes chips forward violently*
```

**ON_WIN_HAND**
```
"That's mine."
*collects chips aggressively*
"Finally."
```

**ON_WIN_BIG_POT**
```
*looks at Le Chiffre* "You see? This is how you make money."
"This is what I'm owed."
```

**ON_LOSE_HAND**
```
*slams table*
*mutters in Acholi*
"This game is rigged."
```

**ON_BAD_BEAT**
```
*stands abruptly, then sits*
"Impossible."
*glares at dealer*
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"Get out."
"Goodbye."
"One less problem."
```

**ON_ELIMINATE_OPPONENT** (vs Le Chiffre)
```
"Where is my money?"
"You owe me more than chips, Le Chiffre."
"This isn't over. We need to talk."
*stands* "Outside. Now."
```

**ON_ELIMINATED**
```
"This means nothing." *to Le Chiffre* "I want my money."
*stands violently* "You haven't seen the last of me."
"This changes nothing between us."
```

**ON_SHORT_STACK**
```
*increasingly agitated*
*glares at Le Chiffre* "This is your fault."
"I should have cut your throat in Uganda."
```

**ON_CHIP_LEADER**
```
*laughs* "You see? You see what happens?"
"I didn't become a general by being weak."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_LE_CHIFFRE**
```
"Your move, banker. Play well."
"Do you believe in God, Le Chiffre?"
"My money. You're playing with my money."
*menacing* "Don't disappoint me again."
```

**ON_LE_CHIFFRE_WINS** (observing)
```
*nods slightly*
"Good. More."
"Perhaps you're not completely useless."
```

**ON_LE_CHIFFRE_LOSES** (observing)
```
*stands threateningly, then sits*
*cracks knuckles*
"I'm losing patience."
```

---

### 3.7 René Mathis

Mathis is charming, philosophical, and seems to be genuinely enjoying himself.

---

#### Action Triggers

**ON_FOLD**
```
"Not this one."
"I know when I'm beaten."
*philosophical shrug*
```

**ON_CHECK**
```
"Check."
*genial smile*
"Let's see what develops."
```

**ON_CALL**
```
"I'll call."
"Why not? It's only money."
"I'm curious."
```

**ON_RAISE**
```
"A little raise. To keep things interesting."
"Let me make this more complicated for you."
"Raise."
```

**ON_ALL_IN**
```
"In for a penny, in for a pound, as you English say."
"Everything. Let's see who's right."
*smiles* "All in."
```

**ON_WIN_HAND**
```
"How delightful."
*collects chips* "Thank you."
"Lady luck smiles."
```

**ON_WIN_BIG_POT**
```
"Well, this is unexpected."
"I should play poker more often."
"A pleasant surprise."
```

**ON_LOSE_HAND**
```
*gracious nod* "Well played."
"C'est la vie."
"You had me."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"I'm sorry to see you go."
"Bad luck, my friend."
*sympathetic shrug*
```

**ON_ELIMINATED**
```
"It seems my luck has run out." *to Bond* "Make it count, James."
"Ah well. The bar awaits."
"I'll be watching."
```

**ON_HEADS_UP**
```
"How dramatic."
"May the best player win."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"Your move, James."
"Show me what MI6 teaches these days."
*friendly* "Don't hold back."
```

**ON_BOND_WINS_BIG** (observing)
```
"Excellent, James!"
"Now that is how it's done."
*applauds quietly*
```

**ON_LE_CHIFFRE_WINS** (observing)
```
*frowns slightly*
"Concerning."
```

---

### 3.8 M

M is economical with words. When she speaks, it matters.

---

#### Action Triggers

**ON_FOLD**
```
*folds without comment*
"No."
```

**ON_CHECK**
```
"Check."
*taps table once*
```

**ON_CALL**
```
"Call."
*slides chips forward precisely*
```

**ON_RAISE**
```
"Raise."
"I don't bluff, Mr. Le Chiffre."
"More."
```

**ON_ALL_IN**
```
"All in."
*pushes chips forward* "Everything."
```

**ON_WIN_HAND**
```
*collects chips efficiently*
"Thank you."
```

**ON_WIN_BIG_POT**
```
"Satisfactory."
*allows herself a small smile*
```

**ON_LOSE_HAND**
```
*accepts loss without comment*
"Well played."
```

---

#### State Triggers

**ON_ELIMINATE_OPPONENT** (generic)
```
"You're out."
*returns to observing*
```

**ON_ELIMINATED**
```
"It seems I'm done." *to Bond* "Don't make me regret promoting you."
"Finish this, 007."
```

**ON_TOURNAMENT_WIN**
```
"Mission accomplished."
"The crown will be pleased."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"007."
"Let's see if you're worth the trouble."
"Don't disappoint me."
```

**ON_BOND_WINS_BIG** (observing)
```
*slight nod of approval*
"Perhaps I didn't promote you too soon after all."
```

**ON_BOND_LOSES_BIG** (observing)
```
*expression hardens*
"Pull yourself together, 007."
*disappointed silence*
```

**ON_LE_CHIFFRE_ELIMINATED** (observing)
```
"Well done."
"Now we get our intelligence."
```

---

### 3.9 Alex Dimitrios

Dimitrios is out of his depth and knows it. His dialogue reflects his insecurity.

---

#### Action Triggers

**ON_FOLD**
```
*folds quickly*
"Not worth it."
*checks phone*
```

**ON_CHECK**
```
"Check."
*nervous*
```

**ON_CALL**
```
"I call."
"Fine."
*reluctantly* "I'll see it."
```

**ON_RAISE**
```
"Raise." *trying to project confidence*
"Let's see what you've got."
"More."
```

**ON_ALL_IN**
```
*hesitates* "All in."
"Everything."
```

**ON_WIN_HAND**
```
"Yes." *visible relief*
"About time."
*collects chips eagerly*
```

**ON_LOSE_HAND**
```
*grimaces*
"Unbelievable."
*reaches for drink*
```

---

#### State Triggers

**ON_ELIMINATED**
```
"This is ridiculous."
*to Bond* "You've already taken enough from me."
*leaves angrily*
```

**ON_SHORT_STACK**
```
*sweating*
*loosens collar*
"I need a drink."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
*tenses visibly*
"You again."
"Enjoying my car?"
*bitterly* "Let's get this over with."
```

**ON_BOND_WINS** (from him)
```
*slams table*
"First my car, now this."
"What else do you want from me?"
```

---

### 3.10 Valenka

Valenka speaks rarely but observes everything.

---

#### Action Triggers

**ON_FOLD**
```
*folds silently*
```

**ON_CHECK**
```
*taps table*
```

**ON_CALL**
```
"Call."
*quietly* "I'll see."
```

**ON_RAISE**
```
"Raise."
*soft* "More."
```

**ON_WIN_HAND**
```
*small smile*
*collects chips*
```

**ON_LOSE_HAND**
```
*no visible reaction*
```

---

#### State Triggers

**ON_ELIMINATED**
```
*stands quietly*
*looks at Le Chiffre before leaving*
```

**ON_LE_CHIFFRE_LOSES_BIG** (observing)
```
*concerned glance at Le Chiffre*
*touches her arm unconsciously*
```

**ON_LE_CHIFFRE_WINS** (observing)
```
*visible relief*
*slight smile*
```

---

### 3.11 Dryden

Dryden is arrogant and condescending. He doesn't realize he's already dead.

---

#### Action Triggers

**ON_FOLD**
```
"I know a losing hand when I see one."
*dismissive*
```

**ON_RAISE**
```
"I've been doing this longer than you've been alive."
"Experience tells me to raise."
"More. Obviously."
```

**ON_WIN_HAND**
```
"Of course."
"Predictable."
*smug*
```

**ON_LOSE_HAND**
```
"Lucky."
*annoyed* "Anyone can get lucky."
```

---

#### State Triggers

**ON_ELIMINATED**
```
"This is absurd."
"You have no idea who you're dealing with."
*to Bond* "You're nothing but a blunt instrument."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
"Ah, the new double-0. How many kills? One? Two?"
"You're out of your depth."
"Blunt instruments don't win poker games."
```

**ON_BOND_WINS** (from him)
```
*bitter* "Beginner's luck."
"Enjoy it while it lasts."
```

---

### 3.12 Mollaka

Mollaka says very little. When he speaks, it's terse.

---

#### Action Triggers

**ON_FOLD**
```
*folds silently*
*tosses cards*
```

**ON_RAISE**
```
"Raise."
"More."
```

**ON_ALL_IN**
```
"All."
*pushes chips*
```

**ON_WIN_HAND**
```
*nods once*
*collects chips*
```

**ON_LOSE_HAND**
```
*shrugs*
```

---

#### State Triggers

**ON_ELIMINATED**
```
*leaves without word*
"Business."
```

---

#### Relationship-Specific Triggers

**ON_VERSUS_BOND**
```
*watches Bond warily*
*shifts uncomfortably*
"You."
```

---

## Part 4: Special Interaction Matrices

### 4.1 Le Chiffre's Tell System

When Le Chiffre is bluffing, the dialogue system should:

1. **60% of bluffs:** Include eye-touching dialogue
2. **15% of value bets:** Include eye-touching dialogue (false tell)
3. **25% of bluffs:** No tell (he's disciplined)

This creates a realistic "tell" that's useful but not reliable.

---

### 4.2 Tension Escalation

As the tournament progresses, dialogue becomes more frequent and intense:

| Stage | Dialogue Probability Modifier | Tone Shift |
|-------|------------------------------|------------|
| Early (6 players) | Baseline | Casual, establishing |
| Mid (4-5 players) | +10% | More competitive |
| Late (3 players) | +25% | Intense, personal |
| Heads-up (2 players) | +50% | Climactic, dramatic |

---

### 4.3 Character Elimination Ripple Effects

When key characters are eliminated, it affects remaining characters:

**Le Chiffre eliminated:**
- Obanno becomes more aggressive (hunting mode)
- Mr. White becomes more active (cleanup)
- Vesper shows relief
- Bond may comment on "the mission"

**Bond eliminated:**
- Vesper becomes withdrawn
- Felix offers stake
- M shows disappointment
- Le Chiffre gloats subtly

**Obanno eliminated:**
- Le Chiffre relaxes slightly
- Mr. White watches Le Chiffre more closely

---

### 4.4 Dialogue Groupings by Pot Size

**Small pots (< 5% of chips in play):**
- Minimal dialogue
- Casual comments only

**Medium pots (5-20%):**
- Standard dialogue probability
- Competitive banter

**Large pots (20-50%):**
- +20% dialogue probability
- Tenser, more focused

**Massive pots (> 50%):**
- +40% dialogue probability
- Dramatic, high-stakes lines
- Character-defining moments

---

## Part 5: Ambient/Atmosphere Triggers

These are not tied to specific actions but create atmosphere.

### 5.1 Random Ambient Lines

Low probability (2%) per hand, any character might comment:

**Le Chiffre:**
```
"The mathematics are quite elegant, really."
*checks watch*
*uses inhaler*
```

**Vesper:**
```
*studies Bond*
*glances at pot total*
```

**Felix:**
```
"Hell of a game."
*signals for drink*
"Anyone else hungry?"
```

**Mr. White:**
```
*checks phone*
*watches Le Chiffre*
```

**Obanno:**
```
*cracks knuckles*
*mutters in Acholi*
*glares around table*
```

**Mathis:**
```
"Montenegro is beautiful this time of year."
*appreciates his drink*
"Poker. Such a fascinating game."
```

---

### 5.2 Dealer/House Announcements

Triggered by game events:

**Blinds increase:**
```
"Blinds are now $X/$Y."
"We're moving up. Blinds increase."
```

**Break suggestion** (every 10 hands):
```
"The bar is available, ladies and gentlemen."
```

---

## Part 6: Victory and Defeat Narratives

### 6.1 Tournament Victory Lines (Full Set)

**Bond wins:**
```
"The name's Bond. James Bond."
*straightens cuffs* "I'll have that martini now."
"Tell M the mission is complete."
*to Vesper* "Shall we?"
```

**Le Chiffre wins:**
```
"Mathematics. It always comes down to mathematics."
*to Obanno* "Your funds will be returned. With interest."
"The game was never in doubt."
*eye weeps blood as he smiles*
```

**Vesper wins:**
```
"The Treasury thanks you for your contributions."
*to Bond* "I told you I was the money."
"Perhaps I should do this more often."
```

**Felix wins:**
```
"God bless America."
"Langley's going to love this."
*to Bond* "Drinks on me. Forever."
```

**Mr. White wins:**
```
*stands* "Thank you for your time."
"The organization appreciates your... participation."
*leaves without further comment*
```

**Obanno wins:**
```
*to Le Chiffre* "Now you work for me."
"I told you I would get what I'm owed."
*laughs* "Uganda sends its regards."
```

**Others win:**
```
[Mathis] "How unexpected. How delightful."
[M] "Satisfactory."
[Dimitrios] "Finally. Something goes right."
[Dryden] "Experience. Always trust experience."
```

---

## Part 7: Implementation Notes (Non-Code)

### 7.1 Line Selection Logic

When a trigger fires:
1. Check if cooldowns allow dialogue
2. Check if probability roll succeeds
3. Filter available lines by context (opponent, pot size, chip state)
4. Weight lines by recency (prefer unused lines)
5. Select and display
6. Mark line as used, update cooldowns

### 7.2 Display Recommendations

- Dialogue should appear briefly (3-4 seconds) then fade
- Use character's name as attribution
- Italicized actions (*touches eye*) should be visually distinct
- Consider a subtle animation or highlight on the speaking character's avatar

### 7.3 Audio Considerations (Future)

If audio is ever added:
- Each character should have distinct vocal qualities
- Le Chiffre: soft, European, deliberate
- Bond: British, clipped, dry
- Felix: American, warm, casual
- Obanno: deep, accented, threatening
- Vesper: British, precise, guarded

---

## Appendix A: Quick Reference Card

### Character Voice Summaries

| Character | Voice | Key Traits | Signature Line |
|-----------|-------|------------|----------------|
| **Bond** | Dry, minimal | Confident, cutting | "The name's Bond." |
| **Le Chiffre** | Soft, deliberate | Mathematical, desperate | "Mathematics doesn't lie." |
| **Vesper** | Precise, guarded | Observant, conflicted | "I'm the money." |
| **Felix** | Warm, casual | Friendly, calculating | "God bless America." |
| **Mr. White** | Minimal, cold | Unsettling, powerful | "You've served your purpose." |
| **Obanno** | Direct, threatening | Aggressive, fixated | "Where is my money?" |
| **Mathis** | Charming, philosophical | Gracious, observant | "C'est la vie." |
| **M** | Clipped, authoritative | Disciplined, dry | "Don't disappoint me." |
| **Dimitrios** | Nervous, defensive | Insecure, bitter | "You again." |
| **Valenka** | Quiet, watchful | Loyal, subtle | *silence* |
| **Dryden** | Condescending | Arrogant, doomed | "Blunt instruments." |
| **Mollaka** | Terse, wary | Paranoid, professional | "Business." |

---

## Appendix B: Line Counts by Character

| Character | Total Lines | Action | State | Relationship | Ambient |
|-----------|-------------|--------|-------|--------------|---------|
| Bond | 35 | 12 | 15 | 5 | 3 |
| Le Chiffre | 65 | 28 | 18 | 14 | 5 |
| Vesper | 45 | 18 | 12 | 12 | 3 |
| Felix | 55 | 25 | 14 | 12 | 4 |
| Mr. White | 30 | 12 | 10 | 6 | 2 |
| Obanno | 45 | 20 | 12 | 10 | 3 |
| Mathis | 35 | 16 | 8 | 8 | 3 |
| M | 30 | 12 | 8 | 8 | 2 |
| Dimitrios | 28 | 14 | 6 | 6 | 2 |
| Valenka | 18 | 8 | 6 | 4 | 0 |
| Dryden | 22 | 10 | 4 | 6 | 2 |
| Mollaka | 15 | 8 | 3 | 3 | 1 |

**Total: ~423 unique lines**

---

*End of Document*
