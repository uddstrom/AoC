import { getData, getPath, isEven, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split(' ').map(Number);
}

function transform(stone) {
    var split = (str) => [Number(str.substring(0, str.length / 2)), Number(str.substring(str.length / 2))];
    if (stone === 0) return [1];
    if (isEven(stone.toString().length)) return split(stone.toString());
    return [stone * 2024];
}

var stoneMap = new Map();

function blink(stone, n) {
    if (stoneMap.has(`${stone},${n}`)) {
        return stoneMap.get(`${stone},${n}`);
    }

    if (n === 0) {
        return 1;
    }

    var S = transform(stone);
    var res = S.reduce((acc, stone) => acc + blink(stone, n - 1), 0);
    stoneMap.set(`${stone},${n}`, res);
    return res;
}

var stones = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', sum(stones.map((stone) => blink(stone, 25))));
console.log('Part 2:', sum(stones.map((stone) => blink(stone, 75))));
