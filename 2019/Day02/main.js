import { getData, getPath, sum } from '../lib/utils.js';
import IntcodeComputer from './IntcodeComputer.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split(',').map(Number);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

function part1(code) {
    code[1] = 12;
    code[2] = 2;
    var computer = IntcodeComputer(code, false, []);
    var { value } = computer.next();
    return value[0];
}

function part2(code) {
    for (var noun = 0; noun < 100; noun++) {
        for (var verb = 0; verb < 100; verb++) {
            code[1] = noun;
            code[2] = verb;
            var computer = IntcodeComputer(code, false, []);
            var { value } = computer.next();
            if (value[0] === 19690720) return 100 * noun + verb;
        }
    }
}

console.log('Part 1:', part1(data));
console.log('Part 2:', part2(data));
