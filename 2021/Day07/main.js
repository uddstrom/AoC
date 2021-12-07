import { getData, getPath, min, max, range, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function calculateFuelCost(burnRate) {
    return function (crabs) {
        let crabSpread = range(min(crabs), max(crabs));
        let fuelCost = (alignPos) => sum(crabs.map(burnRate(alignPos)));
        return min(crabSpread.map(fuelCost));
    };
}

var parser = (input) => input.split(',').map(Number);
var crabs = getData(PUZZLE_INPUT_PATH)(parser);

var triangularSum = (n) => (n * (n + 1)) / 2; // triangularSum = 1 + 2 + 3 + ... + n
var linearBurnRate = (alignPos) => (crabPos) => Math.abs(crabPos - alignPos);
var triangularBurnRate = (alignPos) => (crabPos) => triangularSum(Math.abs(crabPos - alignPos));

console.log('Part 1:', calculateFuelCost(linearBurnRate)(crabs));
console.log('Part 2:', calculateFuelCost(triangularBurnRate)(crabs));
