import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((n, i) => [i, Number(n)]); // [position, value]
}

function mixing(data, rounds) {
    var L = data.length - 1;
    for (let index = 0; index < rounds; index++) {
        data.forEach(([pos, val], idx) => {
            let steps = val % L;
            if (steps < 0) steps += L;
    
            let newPos = pos + steps;
            if (newPos > L - 1) newPos -= L;

            data[idx] = [newPos, val];
            data.forEach(([p, v], i) => {
                if (i !== idx && p > pos && p <= newPos) {
                    data[i] = [p - 1, v];
                }
                if (i !== idx && p < pos && p >= newPos) {
                    data[i] = [p + 1, v];
                }
            });
        });
    }

    var [indexOfZero, _] = data.find(([p, v]) => v === 0);
    
    return sum(
        [1000, 2000, 3000].map((nth) => {
            let i = (nth + indexOfZero) % L;
            let [_, val] = data.find(([p, v]) => p === i);
            return val;
        })
    );
}

var p1_data = getData(PUZZLE_INPUT_PATH)(parser);
var p2_data = p1_data.map(([pos, val]) => [pos, val * 811589153]);

console.log('Part 1:', mixing(p1_data, 1));
console.log('Part 2:', mixing(p2_data, 10));
