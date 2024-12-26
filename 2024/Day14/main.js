import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => {
        var [p, v] = line.split(' ');
        return {
            p: p.substring(2).split(',').map(Number),
            v: v.substring(2).split(',').map(Number)
        };
    });
}

function print(robots) {
    var grid = new Array(H).fill().map((_) => new Array(W).fill().map((_) => 0));
    robots.forEach(([x, y]) => grid[y][x] = grid[y][x] + 1);
    grid = grid.map((row) => row.map((col) => col === 0 ? '.' : col));
    grid.forEach(line => console.log(line.join('')));
}

function findEasterEgg(robots, t = 0) {
    var R = move(robots, t);
    if (R.every(([x, y]) => R.filter(([xx, yy]) => x === xx && y === yy).length === 1)) {
        print(R);
        return t;
    }
    return findEasterEgg(robots, t + 1);
}

var W = 101;
var H = 103;

var move = (robots, T) => robots
    .map(({ p: [px, py], v: [vx, vy] }) => [(px + vx * T) % W, (py + vy * T) % H])
    .map(([x, y]) => [x < 0 ? W + x : x, y < 0 ? H + y : y]);

var Q1 = (robots) => robots.filter(([x, y]) => x < Math.floor(W / 2) && y < Math.floor(H / 2)).length;
var Q2 = (robots) => robots.filter(([x, y]) => x > Math.floor(W / 2) && y < Math.floor(H / 2)).length;
var Q3 = (robots) => robots.filter(([x, y]) => x < Math.floor(W / 2) && y > Math.floor(H / 2)).length;
var Q4 = (robots) => robots.filter(([x, y]) => x > Math.floor(W / 2) && y > Math.floor(H / 2)).length;

var ROBOTS = getData(PUZZLE_INPUT_PATH)(parser);

var R = move(ROBOTS, 100);
var t = findEasterEgg(ROBOTS);

console.log('Part 1:', Q1(R) * Q2(R) * Q3(R) * Q4(R));
console.log('Part 2:', t);
