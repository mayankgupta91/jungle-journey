// --- Game State ---

function createGame(playerDefs) {
  // playerDefs: [{ name, color }, ...]
  const players = playerDefs.map((p, i) => createPlayer(`p${i + 1}`, p.name, p.color));
  const board = createBoard();

  return {
    players,
    board,
    currentPlayerIndex: 0,
    turnNumber: 0,
    winner: null,
    pendingAction: null  // set when a tile requires player input before the turn ends
  };
}

// --- Accessors ---

function currentPlayer(game) {
  return game.players[game.currentPlayerIndex];
}

function getPlayerById(game, id) {
  return game.players.find(p => p.id === id);
}

// --- Core Turn ---

function takeTurn(game) {
  if (game.winner) return { error: 'Game already won by ' + game.winner.name };
  if (game.pendingAction) return { error: 'Resolve pending action first: ' + game.pendingAction.type };

  const player = currentPlayer(game);
  game.turnNumber += 1;

  // Skip if player is missing a turn
  if (player.missTurns > 0) {
    player.missTurns -= 1;
    const result = turnResult(game, player, null, [
      { effect: EFFECTS.NONE, message: `${player.name} misses this turn. (${player.missTurns} miss(es) remaining)` }
    ], false);
    advanceTurn(game, false);
    return result;
  }

  const roll = rollDice();
  const extraTurn = isNitro(roll);
  const log = [];

  log.push({ effect: EFFECTS.NONE, message: `${player.name} rolls ${roll}${extraTurn ? ' — NITRO!' : ''}.` });

  movePlayer(player, roll, game.board.length - 1);
  log.push({ effect: EFFECTS.NONE, message: `Moves to tile ${player.position}.` });

  // Check for win
  if (hasWon(player, game.board.length - 1)) {
    game.winner = player;
    log.push({ effect: EFFECTS.NONE, message: `🏆 ${player.name} wins the Jungle Journey!` });
    return turnResult(game, player, roll, log, extraTurn);
  }

  const tile = game.board[player.position];
  const effect = applyTileEffect(tile, player, game.players, game.board);
  log.push(effect);

  // Superpower received — check if Trap needs placement
  if (tile.type === TILE_TYPES.SUPERPOWER && player.superpower === SUPERPOWER_TYPES.TRAP && player.traps.length === 0) {
    game.pendingAction = { type: 'PLACE_TRAPS', player: player.id, remaining: 2 };
    log.push({ effect: EFFECTS.TRAP_PLACED, message: `${player.name} must now place 2 traps on the board.` });
  }

  // Chameleon — needs player to choose swap target
  if (effect.effect === EFFECTS.SWAP_WITH) {
    game.pendingAction = { type: 'CHOOSE_SWAP_TARGET', player: player.id };
  }

  const result = turnResult(game, player, roll, log, extraTurn);

  if (!game.pendingAction) {
    advanceTurn(game, extraTurn);
  }

  return result;
}

// --- Pending Action Resolvers ---

function resolveSwap(game, targetPlayerId) {
  if (!game.pendingAction || game.pendingAction.type !== 'CHOOSE_SWAP_TARGET') {
    return { error: 'No swap pending.' };
  }

  const player = getPlayerById(game, game.pendingAction.player);
  const target = getPlayerById(game, targetPlayerId);

  if (!target || target.id === player.id) return { error: 'Invalid swap target.' };

  swapPositions(player, target);
  game.pendingAction = null;

  const extraTurn = false;
  advanceTurn(game, extraTurn);

  return {
    message: `${player.name} swapped positions with ${target.name}. ${player.name} is now at tile ${player.position}, ${target.name} at tile ${target.position}.`
  };
}

function resolveTrapPlacement(game, tilePosition) {
  if (!game.pendingAction || game.pendingAction.type !== 'PLACE_TRAPS') {
    return { error: 'No trap placement pending.' };
  }

  const player = getPlayerById(game, game.pendingAction.player);
  const placed = placeTrap(player, tilePosition, game.board);

  if (!placed) return { error: `Could not place trap at tile ${tilePosition}.` };

  game.pendingAction.remaining -= 1;

  if (game.pendingAction.remaining === 0) {
    game.pendingAction = null;
    advanceTurn(game, false);
    return { message: `${player.name} placed trap at tile ${tilePosition}. All traps placed. Turn ends.` };
  }

  return { message: `${player.name} placed trap at tile ${tilePosition}. Place 1 more trap.` };
}

// --- Split Turn Functions (used by UI) ---

function rollForTurn(game) {
  if (game.winner) return { type: 'GAME_OVER' };
  if (game.pendingAction) return { type: 'PENDING', action: game.pendingAction };

  const player = currentPlayer(game);
  game.turnNumber += 1;

  if (player.missTurns > 0) {
    player.missTurns -= 1;
    advanceTurn(game, false);
    return { type: 'MISS_TURN', playerId: player.id, player: player.name, message: `${player.name} misses this turn.` };
  }

  const roll = rollDice();
  const totalTiles = game.board.length - 1;
  const destination = player.position + roll;

  if (destination > totalTiles) {
    advanceTurn(game, false);
    return { type: 'OVERSHOOT', roll, playerId: player.id, player: player.name, needed: totalTiles - player.position };
  }

  return { type: 'ROLLED', roll, destination, playerId: player.id, player: player.name };
}

function applyMoveToTile(game, destination) {
  const player = currentPlayer(game);
  player.position = destination;
  const totalTiles = game.board.length - 1;

  if (hasWon(player, totalTiles)) {
    game.winner = player;
    return { type: 'WIN', playerId: player.id, player: player.name, position: destination };
  }

  const tile = game.board[player.position];
  const effect = applyTileEffect(tile, player, game.players, game.board);

  if (tile.type === TILE_TYPES.SUPERPOWER && player.superpower === SUPERPOWER_TYPES.TRAP && player.traps.length === 0) {
    game.pendingAction = { type: 'PLACE_TRAPS', player: player.id, remaining: 2 };
  }

  if (effect.effect === EFFECTS.SWAP_WITH) {
    game.pendingAction = { type: 'CHOOSE_SWAP_TARGET', player: player.id };
  }

  const extraTurn = effect.effect === EFFECTS.EXTRA_TURN;
  if (!game.pendingAction) {
    advanceTurn(game, extraTurn);
  }

  return { type: 'MOVED', playerId: player.id, player: player.name, position: player.position, effect, extraTurn, pendingAction: game.pendingAction };
}

// --- Turn Advancement ---

function advanceTurn(game, extraTurn) {
  if (extraTurn) return;
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
}

// --- Helpers ---

function turnResult(game, player, roll, log, extraTurn) {
  return {
    player: player.name,
    roll,
    position: player.position,
    log,
    extraTurn: extraTurn || false,
    pendingAction: game.pendingAction,
    winner: game.winner ? game.winner.name : null,
    nextPlayer: game.winner ? null : currentPlayer(game).name
  };
}

function getGameState(game) {
  return {
    turn: game.turnNumber,
    currentPlayer: currentPlayer(game).name,
    winner: game.winner ? game.winner.name : null,
    pendingAction: game.pendingAction,
    players: game.players.map(p => ({
      name: p.name,
      position: p.position,
      superpower: p.superpower,
      missTurns: p.missTurns,
      arrowCharges: p.arrowCharges,
      traps: p.traps
    }))
  };
}
