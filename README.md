# Casino Royale Poker

A single-player Texas Hold'em poker game themed around Casino Royale. Play as James Bond against skilled AI opponents with distinct personalities in a high-stakes tournament setting.

## Play

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Features

- **Cinematic UI** - Elegant dark theme with gold accents, custom animations, and smooth transitions
- **$1,000,000 Buy-in** - High-stakes tournament with escalating blinds ($5K/$10K starting, increases every 8 hands)
- **Skilled AI Opponents** - Position-aware betting, pot odds calculation, personality-driven decisions
- **Character Voice Lines** - Dynamic dialogue system with probability-based triggers and cooldowns
- **Stack-Aware Betting** - AI won't recklessly go all-in; risk management based on hand strength and stack size
- **Sequential AI Actions** - Watch each opponent make their move with configurable animation speed
- **Game History** - Live feed of actions (newest first)
- **Settings Panel** - Adjust animation speed (Slow/Normal/Fast), toggle winner hand visibility

## Characters

11 Casino Royale characters with distinct personalities. Each game features James Bond vs Le Chiffre (always) plus 4 randomly selected opponents.

| Opponent | Style | Win Rate* |
|----------|-------|-----------|
| **Vesper Lynd** | Very tight, premium hands only | ~22% |
| **Mollaka** | Professional, terse, watches exits | ~22% |
| **Mathis** | Tricky, deceptive, frequent bluffs | ~22% |
| **Valenka** | Quiet observer, easy to underestimate | ~20% |
| **M** | Disciplined, patient | ~20% |
| **Alex Dimitrios** | Nervous, out of his depth | ~20% |
| **Dryden** | Arrogant, overconfident bluffer | ~20% |
| **Le Chiffre** | Tight-aggressive, calculating | ~19% |
| **Felix Leiter** | Loose-aggressive, pressure | ~18% |
| **Mr. White** | Almost invisible, strikes without warning | ~18% |
| **Steven Obanno** | Intimidating, impatient, hyper-aggressive | ~15% |

*Win rates normalized by appearances from 5,000 simulated games

## Tournament Structure

Blinds escalate every 8 hands:

| Level | Blinds |
|-------|--------|
| 0 | $5,000 / $10,000 |
| 1 | $10,000 / $20,000 |
| 2 | $15,000 / $30,000 |
| 3 | $25,000 / $50,000 |
| 4+ | Continues increasing... |

## Testing

Comprehensive stress test suite with statistics:

```bash
node test-stress.js 100    # Run 100 games
node test-stress.js 1000   # Run 1000 games (~6 sec)
node test-stress.js 5000   # Run 5000 games (~32 sec)
```

Outputs:
- Game length histogram
- Win rates per character (normalized by appearances)
- Survival/elimination stats
- Function coverage validation
- Performance metrics (~156 games/sec)

## Tech Stack

- Next.js 14 / React 18
- CSS-in-JS styling
- No external UI libraries

## Deploy

Push to GitHub, connect to Vercel.

## License

MIT
