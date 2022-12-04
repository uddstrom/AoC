import { count, getData, getPath, intersect, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) =>
        row
            .split(',')
            .map((str) => str.split('-').map(Number))
            .map(([from, to]) => range(from, to))
    );
}

function fullyOverlaps([a1, a2]) {
    var i = intersect(a1, a2);
    return i.length === a1.length || i.length === a2.length;
}

function overlaps([a1, a2]) {
    return intersect(a1, a2).length > 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [[[1,2,3], [3,4,5]], ...]
console.log('Part 1:', count(true, data.map(fullyOverlaps)));
console.log('Part 2:', count(true, data.map(overlaps)));
