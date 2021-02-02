const fs = require('fs');

const Vec = (r, c) => ({ r, c, add: (v) => Vec(v.r + r, v.c + c) });
const move = (from, dir) => from.add(getVec(from.r, dir));
const getVec = (row, dir) => DIRS[dir][Math.abs(row) % 2];
const tileIdToVec = (id) => Vec(...id.split(',').map(Number));

const DIRS = {
    ne: [Vec(-1, 0), Vec(-1, 1)],
    e: [Vec(0, 1), Vec(0, 1)],
    se: [Vec(1, 0), Vec(1, 1)],
    sw: [Vec(1, -1), Vec(1, 0)],
    w: [Vec(0, -1), Vec(0, -1)],
    nw: [Vec(-1, -1), Vec(-1, 0)],
};

function initTiles(lines) {
    const tiles = new Map();

    lines.forEach(line => {
        let pos = Vec(0, 0);
        line.match(/e|se|sw|w|nw|ne/g).forEach(dir => pos = move(pos, dir));
        const key = `${pos.r},${pos.c}`;
        tiles.set(key, !!!tiles.get(key));
    });

    // return Set of black tileIds
    return new Set([...tiles.entries()].filter(([_, isBlack]) => isBlack).map(([tileId, _]) => tileId));
}

function flipTiles(blackTiles, day) {
    if (day === 100) return blackTiles;

    const blackTilesAfterFlip = new Set();

    const evalsToBlack = (tile, isBlack) => {
        let blackAdjacents = 0;
        Object.keys(DIRS).forEach(dir => {
            const adj = move(tile, dir);
            const adjId = `${adj.r},${adj.c}`;
            if (blackTiles.has(adjId)) blackAdjacents++;
        });

        return isBlack
            ? !(blackAdjacents === 0 || blackAdjacents > 2)
            : blackAdjacents === 2;
    };

    const evalAdjacents = (tile) => {
        Object.keys(DIRS).forEach(dir => {
            const adj = move(tile, dir);
            const adjId = `${adj.r},${adj.c}`;
            if (!blackTiles.has(adjId) && evalsToBlack(adj, false)) blackTilesAfterFlip.add(adjId);
        });
    };

    for (const tileId of blackTiles.values()) {
        const tile = tileIdToVec(tileId);
        if (evalsToBlack(tile, true)) blackTilesAfterFlip.add(tileId);
        evalAdjacents(tile);
    }

    return flipTiles(blackTilesAfterFlip, day + 1);
}

fs.readFile('Day24/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');
    const blackTiles = initTiles(input);
    const blackTilesDay100 = flipTiles(blackTiles, 0);

    console.log('Part 1:', blackTiles.size);
    console.log('Part 2:', blackTilesDay100.size);
});
