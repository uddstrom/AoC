import { getData, getPath, matrix } from '../lib/utils.js';
var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) =>
    input.split('\n').map((line) => line.split('').map(Number));

var range = (len) =>
    Array(len)
        .fill()
        .map((_, idx) => idx);

var _octoGrid = getData(PUZZLE_INPUT_PATH)(parser);
var _iterationFlashes = matrix(10, 10)(false);
var _flashCount = 0;
var _iteration = 0;

function updateNeighbors(r, c) {
    let flashes = new Array(8);
    let DR = [-1, -1, 0, 1, 1, 1, 0, -1];
    let DC = [0, 1, 1, 1, 0, -1, -1, -1];
    let inGrid = ({ rr, cc }) => 0 <= rr && rr < 10 && 0 <= cc && cc < 10;
    let neighbors = range(8)
        .map((i) => ({
            rr: r + DR[i],
            cc: c + DC[i],
        }))
        .filter(inGrid);

    neighbors.forEach(({ rr, cc }, idx) => {
        if (_octoGrid[rr][cc] !== 0) {
            _octoGrid[rr][cc]++;
            if (_octoGrid[rr][cc] === 10) {
                _octoGrid[rr][cc] = 0;
                _iterationFlashes[rr][cc] = true;
                flashes[idx] = true;
                _flashCount++;
            }
        }
    });

    neighbors.forEach(({ rr, cc }, dir) => {
        if (flashes[dir]) updateNeighbors(rr, cc);
    });
}

while (_iterationFlashes.flat().includes(false)) {
    let flashes = matrix(10, 10)(false);
    if (_iteration === 100) console.log('Part 1:', _flashCount);

    _octoGrid.forEach((row, r) =>
        row.forEach((_, c) => {
            _octoGrid[r][c]++;
            _iterationFlashes[r][c] = false;
            if (_octoGrid[r][c] === 10) {
                _iterationFlashes[r][c] = true;
                flashes[r][c] = true;
                _octoGrid[r][c] = 0;
                _flashCount++;
            }
        })
    );

    flashes.forEach((row, r) =>
        row.forEach((flash, c) => {
            if (flash) updateNeighbors(r, c);
        })
    );

    _iteration++;
}

console.log('Part 2:', _iteration);
