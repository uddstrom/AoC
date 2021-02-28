const { getData } = require('../lib/utils');
const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;

const toNumbers = input => input.split('\n').map(Number);
const applyChanges = input => toNumbers(input).reduce((acc, curr) => acc + curr);

function calibrate(input) {
    // how can loops and state be avoided in JS without TCO?
    const visited = new Set();
    let currentFrequency = 0;
    let numbers;
    while (!visited.has(currentFrequency)) {
        visited.add(currentFrequency);
        const [head, ...tail] = numbers?.length > 0 ? numbers : toNumbers(input);
        currentFrequency += head;
        numbers = tail;
    }
    return currentFrequency;
}

const data = getData(PUZZLE_INPUT_PATH);

console.log('Part 1:', data(applyChanges));
console.log('Part 2:', data(calibrate));
