import IntcodeComputer from '../lib/IntcodeComputer.js';
import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => input.split(',').map(Number);

function run(asciiProgram) {
    var intCodeProgram = getData(PUZZLE_INPUT_PATH)(parser);
    var input = asciiProgram
        .join('')
        .split('')
        .map((chr) => chr.charCodeAt(0));
    var computer = IntcodeComputer(intCodeProgram, true, input);
    var output = Array.from(computer);
    var ans = output.pop();
    var rendering = output.map((c) => String.fromCharCode(c)).join('');

    return ans > 10 ? ans : '\n\n' + rendering;
}

var asciiProgramWalk = [
    'NOT A T\n',
    'OR T J\n',
    'NOT B T\n',
    'OR T J\n',
    'NOT C T\n',
    'OR T J\n',
    'AND D J\n',
    'WALK\n',
];

var asciiProgramRun = [
    'NOT A T\n',
    'OR T J\n',
    'NOT B T\n',
    'OR T J\n',
    'NOT C T\n',
    'OR T J\n',
    'AND D J\n',
    'AND E T\n',
    'OR H T\n',
    'AND T J\n',
    'RUN\n',
];

console.log('Part 1:', run(asciiProgramWalk));
console.log('Part 2:', run(asciiProgramRun));
