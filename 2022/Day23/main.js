import { getData, getPath, min, max, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return new Set(
        input
            .split('\n')
            .flatMap((row, r) => row.split('').map((col, c) => (col === '#' ? `${r},${c}` : null)))
            .filter((i) => i)
    );
}

function scan(elves, scanMap) {
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

    var scanAdjacents = (r, c) => DIRS.map(([dr, dc]) => `${r + dr},${c + dc}`).map((e) => elves.has(e));

    function getProposedMove(elf) {
        var [r, c] = elf.split(',').map(Number);
        var adjacents = scanAdjacents(r, c); // true/false for each pos around the elf.
        var occupied = (dirs) => dirs.reduce((acc, curr) => acc || adjacents[curr], false);
        if (adjacents.some((a) => a)) {
            // there is an adjecent elf, need to move
            for (let dirs of scanMap) {
                var goDir = dirs[0]; // the direction the elf should go if possible
                if (!occupied(dirs)) return `${r + DIRS[goDir][0]},${c + DIRS[goDir][1]}`;
            }
        }
        return `${r},${c}`;
    }

    var proposedMoves = new Map();
    elves.forEach((elf) => proposedMoves.set(elf, getProposedMove(elf)));
    return proposedMoves;
}

function move(proposed) {
    // proposed is a map with oldpos as key and proposed newpos as value
    var elves = new Set();
    var addElf = (newpos, oldpos, map) => {
        if (newpos === oldpos) {
            elves.add(oldpos);
        } else {
            [...map.values()].filter((p) => p === newpos).length === 2 ? elves.add(oldpos) : elves.add(newpos);
        }
    };
    proposed.forEach(addElf);
    return elves;
}

function getScanMap(round) {
    var scanMap = [
        [0, 1, 2], // => N, NW, NE
        [3, 4, 5], // => S, SW, SE
        [6, 1, 4], // => W, NW, SW
        [7, 2, 5], // => E, NE, SE
    ];
    rng(round % 4).forEach(() => scanMap.push(scanMap.shift()));
    return scanMap;
}

function getTiles(elves) {
    var elvesArr = [...elves].map((elf) => elf.split(',').map(Number));
    var min_r = min(elvesArr.map(([r, c]) => r));
    var max_r = max(elvesArr.map(([r, c]) => r));
    var min_c = min(elvesArr.map(([r, c]) => c));
    var max_c = max(elvesArr.map(([r, c]) => c));
    return (max_r - min_r + 1) * (max_c - min_c + 1) - elves.size;
}

function simulateP1(elves, round = 0) {
    if (round === 10) return elves;
    return simulateP1(move(scan(elves, getScanMap(round)), elves), round + 1);
}

function simulateP2(elves, round = 0) {
    var next = move(scan(elves, getScanMap(round)));
    if ([...elves].toString() === [...next].toString()) return round + 1;
    return simulateP2(next, round + 1);
}

var elves = getData(PUZZLE_INPUT_PATH)(parser);
var start = Date.now();

console.log('Part 1:', getTiles(simulateP1(elves)));
console.log('Part 2:', simulateP2(elves));
console.log('Completed in (ms):', Date.now() - start);
