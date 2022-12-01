import { getData, getPath, max, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n\n').map((rows) => rows.split('\n').map(Number));
}

function top3(arr) {
    var descending = (a, b) => b - a;
    return arr.sort(descending).slice(0, 3);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', max(data.map(sum)));
console.log('Part 2:', sum(top3(data.map(sum))));
