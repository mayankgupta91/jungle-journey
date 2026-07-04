# Jungle Journey — Running Feedback & Fix List

## Status Key
- [x] Done
- [~] In progress
- [ ] Pending

---

## Group A — Bugs
- [x] A1. Own trap catches yourself — logic fix (rules.js TRAP case already guarded, message clarity improved)
- [x] A2. Missed turn shows dice → you roll → nothing happens — auto-skip, no dice shown
- [x] A3. Superpower receipt message leaks into event area and corner log — "received BOW_ARROWS!" should be silent everywhere except the SP section, which already shows it

## Group B — Corner UX
- [x] B1. Superpower gets its own persistent section — never replaced by events
- [x] B2. Events clear each new turn — no stale Cheetah / "Placed 2 traps" carrying over
- [x] B3. Per-player log inside their corner — last 2 entries, replaces common log
- [x] B4. Auto-advance reduced 2.5s → 1.2s
- [x] B5. Trap tile shows placer's color + initial — so you know whose trap it is
- [x] B6. Trap icon changed from ⚠️ to 🪤

## Group C — Board Mechanics
- [x] C1. Cheetahs repositioned to row starts (11→20, 31→40, 51→60, 71→80) — 4 cheetahs covering both halves
- [x] C2. Bear repositioned — 4 Bears all → Honey Pot at tile 55 (visual center); Bears before 55 = boost, after 55 = penalty
- [x] C3. Action density — 51 special tiles / 51%. New types: Helicopter (2), Hippo (3), Rhino (2). Rivers extended to 5 tiles each. Giraffes and Helicopters vertically aligned.
- [ ] C4. River re-entry — rolling from within a river can re-penalise if you land on adjacent tile. Low concern with shorter rivers; revisit after C6.
- [x] C5. Win condition — exact roll required to land on tile 100. Overshoot = no move, turn passes with "Need exactly X" message.
- [x] C6. Board balance — lower half helpers only (Cheetahs, Helicopters, Giraffe, Bears, Chameleon, 2 Alligators, 2 rivers). Upper half = danger zone (5 Snakes, 2 Hippos, 2 Rhinos, 1 Alligator, 3 rivers). All same-type tiles ≥2 apart.
- [x] C7. Bears at visual extremes — alternating right(29)/left(42)/right(70)/left(81). Rhinos at 63+90 (27 apart). Hippos at 59+84 (25 apart). Alligators reduced to 3 total.

## Group D — Clarity
- [x] D1. Animal effect shown in corner when you land — "Snake bite → back to tile 26" explicit (already in rules.js messages)
- [ ] D2. Token size increased on board
- [x] D3. Swap UI unclear — "Swap with:" + player buttons doesn't signal that a tap is needed; label or button styling needs to make the action obvious
- [x] D4. Remove bottom Activity Log entirely — per-player corner logs already cover it, common log adds no value

## Group F — Polish (low priority)
- [ ] F1. Token glide animation — smooth movement across tiles instead of instant jump
- [ ] F2. Dice roll animation — visual spin before showing result, no priority
- [ ] F3. Overshoot — dice roll result not visible when player cannot win (roll shown but disappears before player can read it). Fix: show roll + "Need exactly X" message together, hold for longer.
- [ ] F4. Activity log messages need to be more exciting — current messages are functional but flat. Rewrite with energy, exclamation, drama.
- [ ] F5. Activity log position — should appear below the dice roll, not above it.

## Group E — Design (needs discussion)
- [ ] E1. 4-player corner layout — current arrangement not good for 4 players
- [ ] E2. What an animal does — visual vs text on tile (board density discussion)
- [ ] E3. Fewer bigger tiles — reduce tile count, increase tile size, show more info per tile

## Completed (earlier rounds)
- [x] Turn flow — corners, dice, tap-to-move, auto-advance
- [x] Nitro removed
- [x] Core game logic — all animals, superpowers, rivers
