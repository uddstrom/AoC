import { getData, getPath } from '../lib/utils.js';
import IntcodeComputer from './IntcodeComputer.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split(',').map(Number);
}

function run(program, input) {
    var computer = IntcodeComputer(program, true, input);
    var diagnosticCode;
    while (true) {
        var { value, done } = computer.next();
        if (done) {
            return diagnosticCode;
        } else {
            diagnosticCode = value;
        }
    }
}

var program = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', run(program, [1]));
console.log('Part 2:', run(program, [5]));
