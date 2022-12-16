import { count, getData, getPath, matrix, min, max, rng } from '../lib/utils.js';
import { not } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var sandsource;

function parser(input) {
    var scan = input
        .split('\n')
        .map((row) =>
            row.split(' -> ').map((cord) => cord.split(',').map(Number))
        );

    /* scan looks like this:
    [
        [ [ 498, 4 ], [ 498, 6 ], [ 496, 6 ] ],
        [ [ 503, 4 ], [ 502, 4 ], [ 502, 9 ], [ 494, 9 ] ]
    ]
    */

    var maxR = max(scan.map((line) => line.map(([c, r]) => r)).flat());
    var minC = min(scan.map((line) => line.map(([c, r]) => c)).flat());
    var maxC = max(scan.map((line) => line.map(([c, r]) => c)).flat());
    var map = matrix(maxR + 3, maxR + 3, '.');
    map[map.length - 1] = rng(map[0].length).map(_ => '#');

    var translate = ([r, c]) => [r, c - minC];
    scan.map((line) => lineToCoords(line))
        .flat()
        .map(translate)
        .forEach(([row, col]) => (map[row][col] = '#'));


    sandsource = translate([0, 500]);
    var [sr, sc] = sandsource;
    map[sr][sc] = '+'; // Sand source
    return map;
}

function lineToCoords(line, coords = []) {
    // line: [ [ 498, 4 ], [ 498, 6 ], [ 496, 6 ] ]
    if (line.length < 2) return coords;
    var [head, next, ...tail] = line;
    var [start_c, start_r] = head;
    var [end_c, end_r] = next;
    var from_r = min([start_r, end_r]);
    var to_r = max([start_r, end_r]);
    var from_c = min([start_c, end_c]);
    var to_c = max([start_c, end_c]);
    for (let r = from_r; r <= to_r; r++) {
        for (let c = from_c; c <= to_c; c++) {
            coords.push([r, c]);
        }
    }
    return lineToCoords([next, ...tail], coords);
}

function render(matrix) {
    matrix.map((row) => row.join('')).forEach((row) => console.log(row));
}

function dropSand(map, [r, c]) {
    var inMap = ([r, c]) => r >= 0 && r < map.length ? c >= 0 && c < map[r].length : false;
    var notBlocked = ([r, c]) => !inMap([r, c]) || map[r][c] === '.';
    // down, downleft, downright
    var next = [[r + 1, c], [r + 1, c - 1], [r + 1, c + 1]].find(notBlocked);
    if (next === undefined) {
        // at rest, update map
        map[r][c] = 'o';
        return map;
    }
    if (not(inMap)(next)) {
        // extend the map
        var [nr, nc] = next;
        if (nc > map[0].length - 1) {
            map = extendRight(map);
        } else if (nc < 0) {
            map = extendLeft(map);
        }
    } 
    return dropSand(map, next);
}

function extendLeft(map) {
    map.forEach(row => row.unshift('.'));
    map[map.length - 1][0] = '#';
    return map;
}

function extendRight(map) {
    map.forEach(row => row.push('.'));
    map[map.length - 1][map[0].length - 1] = '#';
    return map;
}

var map = getData(PUZZLE_INPUT_PATH)(parser);

var mapFullWithSand = structuredClone(map);
while (true) {
    mapFullWithSand = dropSand(mapFullWithSand, sandsource);
    sandsource = [0, mapFullWithSand[0].indexOf('+')];
    if (mapFullWithSand[1][sandsource[1]] === 'o') break;
}

render(mapFullWithSand);

console.log('Part 1:', count('o', mapFullWithSand.flat()));
// console.log('Part 2:');
