const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;
const { getData } = require('../lib/utils');
const { add, trampoline } = require('../lib/fn');

const toNumbers = input => input.split('\n').map(Number);
const applyChanges = input => toNumbers(input).reduce(add);

// Recursive version with PTC. However, PTC not supported by 
// V8, hence the use of trampolines (naive implementation).
function calibrate(input) {
    var trampolinedCalibrate = trampoline(
        function cali(currentFrequency, numbers, visited) {
            if (visited.has(currentFrequency)) return currentFrequency;
            visited.add(currentFrequency);
            const [head, ...tail] = numbers?.length > 0 ? numbers : toNumbers(input);
            return function () {
                return cali(currentFrequency + head, tail, visited);
            }
        });
    return trampolinedCalibrate(0, toNumbers(input), new Set());
}

const data = getData(PUZZLE_INPUT_PATH);

console.log('Part 1:', data(applyChanges));
console.log('Part 2:', data(calibrate));