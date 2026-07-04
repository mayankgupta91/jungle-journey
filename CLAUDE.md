# Jungle Journey — Project Identity

## What this is
A browser-based, pass-and-play board game for 2–4 kids on the same device. Jungle safari reimagining of Snakes & Ladders. Players drive colored jeeps across a 144-tile illustrated jungle map, collect superpowers, and encounter animals that help or hurt them. First to the end wins.

## Who it's for
Kids. The aesthetic must be rich, fun, and animated. Every interaction should feel exciting.

## Current State
Not started.

## Tech Stack
- Phaser.js (game framework)
- Pure browser, no backend
- In-memory game state only (no persistence)
- Shareable via link

## Key Decisions
- **Board:** 144 tiles (12×12), illustrated jungle map — winding paths, rivers cutting across, jungle terrain zones
- **Movement:** Gear shift 1–6. Landing on 6 = Nitro = extra turn
- **Superpowers:** Tiles 1–6 each assign a superpower. First landing locks it forever. 3 types repeated across tiles 1–6: Boat, Bow & Arrows, Traps
- **Rivers:** Any river tile = miss a turn, unless player has Boat superpower. 2–3 rivers on board
- **Traps:** Placed immediately when received. Visible to all. Permanent. Landing = miss a turn
- **Bow & Arrows:** 2 charges. Landing on a predator tile = predator killed, no penalty
- **Animals:** Chameleon (player chooses who to swap with), Cheetah (fasttrack to road end), Giraffe (climb ahead), Bear (redirect to Honey Pot in center), Snakes + Alligators (go back or miss turn)
- **Multiplayer:** Same device, pass-and-play. Turn ends with "[Name]'s turn" handoff screen
- **Intro:** Shown once on first load. "How to Play" accessible via button at any time, not a blocker

## What Claude Must Not Assume
- Do not add real-time multiplayer without discussion
- Do not add sound/music without discussion
- Do not add save/resume without discussion
- Do not add new animal types without discussion
- Do not make the intro screen appear every game — once only, then a button
- Superpowers are assigned by tile landed on, not player choice

## What to Avoid
- No backend, no database, no accounts
- No complex onboarding that blocks kids from playing
- No plain grid aesthetic — must be illustrated map style
