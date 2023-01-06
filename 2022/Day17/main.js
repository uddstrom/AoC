import { makeGrid } from '../lib/grid.js';
import { getData, getPath, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    let jets = input.split('');
    function* jetStream() {
        while (true) {
            let jet = jets.shift();
            jets.push(jet);
            yield jet;
        }
    }
    return jetStream();
}

function getStone(n) {
    var stones = [];

    stones.push([[0, 0, 2, 2, 2, 2, 0]]);

    stones.push([
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 0, 2, 0, 0, 0],
    ]);

    stones.push([
        [0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
    ]);

    stones.push([
        [0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0],
    ]);

    stones.push([
        [0, 0, 2, 2, 0, 0, 0],
        [0, 0, 2, 2, 0, 0, 0],
    ]);

    var index = n % 5;
    var s = stones[index];

    return s;
}

function addStone(grid, stone) {
    stone.reverse().forEach((row) => grid.unshift(row));
    return grid;
}

function pushStoneRight(grid) {
    var stone = grid.filter((row) => row.includes(2));
    var collision = stone.reduce((acc, curr) => {
        var i = curr.lastIndexOf(2);
        // check for collision
        if (i === 6 || curr[i + 1] === 1) return true;
        return false || acc;
    }, false);
    if (!collision) {
        // move right
        stone.forEach((row) => {
            var row2 = row.map((c) => (c === 2 ? 0 : c));
            row.forEach((c, i) => {
                if (c === 2) row2[i + 1] = 2;
            });
            row2.forEach((_, i) => (row[i] = row2[i]));
        });
    }
}

function pushStoneLeft(grid) {
    var stone = grid.filter((row) => row.includes(2));
    var collision = stone.reduce((acc, curr) => {
        var i = curr.indexOf(2);
        // check for collision
        if (i === 0 || curr[i - 1] === 1) return true;
        return false || acc;
    }, false);
    if (!collision) {
        // move left
        stone.forEach((row) => {
            var row2 = row.map((c) => (c === 2 ? 0 : c));
            row.forEach((c, i) => {
                if (c === 2) row2[i - 1] = 2;
            });
            row2.forEach((_, i) => (row[i] = row2[i]));
        });
    }
}

// ..+#
// .++#
// ...#
// .###

function fall(grid) {
    var stone_start_index = grid.findIndex((row) => row.includes(2));
    var stone = grid.filter((row) => row.includes(2));
    var collision = stone.reduce((acc, curr, index) => {
        // check for collision below
        var rowBelow = grid[stone_start_index + index + 1];
        if (rowBelow === undefined) return true;
        for (let i = 0; i < curr.length; i++) {
            if (curr[i] === 2 && rowBelow[i] === 1) return true;
        }
        return false || acc;
    }, false);
    if (!collision) {
        var grid2 = grid.map((r) => r.map((c) => (c === 2 ? 0 : c)));
        grid.forEach((row, r) => {
            if (r < grid.length - 1) {
                row.forEach((col, c) => {
                    if (col === 2) grid2[r + 1][c] = 2;
                });
            }
        });
        grid2.forEach((row, r) =>
            row.forEach((col, c) => {
                grid[r][c] = grid2[r][c];
            })
        );
        return true; // stone fell 1 row
    }
    return false; // did not fell, at rest
}

function convert(grid) {
    grid.forEach((row, r) =>
        row.forEach((col, c) => {
            if (grid[r][c] === 2) grid[r][c] = 1;
        })
    );
    // make sure there are only three empty lines on the top
    var i = grid.findIndex((row) => row.includes(1));
    while (i > 3) {
        grid.shift();
        i = grid.findIndex((row) => row.includes(1));
    }
}

function simulateDrop(grid, jetStream) {
    jetStream.next().value === '>' ? pushStoneRight(grid) : pushStoneLeft(grid);
    return fall(grid) ? simulateDrop(grid, jetStream) : convert(grid);
}

function getHeight(grid) {
    var i = grid.findIndex((row) => row.includes(1));
    return grid.length - i;
}

function patternId(grid, stone) {
    var rows = grid.slice(3, 50);
    var rs = rows.map((row) => parseInt(row.join(''), 2));
    var stoneid = stone.map((row) => parseInt(row.join(''), 2));
    return rs.join(',') + ',' + stoneid.join(',');
}

function print(grid) {
    grid.forEach((row) => {
        console.log(row.join('').replaceAll(0, '.').replaceAll(1, '#'));
    });
}

// 0 = empty space
// 1 = stone at rest
// 2 = falling stone
function p1() {
    var jetStream = getData(PUZZLE_INPUT_PATH)(parser);
    var grid = makeGrid(3, 7, 0);
    for (let s = 0; s < 2022; s++) {
        // get next stone
        let stone = getStone(s);
        // push stone on stack
        grid = addStone(grid, stone);
        simulateDrop(grid, jetStream);
    }
    return getHeight(grid);
}

function p2() {
    var jetStream = getData(PUZZLE_INPUT_PATH)(parser);
    var grid = makeGrid(3, 7, 0);
    var S = 1e12; // amount of stones to drop
    var IDs = new Map();
    var skip_height = 0;

    for (let s = 0; s < S; s++) {
        // get next stone
        let stone = getStone(s);
        // push stone on stack
        grid = addStone(grid, stone);
        simulateDrop(grid, jetStream);
        if (s > 3000 && s < 10000) {
            var id = patternId(grid, stone);
            if (IDs.has(id)) {
                let last = IDs.get(id);
                let ds = s - last.s;
                let dh = getHeight(grid) - last.h;
                let skip_amt = Math.floor((S - s) / ds); // the amount of time we need to drop ds stones
                skip_height += skip_amt * dh;
                s += skip_amt * ds;
            } else {
                IDs.set(id, { s, h: getHeight(grid) });
            }
        }
    }
    return getHeight(grid) + skip_height;
}

console.log('Part 1:', p1());
console.log('Part 2:', p2());
