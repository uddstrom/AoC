import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((row) => row.trim().split(' '))
        .map(([_, val]) => Number(val));
}

function draw(CRT) {
    var rows = Array(6)
        .fill()
        .map((_) => '');
    for (let i = 0; i < CRT.length; i++) {
        let row = Math.floor(i / 40);
        rows[row] = rows[row].concat(CRT[i]);
    }
    console.log(rows);
}

// 20th, 60th, 100th, 140th, 180th, and 220th cycles

var data = getData(PUZZLE_INPUT_PATH)(parser); // [1, 2, NaN, 3, 4, ...]

var measurPoints = [20, 60, 100, 140, 180, 220];
var measures = [];
var cycle = 1;
var x = 1;
var adding = false;
var CRT = rng(6 * 40).map((_) => '.');

while (data.length > 0) {
    if (measurPoints.includes(cycle)) {
        measures.push(x * cycle);
    }
    if (adding) {
        x += val;
        adding = false;
    } else {
        var val = data.shift();
        if (Number.isNaN(val)) {
            /* noop, continue */
        } else {
            adding = true;
        }
    }
    cycle++;
}

console.log('Part 1:', sum(measures));
console.log('Part 2:', draw(CRT));
