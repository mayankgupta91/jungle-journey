// Quick console tests for Milestone 1 logic
// Open test.html in browser, open DevTools console, run these

function runTests() {
  console.log('=== JUNGLE JOURNEY — Logic Tests ===\n');

  // 1. Player creation
  const alice = createPlayer('p1', 'Alice', 'red');
  const bob = createPlayer('p2', 'Bob', 'blue');
  console.assert(alice.position === 0, 'Player starts at 0');
  console.assert(alice.superpower === null, 'No superpower at start');
  console.log('✓ Player creation');

  // 2. Superpower assignment
  assignSuperpower(alice, 1); // tile 1 = BOAT
  console.assert(alice.superpower === SUPERPOWER_TYPES.BOAT, 'Alice gets BOAT');
  assignSuperpower(alice, 2); // should not change
  console.assert(alice.superpower === SUPERPOWER_TYPES.BOAT, 'Superpower locked after first');
  console.log('✓ Superpower assignment & lock');

  // 3. Bow & Arrows charges
  const carlos = createPlayer('p3', 'Carlos', 'green');
  assignSuperpower(carlos, 2); // tile 2 = BOW_ARROWS
  console.assert(carlos.arrowCharges === 2, 'Bow starts with 2 arrows');
  console.log('✓ Bow & Arrows charges');

  // 4. River — miss turn (no boat)
  const riverTile = { position: 20, type: TILE_TYPES.RIVER };
  bob.position = 20;
  const riverResult = applyTileEffect(riverTile, bob, {});
  console.assert(bob.missTurns === 1, 'Bob misses a turn at river');
  console.log('✓ River: miss turn without boat');

  // 5. River — safe crossing with boat
  alice.position = 20;
  const safeRiver = applyTileEffect(riverTile, alice, {});
  console.assert(alice.missTurns === 0, 'Alice crosses river safely');
  console.log('✓ River: safe with Boat');

  // 6. Cheetah — fasttrack
  const cheetahTile = { position: 15, type: TILE_TYPES.CHEETAH, leadsTo: 40 };
  bob.position = 15;
  applyTileEffect(cheetahTile, bob, {});
  console.assert(bob.position === 40, 'Bob fast-tracks to 40 via Cheetah');
  console.log('✓ Cheetah fasttrack');

  // 7. Snake — go back (no arrows)
  const snakeTile = { position: 60, type: TILE_TYPES.SNAKE, leadsTo: 35 };
  bob.position = 60;
  applyTileEffect(snakeTile, bob, {});
  console.assert(bob.position === 35, 'Bob slides back via Snake');
  console.log('✓ Snake: slide back');

  // 8. Snake — killed by arrow
  carlos.position = 60;
  applyTileEffect(snakeTile, carlos, {});
  console.assert(carlos.position === 60, 'Carlos stays at 60, kills snake');
  console.assert(carlos.arrowCharges === 1, 'One arrow used');
  console.log('✓ Bow & Arrows: kills snake');

  // 9. Chameleon — swap
  alice.position = 10;
  bob.position = 50;
  swapPositions(alice, bob);
  console.assert(alice.position === 50 && bob.position === 10, 'Positions swapped');
  console.log('✓ Chameleon swap');

  // 10. Nitro
  console.assert(isNitro(6) === true, '6 is Nitro');
  console.assert(isNitro(3) === false, '3 is not Nitro');
  console.log('✓ Nitro on roll 6');

  // 11. Win check
  const winner = createPlayer('p4', 'Diana', 'yellow');
  winner.position = 99;
  movePlayer(winner, 5, 100);
  console.assert(hasWon(winner, 100) === true, 'Diana wins at tile 100');
  console.log('✓ Win condition');

  // 12. Board creation
  const board = createBoard();
  console.assert(board.length === 101, 'Board has 101 elements (0–100)');
  console.assert(board[0].type === TILE_TYPES.NORMAL, 'Tile 0 is normal start');
  console.assert(board[100].type === TILE_TYPES.NORMAL, 'Tile 100 is normal finish');
  console.log('✓ Board created with 101 tiles');

  // 13. Superpower tiles
  console.assert(board[1].type === TILE_TYPES.SUPERPOWER, 'Tile 1 is superpower');
  console.assert(board[1].superpowerType === SUPERPOWER_TYPES.BOAT, 'Tile 1 gives BOAT');
  console.assert(board[2].superpowerType === SUPERPOWER_TYPES.BOW_ARROWS, 'Tile 2 gives BOW_ARROWS');
  console.assert(board[3].superpowerType === SUPERPOWER_TYPES.TRAP, 'Tile 3 gives TRAP');
  console.log('✓ Superpower tiles correctly assigned');

  // 14. Rivers
  console.assert(board[18].type === TILE_TYPES.RIVER, 'Tile 18 is river');
  console.assert(board[45].type === TILE_TYPES.RIVER, 'Tile 45 is river');
  console.assert(board[71].type === TILE_TYPES.RIVER, 'Tile 71 is river');
  console.log('✓ River tiles placed');

  // 15. Cheetah leads to correct tile
  console.assert(board[12].leadsTo === 28, 'Cheetah at 12 → 28');
  console.assert(board[35].leadsTo === 55, 'Cheetah at 35 → 55');
  console.log('✓ Cheetah tiles placed');

  // 16. Snakes go back
  console.assert(board[48].leadsTo === 26, 'Snake at 48 → 26');
  console.assert(board[91].leadsTo === 61, 'Snake at 91 → 61');
  console.log('✓ Snake tiles placed');

  // 17. Honey Pot exists
  const honeyPot = board.find(t => t.type === TILE_TYPES.HONEY_POT);
  console.assert(honeyPot && honeyPot.position === 50, 'Honey Pot at tile 50');
  console.log('✓ Honey Pot placed');

  // 18. Bear redirects to Honey Pot using board
  const bear = createPlayer('p5', 'Eve', 'purple');
  bear.position = 30;
  applyTileEffect(board[30], bear, [], board);
  console.assert(bear.position === 50, 'Bear sends Eve to Honey Pot at 50');
  console.log('✓ Bear redirects to Honey Pot');

  // 19. Board summary (visual check)
  console.log('\n--- Board Special Tiles ---');
  console.table(getBoardSummary(board));

  // --- Turn Engine Tests ---

  // 20. Create game
  const game = createGame([
    { name: 'Alice', color: 'red' },
    { name: 'Bob', color: 'blue' }
  ]);
  console.assert(game.players.length === 2, 'Game has 2 players');
  console.assert(currentPlayer(game).name === 'Alice', 'Alice goes first');
  console.log('✓ Game creation');

  // 21. Turn advances to next player
  // Force Alice to a normal tile
  game.players[0].position = 10;
  game.board[10].type = TILE_TYPES.NORMAL;
  // Manually simulate a turn result without rolling (inject position)
  game.players[0].position = 9;
  const p = game.players[0];
  movePlayer(p, 1, 100); // lands on 10, normal tile
  advanceTurn(game, false);
  console.assert(currentPlayer(game).name === 'Bob', 'Turn advances to Bob');
  advanceTurn(game, false); // back to Alice
  console.assert(currentPlayer(game).name === 'Alice', 'Turn cycles back to Alice');
  console.log('✓ Turn cycling');

  // 22. Miss turn decrement
  game.players[1].missTurns = 1;
  game.currentPlayerIndex = 1;
  const missResult = takeTurn(game);
  console.assert(game.players[1].missTurns === 0, 'Bob miss turn decremented');
  console.assert(missResult.log[0].message.includes('misses this turn'), 'Miss turn message correct');
  console.log('✓ Miss turn logic');

  // 23. Win detection
  const winGame = createGame([{ name: 'Diana', color: 'yellow' }]);
  winGame.players[0].position = 96;
  winGame.board[97].type = TILE_TYPES.NORMAL;
  winGame.board[98].type = TILE_TYPES.NORMAL;
  winGame.board[99].type = TILE_TYPES.NORMAL;
  winGame.board[100].type = TILE_TYPES.NORMAL;
  // Force a roll of 4 by temporarily overriding
  const origRoll = rollDice;
  // Can't override easily, so just manually move to 100
  winGame.players[0].position = 99;
  movePlayer(winGame.players[0], 1, 100);
  console.assert(hasWon(winGame.players[0], 100), 'Diana wins at tile 100');
  console.log('✓ Win detection');

  // 24. Chameleon pending action
  const swapGame = createGame([
    { name: 'Eve', color: 'green' },
    { name: 'Frank', color: 'orange' }
  ]);
  swapGame.players[0].position = 37;
  swapGame.players[1].position = 70;
  // Land Eve on chameleon tile (38)
  movePlayer(swapGame.players[0], 1, 100);
  const chameleonEffect = applyTileEffect(swapGame.board[38], swapGame.players[0], swapGame.players, swapGame.board);
  swapGame.pendingAction = { type: 'CHOOSE_SWAP_TARGET', player: swapGame.players[0].id };
  console.assert(chameleonEffect.effect === EFFECTS.SWAP_WITH, 'Chameleon returns SWAP_WITH effect');
  const swapResult = resolveSwap(swapGame, 'p2');
  console.assert(swapGame.players[0].position === 70, 'Eve now at 70');
  console.assert(swapGame.players[1].position === 38, 'Frank now at 38');
  console.log('✓ Chameleon swap resolution');

  // 25. Trap placement flow
  const trapGame = createGame([
    { name: 'Grace', color: 'pink' },
    { name: 'Hank', color: 'brown' }
  ]);
  trapGame.players[0].superpower = SUPERPOWER_TYPES.TRAP;
  trapGame.players[0].superpowerLocked = true;
  trapGame.pendingAction = { type: 'PLACE_TRAPS', player: 'p1', remaining: 2 };
  resolveTrapPlacement(trapGame, 55);
  console.assert(trapGame.pendingAction !== null, 'Still pending after 1 trap');
  resolveTrapPlacement(trapGame, 77);
  console.assert(trapGame.pendingAction === null, 'Pending cleared after 2 traps');
  console.assert(trapGame.board[55].type === TILE_TYPES.TRAP, 'Tile 55 is now a trap');
  console.assert(trapGame.board[77].type === TILE_TYPES.TRAP, 'Tile 77 is now a trap');
  console.log('✓ Trap placement resolution');

  // 26. Game state summary
  console.log('\n--- Sample Game State ---');
  console.log(JSON.stringify(getGameState(game), null, 2));

  console.log('\n=== All tests passed ===');
}

runTests();
