import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return [...input.matchAll(/mul\((\d+),(\d+)\)|don't\(\)|do\(\)/g)].map((match) => {
        return match[0] === "don't()" || match[0] === 'do()' ? match[0] : [Number(match[1]), Number(match[2])];
    });
}

function sum(data, p2 = false) {
    var active = true;
    return data.reduce(multiply, 0);
    function multiply(sum, instruction) {
        if (instruction === 'do()') {
            active = true;
            return sum;
        }
        if (instruction === "don't()") {
            active = false;
            return sum;
        }
        var [a, b] = instruction;
        return active || !p2 ? sum + a * b : sum;
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', sum(data));
console.log('Part 2:', sum(data, true));
