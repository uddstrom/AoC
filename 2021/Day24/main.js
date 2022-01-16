// --
// Very much inspired by William Y. Feng,
// https://www.youtube.com/watch?v=Eswmo7Y7C4U
// --
import { getData, getPath, range, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) =>
    input
        .split('\n')
        .map((line) => line.split(' '))
        .map(([op, a, b]) => ({ op, a, b }));

function initALU(program) {
    return function check(modelNumber) {
        let prgm = structuredClone(program);
        let input = modelNumber.toString().split('').map(Number);
        let vars = { w: 0, x: 0, y: 0, z: 0 };
        let get = (b) => (isNaN(b) ? vars[b] : Number(b));
        let operations = {
            inp: (a) => (vars[a] = input.shift()),
            add: (a, b) => (vars[a] = vars[a] + get(b)),
            mul: (a, b) => (vars[a] = vars[a] * get(b)),
            div: (a, b) => (vars[a] = Math.floor(vars[a] / get(b))),
            mod: (a, b) => (vars[a] = vars[a] % get(b)),
            eql: (a, b) => (vars[a] = vars[a] === get(b) ? 1 : 0),
        };
        while (prgm.length > 0) {
            let { op, a, b } = prgm.shift();
            operations[op](a, b);
        }
        return vars.z;
    };
}

let _ = 0; // or whatever

function findModelNumber(numbers) {
    let type = [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0];
    let A = [_, _, _, 0, _, -13, _, -9, _, _, -14, -3, -2, -14];
    let B = [14, 8, 5, _, 10, _, 16, _, 6, 13, _, _, _, _];

    function buildModelNumber(number) {
        let digits = Array.from(String(number), Number);
        let z = 0;
        let modelNumber = Array(14).fill();
        let digits_idx = 0;

        for (let i of rng(14)) {
            if (type[i]) {
                // Type I: z = 26z + w + b
                z = 26 * z + digits[digits_idx] + B[i];
                modelNumber[i] = digits[digits_idx];
                digits_idx++;
            } else {
                // Type II: z = z / 26 (rounded down)
                let w = (z % 26) + A[i];
                if (w < 1 || w > 9) return false;
                modelNumber[i] = w;
                z = Math.floor(z / 26);
            }
        }
        return modelNumber;
    }

    for (let number of numbers) {
        let modelNumber = buildModelNumber(number);
        if (modelNumber) return Number(modelNumber.join(''));
    }
}

function main() {
    let monad = getData(PUZZLE_INPUT_PATH)(parser);
    let alu = initALU(monad);

    let numbers = range(1111111, 9999999)
        .filter((n) => !n.toString().includes('0'))
        .map(Number);

    let highest = findModelNumber(numbers.slice().reverse());
    let checkHighest = alu(highest);

    let lowest = findModelNumber(numbers);
    let checkLowest = alu(lowest);

    console.log('Part 1:', highest, checkHighest);
    console.log('Part 2:', lowest, checkLowest);
}

main();
