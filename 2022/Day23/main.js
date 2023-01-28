import { getData, getPath, min, max, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .flatMap((row, r) => row.split('').map((col, c) => (col === '#' ? [r, c] : null)))
        .filter((i) => i);
}

var DIRS = [
    [-1, 0], // N
    [-1, -1], // NW
    [-1, 1], // NE
    [1, 0], // S
    [1, -1], // SW
    [1, 1], // SE
    [0, -1], // W
    [0, 1], // E
];

function scan(elves, scanOrder) {
    function scanAdjacents(r, c) {
        return DIRS.map(([rr, cc]) => [r + rr, c + cc]).map(([r, c]) => {
            for (var [rr, cc] of elves) {
                if (r === rr && c === cc) return true;
            }
            return false;
        });
    }

    // return list of proposed position to move to
    return elves.map(([r, c]) => {
        var adjacents = scanAdjacents(r, c); // list of true/false for each pos of DIRS.
        if (adjacents.some((a) => a)) {
            // there is an elf somewhere
            for (let scanDirs of scanOrder) {
                var hasElf = scanDirs.reduce((acc, curr) => acc || adjacents[curr], false);
                if (!hasElf) return [r + DIRS[scanDirs[0]][0], c + DIRS[scanDirs[0]][1]];
            }
        }
        return [r, c];
    });
}

function move(proposed, elves) {
    function isUnique([r, c]) {
        var count = proposed.reduce((acc, [r1, c1]) => (r === r1 && c === c1 ? acc + 1 : acc), 0);
        return count < 2;
    }

    return proposed.map((p, i) => (isUnique(p) ? p : elves[i]));
}

function getScanOrder(round) {
    var scanOrder = [
        [0, 1, 2], // => N, NW, NE
        [3, 4, 5], // => S, SW, SE
        [6, 1, 4], // => W, NW, SW
        [7, 2, 5], // => E, NE, SE
    ];
    // for (let i = 0; i < round % 4; i++) scanOrder.push(scanOrder.shift());
    rng(round).forEach(() => scanOrder.push(scanOrder.shift()));
    return scanOrder;
}

function getTiles(elves) {
    var min_r = min(elves.map(([r, c]) => r));
    var max_r = max(elves.map(([r, c]) => r));
    var min_c = min(elves.map(([r, c]) => c));
    var max_c = max(elves.map(([r, c]) => c));
    return (max_r - min_r + 1) * (max_c - min_c + 1) - elves.length;
}

function simulateP1(elves, round = 0) {
    if (round === 10) return elves;
    return simulateP1(move(scan(elves, getScanOrder(round)), elves), round + 1);
}

function simulateP2(elves, round = 0) {
    var next = move(scan(elves, getScanOrder(round)), elves);
    if (elves.toString() === next.toString()) return round + 1;
    return simulateP2(next, round + 1);
}

var elves = getData(PUZZLE_INPUT_PATH)(parser);
var start = Date.now();
console.log('Part 1:', getTiles(simulateP1(elves)), Date.now() - start);

start = Date.now();
console.log('Part 2 will take some time');
console.log('Part 2:', simulateP2(elves), Date.now() - start);
