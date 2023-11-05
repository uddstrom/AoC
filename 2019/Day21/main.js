import IntcodeComputer from '../lib/IntcodeComputer.js';
import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    return input.split(',').map(Number);
};

function run(computer) {
    var output = [];
    var terminateProgram = false;
    while (!terminateProgram) {
        var { value: out, done } = computer.next();
        out && output.push(out);
        terminateProgram = done;
    }
    return output;
}

function render(output) {
    var ans = output.pop();
    var rend = output
        .map((c) => String.fromCharCode(c))
        .join('')
        .trim();
    return ans > 10 ? rend + ans : rend;
}

var program = getData(PUZZLE_INPUT_PATH)(parser);

var asciiProgram = [
    'NOT A T\n',
    'OR T J\n',
    'NOT B T\n',
    'OR T J\n',
    'NOT C T\n',
    'OR T J\n',
    'AND D J\n',
    'WALK\n',
];

// var asciiProgram = ['NOT D J\n', 'WALK\n'];

var input = asciiProgram
    .join('')
    .split('')
    .map((chr) => chr.charCodeAt(0));

var computer = IntcodeComputer(program, true, input);

console.log(`Part 1:\n\n${render(run(computer))}`);
console.log('Part 2:');
