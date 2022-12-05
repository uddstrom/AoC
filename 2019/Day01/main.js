import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map(Number);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var massToFuelConverter = (mass) => Math.floor(mass / 3) - 2;

function calculateFuelForFuel(fuelMass, acc) {
    var m = massToFuelConverter(fuelMass);
    if (m <= 0) return acc;
    return calculateFuelForFuel(m, acc + m);
}

console.log('Part 1:', sum(data.map(massToFuelConverter)));
console.log('Part 2:', sum(data.map((m) => calculateFuelForFuel(m, 0))));
