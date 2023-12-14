import { getData, getPath, count, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(' '));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

function isValidateArrangement(arr, conf) {
    return (
        Array.from(arr.matchAll(/\#+/g), (m) => m[0])
            .map((grp) => grp.length)
            .join(',') === conf
    );
}

function generateArrangements(pattern, conf) {
    var damagedSprings = sum(conf.split(',').map(Number)) - count('#', pattern.split(''));
    var length = pattern.match(/\?/g).length;
    var arrs = rng(2 ** length)
        .map((n) => n.toString(2).padStart(length, '0').split(''))
        .filter((n) => count('1', n) === damagedSprings)
        .map((setup) => setup.reduce((acc, curr) => acc.replace('?', curr === '1' ? '#' : '.'), pattern));
    return arrs;
}

var start = Date.now();

var setOfArrangements = data.map(
    ([pattern, conf]) => generateArrangements(pattern, conf).filter((arr) => isValidateArrangement(arr, conf)).length
);

var p1 = sum(setOfArrangements);

var t = Date.now() - start;

console.log('Part 1:', p1, t);
console.log('Part 2:');
