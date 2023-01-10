import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((n, i) => {
        return [i, Number(n)]; // [position, value]
    });
}

var p1_data = getData(PUZZLE_INPUT_PATH)(parser);
var p2_data = p1_data.map(([pos, val]) => [pos, val * 811589153]);

var L = p1_data.length;

p1_data.forEach(([pos, val], idx) => {
    let steps = val;
    while (steps < 0) {
        steps += L - 1;
    }

    let newPos = pos + steps;
    while (newPos > L - 1) {
        newPos -= L - 1;
    }

    p1_data[idx] = [newPos, val];
    p1_data.forEach(([p, v], i) => {
        if (i !== idx && p > pos && p <= newPos) {
            p1_data[i] = [p - 1, v];
        }
        if (i !== idx && p < pos && p >= newPos) {
            p1_data[i] = [p + 1, v];
        }
    });
});

var [indexOfZero, _] = p1_data.find(([p, v]) => v === 0);
var p1 = sum(
    [1000, 2000, 3000].map((nth) => {
        let i = (nth + indexOfZero) % L;
        let [_, val] = p1_data.find(([p, v]) => p === i);
        return val;
    })
);

console.log('Part 1:', p1);

for (let index = 0; index < 10; index++) {
    console.log('round', index);
    p2_data.forEach(([pos, val], idx) => {
        let steps = val;
        while (steps < 0) {
            steps += L - 1;
        }

        let newPos = pos + steps;
        while (newPos > L - 1) {
            newPos -= L - 1;
        }

        p2_data[idx] = [newPos, val];
        p2_data.forEach(([p, v], i) => {
            if (i !== idx && p > pos && p <= newPos) {
                p2_data[i] = [p - 1, v];
            }
            if (i !== idx && p < pos && p >= newPos) {
                p2_data[i] = [p + 1, v];
            }
        });
    });
}

var [indexOfZero, _] = p2_data.find(([p, v]) => v === 0);
var p2 = sum(
    [1000, 2000, 3000].map((nth) => {
        let i = (nth + indexOfZero) % L;
        let [_, val] = p2_data.find(([p, v]) => p === i);
        return val;
    })
);

console.log('Part 2:', p2);
