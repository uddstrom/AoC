import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((row) => row.trim().split(' '))
        .map(([_, val]) => Number(val));
}

function draw(CRT) {
    return [0, 40, 80, 120, 160, 200].map((i) => CRT.slice(i, i + 40).join(''));
}

function runProgram(program) {
    var stack = [...program];
    var measurePoints = [20, 60, 100, 140, 180, 220];

    function updateCrt(CRT, cycle, x) {
        var spritePos = cycle % 40;
        return spritePos >= x - 1 && spritePos <= x + 1
            ? CRT.map((c, i) => (i === cycle ? '#' : c))
            : [...CRT];
    }

    function process(CRT, signalStrength = 0, cycle = 1, x = 1, val = NaN) {
        if (stack.length <= 0) return [signalStrength, CRT];
        signalStrength += measurePoints.includes(cycle) ? x * cycle : 0;
        var updCRT = updateCrt(CRT, cycle - 1, x);
        return Number.isNaN(val) // are we in an 'adding' cycle?
            ? process(updCRT, signalStrength, cycle + 1, x, stack.shift()) // no, get new instruction
            : process(updCRT, signalStrength, cycle + 1, x + val); // yes, add the value to x
    }
    return process(rng(240).fill(' '));
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [1, 2, NaN, 3, 4, ...]
var [measures, CRT] = runProgram(data);

console.log('Part 1:', measures);
console.log('Part 2:', draw(CRT));
