import { getData, getPath, product, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var matchNumbers = (str) => Array.from(str.matchAll(/\d+/g), (m) => Number(m[0]));
    return input.split('\n').map(matchNumbers);
}

function getDistanceCalculator(raceTime) {
    return function calculateDistance(chargeTime) {
        return chargeTime * (raceTime - chargeTime);
    };
}

var [raceTimes, records] = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = product(
    raceTimes
        .map((raceTime) => rng(raceTime + 1).map(getDistanceCalculator(raceTime)))
        .map((distances, i) => distances.filter((d) => d > records[i]))
        .map((waysToBeatRecord) => waysToBeatRecord.length)
);

var raceTime = Number(raceTimes.join(''));
var record = Number(records.join(''));
var calculateDistance = getDistanceCalculator(raceTime);

var minChargeTime = 0;
while (calculateDistance(minChargeTime) < record) minChargeTime++;

var maxChargeTime = raceTime;
while (calculateDistance(maxChargeTime) < record) maxChargeTime--;

var p2 = maxChargeTime - minChargeTime + 1;

console.log('Part 1:', p1);
console.log('Part 2:', p2);
