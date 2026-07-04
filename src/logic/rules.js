// --- Player ---

function createPlayer(id, name, color) {
  return {
    id,
    name,
    color,
    position: 0,
    superpower: null,
    superpowerLocked: false,
    missTurns: 0,
    arrowCharges: 0,   // only used if superpower is BOW_ARROWS
    traps: []          // tile positions, only used if superpower is TRAP
  };
}

// --- Dice ---

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function isNitro(roll) {
  return roll === 6;
}

// --- Superpower Assignment ---

function assignSuperpower(player, tilePosition) {
  if (player.superpowerLocked) return null;

  const superpowerType = SUPERPOWER_TILE_MAP[tilePosition];
  if (!superpowerType) return null;

  player.superpower = superpowerType;
  player.superpowerLocked = true;

  if (superpowerType === SUPERPOWER_TYPES.BOW_ARROWS) {
    player.arrowCharges = 2;
  }

  return superpowerType;
}

// --- Movement ---

function movePlayer(player, roll, totalTiles) {
  const newPosition = Math.min(player.position + roll, totalTiles);
  player.position = newPosition;
  return newPosition;
}

// --- Tile Effects ---

function applyTileEffect(tile, player, allPlayers, board) {
  switch (tile.type) {

    case TILE_TYPES.SUPERPOWER: {
      assignSuperpower(player, tile.position);
      return { effect: EFFECTS.NONE, message: '' };
    }

    case TILE_TYPES.RIVER: {
      if (player.superpower === SUPERPOWER_TYPES.BOAT) {
        return { effect: EFFECTS.NONE, message: `${player.name} crosses the river safely with their Boat!` };
      }
      player.missTurns += 1;
      return { effect: EFFECTS.MISS_TURN, message: `${player.name} is stuck at the river! Miss a turn.` };
    }

    case TILE_TYPES.CHEETAH: {
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} hitches a ride on a Cheetah! Zooms to tile ${destination}.` };
    }

    case TILE_TYPES.GIRAFFE: {
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} climbs the Giraffe's neck! Reaches tile ${destination}.` };
    }

    case TILE_TYPES.HELICOPTER: {
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} spots a Helicopter! Airlifted to tile ${destination}.` };
    }

    case TILE_TYPES.BEAR: {
      const honeyPotTile = board.find(t => t.type === TILE_TYPES.HONEY_POT);
      const destination = honeyPotTile ? honeyPotTile.position : tile.position;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} follows the Bear to the Honey Pot at tile ${destination}!` };
    }

    case TILE_TYPES.CHAMELEON: {
      // Caller must resolve who to swap with — returns SWAP_WITH effect
      return { effect: EFFECTS.SWAP_WITH, message: `${player.name} landed on a Chameleon! Choose a player to swap positions with.` };
    }

    case TILE_TYPES.SNAKE: {
      if (player.superpower === SUPERPOWER_TYPES.BOW_ARROWS && player.arrowCharges > 0) {
        player.arrowCharges -= 1;
        return { effect: EFFECTS.KILL_PREDATOR, message: `${player.name} shoots the Snake with an arrow! Safe. (${player.arrowCharges} arrows left)` };
      }
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} is bitten by a Snake! Slides back to tile ${destination}.` };
    }

    case TILE_TYPES.ALLIGATOR: {
      if (player.superpower === SUPERPOWER_TYPES.BOW_ARROWS && player.arrowCharges > 0) {
        player.arrowCharges -= 1;
        return { effect: EFFECTS.KILL_PREDATOR, message: `${player.name} shoots the Alligator with an arrow! Safe. (${player.arrowCharges} arrows left)` };
      }
      player.missTurns += 1;
      return { effect: EFFECTS.MISS_TURN, message: `${player.name} is cornered by an Alligator! Miss a turn.` };
    }

    case TILE_TYPES.HIPPO: {
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} stumbles into a Hippo! Knocked back to tile ${destination}.` };
    }

    case TILE_TYPES.RHINO: {
      player.missTurns += 2;
      return { effect: EFFECTS.MISS_TURN, message: `${player.name} is charged by a Rhino! Miss 2 turns.` };
    }

    case TILE_TYPES.GORILLA: {
      const destination = tile.leadsTo;
      player.position = destination;
      return { effect: EFFECTS.MOVE_TO, destination, message: `${player.name} is hurled down by a Gorilla! Crashes to tile ${destination}.` };
    }

    case TILE_TYPES.LION: {
      return { effect: EFFECTS.EXTRA_TURN, message: `${player.name} is protected by a Lion! Roll again.` };
    }

    case TILE_TYPES.TRAP: {
      const trapperId = tile.placedBy;
      if (!trapperId || trapperId === player.id) {
        return { effect: EFFECTS.NONE, message: '' };
      }
      const trapperPlayer = Array.isArray(allPlayers) ? allPlayers.find(p => p.id === trapperId) : null;
      const trapperName = trapperPlayer ? trapperPlayer.name : 'someone';
      player.missTurns += 1;
      return { effect: EFFECTS.TRAPPED, message: `${player.name} fell into ${trapperName}'s trap! Miss a turn.` };
    }

    default:
      return { effect: EFFECTS.NONE, message: '' };
  }
}

// --- Swap (Chameleon resolution) ---

function swapPositions(playerA, playerB) {
  const temp = playerA.position;
  playerA.position = playerB.position;
  playerB.position = temp;
}

// --- Trap Placement ---

function placeTrap(player, tilePosition, board) {
  if (player.superpower !== SUPERPOWER_TYPES.TRAP) return false;
  if (player.traps.length >= 2) return false;

  player.traps.push(tilePosition);
  board[tilePosition].type = TILE_TYPES.TRAP;
  board[tilePosition].placedBy = player.id;

  return true;
}

// --- Win Check ---

function hasWon(player, totalTiles) {
  return player.position >= totalTiles;
}

// --- Turn Resolution ---

function resolveTurn(player, roll, board, allPlayers) {
  const totalTiles = board.length - 1;
  const result = { player: player.name, roll, effects: [], won: false };

  if (player.missTurns > 0) {
    player.missTurns -= 1;
    result.effects.push({ effect: EFFECTS.NONE, message: `${player.name} misses this turn.` });
    return result;
  }

  movePlayer(player, roll, totalTiles);
  result.effects.push({ effect: EFFECTS.NONE, message: `${player.name} rolls ${roll} and moves to tile ${player.position}.` });

  if (hasWon(player, totalTiles)) {
    result.won = true;
    result.effects.push({ effect: EFFECTS.NONE, message: `${player.name} wins the Jungle Journey!` });
    return result;
  }

  const tile = board[player.position];
  const tileResult = applyTileEffect(tile, player, allPlayers, board);
  result.effects.push(tileResult);

  if (isNitro(roll) && !result.won) {
    result.extraTurn = true;
    result.effects.push({ effect: EFFECTS.EXTRA_TURN, message: `NITRO! ${player.name} gets an extra turn!` });
  }

  return result;
}
