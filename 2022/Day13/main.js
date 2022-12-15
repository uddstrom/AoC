import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n\n').map((pair) => pair.split('\n').map(JSON.parse));
}

function compare(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        return left < right ? -1 : left > right ? 1 : 0;
    }
    if (typeof left === 'number' && typeof right === 'object') {
        return compare([left], right);
    }
    if (typeof left === 'object' && typeof right === 'number') {
        return compare(left, [right]);
    }

    while (left.length > 0 || right.length > 0) {
        if (left.length === 0) return -1;
        if (right.length === 0) return 1;
        var c = compare(left[0], right[0]);
        if (c !== 0) return c;
        left = left.slice(1);
        right = right.slice(1);
    }
    return 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = sum(
    data.map(([left, right], index) =>
        compare(left, right) > 0 ? 0 : index + 1
    )
);
console.log('Part 1:', p1);

var d1 = [[2]];
var d2 = [[6]];
var sorted = [...data.flat(1), d1, d2].sort(compare);
var p2 = (sorted.indexOf(d1) + 1) * (sorted.indexOf(d2) + 1);
console.log('Part 2:', p2);
