import { getData, getPath, matrix, max, min, range } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var scan = input
        .split('\n')
        .map((row) =>
            row.split(' -> ').map((cord) => cord.split(',').map(Number))
        );

    var maxR = max(scan.map((line) => line.map(([c, r]) => r)).flat());
    var maxC = max(scan.map((line) => line.map(([c, r]) => c)).flat());
    var map = matrix(maxR + 3, maxC, '.');

    scan.map((line) => lineToCoords(line))
        .flat()
        .forEach(([row, col]) => (map[row][col] = '#'));

    map[map.length - 1] = range(0, map[0].length).map((_) => '#'); // Floor
    map[0][500] = '+'; // Sand source
    return map;
}

function lineToCoords(line, coords = []) {
    // line: [ [ 498, 4 ], [ 498, 6 ], [ 496, 6 ] ]
    if (line.length < 2) return coords;
    var [[start_c, start_r], [end_c, end_r], ...tail] = line;
    var from_r = min([start_r, end_r]);
    var to_r = max([start_r, end_r]);
    var from_c = min([start_c, end_c]);
    var to_c = max([start_c, end_c]);
    range(from_r, to_r).forEach((r) => {
        range(from_c, to_c).forEach((c) => coords.push([r, c]));
    });
    return lineToCoords([[end_c, end_r], ...tail], coords);
}

function dropSand(map, source) {
    var [r, c] = source ? source : [0, map[0].indexOf('+')];
    var notInMap = ([r, c]) =>
        r < 0 || r >= map.length ? true : c < 0 || c >= map[r].length;
    var notBlocked = ([r, c]) => notInMap([r, c]) || map[r][c] === '.';

    var next = [
        [r + 1, c], // down
        [r + 1, c - 1], // downleft
        [r + 1, c + 1], // downright
    ].find(notBlocked);
    if (r === map.length - 2 || next === undefined) {
        // at rest, update map
        map[r][c] = 'o';
        return map;
    }
    if (notInMap(next)) {
        next = extend(map, next);
    }
    return dropSand(map, next);
}

function extend(map, next) {
    var [nr, nc] = next;
    if (nc >= map[0].length) {
        map.forEach((row) => row.push('.'));
    } else if (nc < 0) {
        map.forEach((row) => row.unshift('.'));
        next = [nr, 0];
    }
    map[map.length - 1].map((_) => '#');
    return next;
}

function runSimulation(map, p1 = 0, p2 = 0) {
    if (!map[0].includes('+')) return [p1, p2];
    map = dropSand(map);
    if (!map[map.length - 2].includes('o')) p1++;
    return () => runSimulation(map, p1, p2 + 1);
}

var map = getData(PUZZLE_INPUT_PATH)(parser);
var [p1, p2] = trampoline(runSimulation)(map);
console.log('Part 1:', p1);
console.log('Part 2:', p2);
