// Board is an array of 101 elements (index 0 = start, index 100 = finish)
// Players start at position 0 and win by reaching position 100

function createBoard() {
  const board = [];

  for (let i = 0; i <= 100; i++) {
    board[i] = { position: i, type: TILE_TYPES.NORMAL };
  }

  // --- Superpower tiles (1–6) ---
  for (let i = 1; i <= 6; i++) {
    board[i].type = TILE_TYPES.SUPERPOWER;
    board[i].superpowerType = SUPERPOWER_TILE_MAP[i];
  }

  // --- Rivers (4 rivers spread across board) ---
  // River A — early lower half
  [17, 18].forEach(t => { board[t].type = TILE_TYPES.RIVER; board[t].riverName = 'Muddy River'; });
  // River B — mid lower half
  [44, 45, 46].forEach(t => { board[t].type = TILE_TYPES.RIVER; board[t].riverName = 'Crocodile Creek'; });
  // River C — upper half entry
  [67, 68].forEach(t => { board[t].type = TILE_TYPES.RIVER; board[t].riverName = 'Jungle Falls'; });
  // River E — near end, dramatic
  [93, 94].forEach(t => { board[t].type = TILE_TYPES.RIVER; board[t].riverName = 'Final Rapids'; });

  // --- Cheetahs (row starts → row ends) ---
  board[11].type = TILE_TYPES.CHEETAH; board[11].leadsTo = 20; board[11].label = 'Cheetah Sprint';
  board[31].type = TILE_TYPES.CHEETAH; board[31].leadsTo = 40; board[31].label = 'Cheetah Dash';
  board[51].type = TILE_TYPES.CHEETAH; board[51].leadsTo = 60; board[51].label = 'Cheetah Run';
  board[71].type = TILE_TYPES.CHEETAH; board[71].leadsTo = 80; board[71].label = 'Cheetah Charge';

  // --- Helicopters (vertically aligned — same grid column, 2 rows up) ---
  board[13].type = TILE_TYPES.HELICOPTER; board[13].leadsTo = 33; board[13].label = 'Rescue Heli';
  board[21].type = TILE_TYPES.HELICOPTER; board[21].leadsTo = 41; board[21].label = 'Rescue Heli';
  board[57].type = TILE_TYPES.HELICOPTER; board[57].leadsTo = 77; board[57].label = 'Rescue Heli';

  // --- Giraffe (vertically aligned — same grid column, 1 row up) ---
  board[25].type = TILE_TYPES.GIRAFFE; board[25].leadsTo = 36; board[25].label = 'Giraffe Lookout';

  // --- Gorillas (same column, 2 rows down — inverse of Helicopter) ---
  // 54→34: row 5 (odd) col 6 → row 3 (odd) col 6
  board[54].type = TILE_TYPES.GORILLA; board[54].leadsTo = 34; board[54].label = 'Gorilla Toss';
  // 84→64: row 8 (even) col 3 → row 6 (even) col 3
  board[84].type = TILE_TYPES.GORILLA; board[84].leadsTo = 64; board[84].label = 'Gorilla Toss';

  // --- Honey Pot (tile 55) ---
  board[55].type = TILE_TYPES.HONEY_POT; board[55].label = 'Honey Pot';

  // --- Bears (all → Honey Pot; spread across board) ---
  // Bear 22: near-left in row 2 (boost +33)
  board[22].type = TILE_TYPES.BEAR; board[22].label = 'Bear Encounter';
  // Bear 29: near-right in row 2 (boost +26)
  board[29].type = TILE_TYPES.BEAR; board[29].label = 'Bear Encounter';
  // Bear 61: leftmost col in row 6 (mild penalty −6)
  board[61].type = TILE_TYPES.BEAR; board[61].label = 'Bear Encounter';
  // Bear 70: rightmost in row 6 (penalty −15)
  board[70].type = TILE_TYPES.BEAR; board[70].label = 'Bear Encounter';

  // --- Lions (extra dice roll) ---
  board[42].type = TILE_TYPES.LION; board[42].label = 'Lion Guard';
  board[78].type = TILE_TYPES.LION; board[78].label = 'Lion Guard';

  // --- Chameleons ---
  board[35].type = TILE_TYPES.CHAMELEON; board[35].label = 'Chameleon Crossing';

  // --- Alligators (miss 1 turn) ---
  board[38].type = TILE_TYPES.ALLIGATOR; board[38].label = 'Alligator Swamp';
  board[49].type = TILE_TYPES.ALLIGATOR; board[49].label = 'Alligator Swamp';

  // --- Snakes (3 in upper half — all mild, all destinations stay in upper half) ---
  board[76].type = TILE_TYPES.SNAKE; board[76].leadsTo = 62; board[76].label = 'Cobra Corner';
  board[87].type = TILE_TYPES.SNAKE; board[87].leadsTo = 73; board[87].label = 'King Cobra Lair';
  board[96].type = TILE_TYPES.CHAMELEON; board[96].label = 'Chameleon Crossing';
  board[99].type = TILE_TYPES.SNAKE; board[99].leadsTo = 65; board[99].label = 'Mamba Marsh';

  // --- Hippo (1, mild — upper half, stays near entry) ---
  board[59].type = TILE_TYPES.HIPPO; board[59].leadsTo = 52; board[59].label = 'Hippo Charge';

  // --- Rhino (miss 2 turns — near end of board) ---
  board[90].type = TILE_TYPES.RHINO; board[90].label = 'Rhino Stampede';

  return board;
}

function getBoardSummary(board) {
  const summary = {};
  board.forEach(tile => {
    if (tile.type !== TILE_TYPES.NORMAL) {
      summary[tile.position] = tile.type + (tile.leadsTo ? ` → ${tile.leadsTo}` : '') + (tile.label ? ` (${tile.label})` : '');
    }
  });
  return summary;
}
