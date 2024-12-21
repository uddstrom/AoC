import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var antennas = [];
    var grid = input.split('\n').map(row => row.split(''));

    var antennas = grid.flatMap((row, y) => row.map((col, x) => ({ x, y, f: col })))
        .filter(({ f }) => f !== '.');

    return { xMax: grid[0].length, yMax: grid.length, antennas };
}

function getAntiNodes(antenna1, antenna2, p2, n = 0) {
    var { x: x1, y: y1 } = antenna1;
    var { x: x2, y: y2 } = antenna2;
    var dx = (x2 - x1) * (p2 ? n : 1);
    var dy = (y2 - y1) * (p2 ? n : 1);
    var antiNodes = [[x1 - dx, y1 - dy], [x2 + dx, y2 + dy]].filter(inGrid);
    if (!p2) {
        return antiNodes;
    }

    return antiNodes.length > 0 ? [...antiNodes, ...getAntiNodes(antenna1, antenna2, n + 1, p2)] : [];
}

function inGrid([x, y]) {
    return x >= 0 && x < xMax && y >= 0 && y < yMax;
}

function processAntennas([head, ...tail], antiNodes = [], p2 = false) {
    if (tail.length === 0) {
        return antiNodes;
    }

    antiNodes = antiNodes.concat(tail.flatMap((ant) => head.f === ant.f ? getAntiNodes(head, ant, p2) : []));
    return processAntennas(tail, antiNodes, p2);
}

var { xMax, yMax, antennas } = getData(PUZZLE_INPUT_PATH)(parser);

var A1 = new Set(processAntennas(antennas).map(([x, y]) => `${x},${y}`));
var A2 = new Set(processAntennas(antennas, [], true).map(([x, y]) => `${x},${y}`));

console.log('Part 1:', A1.size);
console.log('Part 2:', A2.size);

