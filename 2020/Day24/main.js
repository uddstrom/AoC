const fs = require('fs');

const Vec = (r, c) => ({ r, c, add: (v) => Vec(v.r + r, v.c + c), id: `${r},${c}` });

const DIRS = {
    ne: [Vec(-1, 0), Vec(-1, 1)],
    e: [Vec(0, 1), Vec(0, 1)],
    se: [Vec(1, 0), Vec(1, 1)],
    sw: [Vec(1, -1), Vec(1, 0)],
    w: [Vec(0, -1), Vec(0, -1)],
    nw: [Vec(-1, -1), Vec(-1, 0)],
};

const move = (from, dir) => from.add(getVec(from.r, dir));
const getVec = (row, dir) => DIRS[dir][Math.abs(row) % 2];

function partOne(lines) {
    const tiles = new Map();

    lines.forEach(line => {
        let pos = Vec(0, 0);
        line.match(/e|se|sw|w|nw|ne/g).forEach(dir => pos = move(pos, dir));
        tiles.set(pos.id, !!!tiles.get(pos.id));
    });

    return [...tiles.values()].filter(v => v).length;
}

fs.readFile('Day24/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');
    console.log('Part 1:', partOne(input));
    console.log('Part 2:',);
});
