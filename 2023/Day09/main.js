import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(' ').map(Number));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

function createExtrapolator(backwards) {
    return function extrapolate(seq) {
        if (seq.every((n) => n === 0)) return backwards ? [0, ...seq] : [...seq, 0];
        var nextSeq = extrapolate(seq.slice(1).map((n, i) => n - seq[i]));
        return backwards ? [seq[0] - nextSeq[0], ...seq] : [...seq, seq.pop() + nextSeq.pop()];
    };
}

var p1 = sum(data.map(createExtrapolator(false)).map((seq) => seq.pop()));
var p2 = sum(data.map(createExtrapolator(true)).map((seq) => seq[0]));

console.log('Part 1:', p1);
console.log('Part 2:', p2);
