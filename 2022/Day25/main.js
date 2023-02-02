import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split('').map((n) => (n === '=' ? -2 : n === '-' ? -1 : Number(n))));
}

function toDecimal(snafu) {
    return [...snafu].reverse().reduce((acc, curr, idx) => acc + curr * 5 ** idx, 0);
}

function toSnafu(decimal) {
    var min = (len) => 5 ** (len - 1) - max(len - 1);
    var max = (len) => (len <= 0 ? 0 : 2 * 5 ** (len - 1) + max(len - 1));

    function calculateSnafu(decimal, len = 1) {
        if (decimal < min(len)) return Array(len - 1).fill(0);
        var SNAFU = calculateSnafu(decimal, len + 1);
        var rest = decimal - toDecimal(SNAFU) + max(len - 1);
        var next = Math.floor(rest / 5 ** (len - 1));
        SNAFU[SNAFU.length - len] = next;
        return SNAFU;
    }

    return calculateSnafu(decimal).join('').replaceAll('-2', '=').replaceAll('-1', '-');
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
console.log('SNAFU:', toSnafu(sum(data.map(toDecimal))));
