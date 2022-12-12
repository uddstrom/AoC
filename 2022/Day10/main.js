import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((row) => row.trim().split(' '))
        .map(([_, val]) => Number(val));
}

function draw(CRT) {
    console.log(CRT.slice(0,40).join(''));
    console.log(CRT.slice(40,80).join(''));
    console.log(CRT.slice(80,120).join(''));
    console.log(CRT.slice(120,160).join(''));
    console.log(CRT.slice(160,200).join(''));
    console.log(CRT.slice(200,240).join(''));
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [1, 2, NaN, 3, 4, ...]

var measurPoints = [20, 60, 100, 140, 180, 220];
var measures = [];
var cycle = 0;
var x = 1;
var adding = false;
var CRT = rng(6 * 40).map((_) => ' ');
var val;
while (data.length > 0) {
    if (measurPoints.includes(cycle+1)) {
        measures.push(x * (cycle+1));
    }
    var spritePos = (cycle) % 40;
    if (spritePos >= x-1 && spritePos <= x+1) {
        CRT[cycle] = '#';
    }
    if (adding) {
        x += val;
        adding = false;
    } else {
        val = data.shift();
        if (!Number.isNaN(val)) 
            adding = true;
    }
    cycle++;
}

console.log('Part 1:', sum(measures));
console.log('Part 2:'); draw(CRT);
