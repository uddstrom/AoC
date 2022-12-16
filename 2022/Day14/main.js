import { getData, getPath, matrix, min, max } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

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
    var map = matrix(maxR + 1, maxC - minC + 1, '.');

    var translate = ([r, c]) => [r, c - minC];
    scan.map((line) => lineToCoords(line))
        .flat()
        .map(translate)
        .forEach(([row, col]) => (map[row][col] = '#'));

    var [sr, sc] = translate([0, 500]);
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
    for (var r = from_r; r <= to_r; r++) {
        for (var c = from_c; c <= to_c; c++) {
            coords.push([r, c]);
        }
    }
    return lineToCoords([next, ...tail], coords);
}

function render(matrix) {
    matrix.map((row) => row.join('')).forEach((row) => console.log(row));
}

var map = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', render(map));
console.log('Part 2:');
