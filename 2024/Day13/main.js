import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    // Button A: X+<ax>, Y+<ay>
    // Button B: X+<bx>, Y+<by>
    // Prize: X=<px>, Y=<py>
    return input.split('\n\n').map((machine) => {
        var [A, B, Prize] = machine.split('\n');
        var [_, ax, ay] = A.match(/Button A: X\+(\d+), Y\+(\d+)/);
        var [_, bx, by] = B.match(/Button B: X\+(\d+), Y\+(\d+)/);
        var [_, px, py] = Prize.match(/Prize: X=(\d+), Y=(\d+)/);
        return { px: Number(px), py: Number(py), ax: Number(ax), ay: Number(ay), bx: Number(bx), by: Number(by) };
    });
}

var A = ({ px, py, ax, ay, bx, by }) => (px - bx * ((py * ax - px * ay) / (ax * by - ay * bx))) / ax;
var B = ({ px, py, ax, ay, bx, by }) => (py * ax - px * ay) / (ax * by - ay * bx);
var collectPrize = (machine) => {
    var a = A(machine); // number of pushes on button A.
    var b = B(machine); // number of pushes on button B.
    return Number.isInteger(a) && Number.isInteger(b) ? a * 3 + b : 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var p1 = sum(data.map(collectPrize));
var corr = 10000000000000;
var p2 = sum(data.map(({ px, py, ax, ay, bx, by }) => collectPrize({ px: px + corr, py: py + corr, ax, ay, bx, by })));

console.log('Part 1:', p1);
console.log('Part 2:', p2);
