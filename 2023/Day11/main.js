import { getData, getPath, min, max, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .flatMap((row, r) => row.split('').map((col, c) => (col === '#' ? [r, c] : undefined)))
        .filter(Boolean);
}

var distance = ([r1, c1], [r2, c2]) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

function expand(galaxyMap, n) {
    var ROWS = max(galaxyMap.map(([r, _]) => r)) - min(galaxyMap.map(([r, _]) => r));
    var COLS = max(galaxyMap.map(([_, c]) => c)) - min(galaxyMap.map(([_, c]) => c));
    rng(ROWS)
        .reverse()
        .forEach((rr) => {
            if (galaxyMap.every(([r, _]) => r !== rr)) {
                galaxyMap = galaxyMap.map(([r, c]) => [r > rr ? r + n : r, c]);
            }
        });

    rng(COLS)
        .reverse()
        .forEach((cc) => {
            if (galaxyMap.every(([_, c]) => c !== cc)) {
                galaxyMap = galaxyMap.map(([r, c]) => [r, c > cc ? c + n : c]);
            }
        });

    return galaxyMap;
}

var galaxyMap = getData(PUZZLE_INPUT_PATH)(parser);

var p1Map = expand(galaxyMap, 1);
var p2Map = expand(galaxyMap, 999999);

var dist1 = p1Map.flatMap((g1, i) => p1Map.slice(i).map((g2) => distance(g1, g2)));
var dist2 = p2Map.flatMap((g1, i) => p2Map.slice(i).map((g2) => distance(g1, g2)));

console.log('Part 1:', sum(dist1));
console.log('Part 2:', sum(dist2));
