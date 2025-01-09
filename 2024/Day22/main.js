import { descending, getData, getPath, mod, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(Number);
}

function toSecretNumbers(initial) {
    var mix = (x, y) => x ^ y;
    var prune = (x) => mod(x, 16777216);
    var next = (x) => {
        x = prune(mix(x, x * 64));
        x = prune(mix(x, Math.floor(x / 32)));
        return prune(mix(x, x * 2048));
    }
    var secret = initial;
    return [initial, ...rng(2000).map(() => {
        secret = next(secret);
        return secret;
    })];
}

function toPricesAndDiffs(secretNumbers) {
    var prev;
    return secretNumbers.map(s => {
        var price = s % 10;
        var diff = price - prev;
        prev = price;
        return [price, diff];
    });
}

function toScoreMap(pricesAndDiffs) {
    let scoreMap = new Map();
    for (let i = pricesAndDiffs.length - 1; i > 3; i--) {
        let pattern = `${pricesAndDiffs[i - 3][1]},${pricesAndDiffs[i - 2][1]},${pricesAndDiffs[i - 1][1]},${pricesAndDiffs[i][1]}`;
        let score = pricesAndDiffs[i][0];
        scoreMap.set(pattern, score);
    }
    return scoreMap;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var secretNumbers = data.map(toSecretNumbers);
var scoreMaps = secretNumbers.map(toPricesAndDiffs).map(toScoreMap);

var PS = new Map(); // Pattern scores
scoreMaps.forEach((scoreMap) => scoreMap.forEach((s, p) => PS.has(p) ? PS.set(p, PS.get(p) + s) : PS.set(p, s)));

console.log('Part 1:', sum(secretNumbers.flatMap(secrets => secrets.pop())));
console.log('Part 2:', Array.from(PS.values()).sort(descending)[0]);

