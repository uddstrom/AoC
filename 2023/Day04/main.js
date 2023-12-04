import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => {
        var { wins, nums } = line.match(/Card\s+\d+:(?<wins>.+)\|(?<nums>.+)/).groups;
        return [
            Array.from(wins.matchAll(/(\d+)/g), (m) => Number(m[0])),
            Array.from(nums.matchAll(/(\d+)/g), (m) => Number(m[0])),
        ];
    });
}

var cards = getData(PUZZLE_INPUT_PATH)(parser);
var matches = cards.map(([wins, nums]) => nums.filter((n) => wins.some((w) => w === n)).length);
var points = sum(matches.map((n) => Math.floor(2 ** (n - 1))));

var cardCount = Array(cards.length).fill(1);
rng(cards.length).forEach((n) => {
    rng(matches[n]).forEach((m) => (cardCount[n + m + 1] += cardCount[n]));
});

console.log('Part 1:', points);
console.log('Part 2:', sum(cardCount));
