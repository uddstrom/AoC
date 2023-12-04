import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(''));
}

function isPartNumber(row, c_start, c_end, grid) {
    var above = grid[row - 1]?.slice(c_start > 0 ? c_start - 1 : c_start, c_end + 2).some((x) => x !== '.');
    var below = grid[row + 1]?.slice(c_start > 0 ? c_start - 1 : c_start, c_end + 2).some((x) => x !== '.');
    var left = grid[row][c_start - 1] && grid[row][c_start - 1] !== '.';
    var right = grid[row][c_end + 1] && grid[row][c_end + 1] !== '.';
    return above || below || left || right;
}

function setGears(n, row, c_start, c_end, grid) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = c_start - 1; c <= c_end + 1; c++) {
            if (grid[r] && grid[r][c] === '*') {
                if (gears.has(`${r},${c}`)) {
                    gears.set(`${r},${c}`, [...gears.get(`${r},${c}`), Number(n)]);
                } else {
                    gears.set(`${r},${c}`, [Number(n)]);
                }
            }
        }
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = 0;
var gears = new Map();

var ROWS = data.length;
var COLS = data[0].length;

for (let r = 0; r < ROWS; r++) {
    let n = '';
    let c_start = 0;
    for (let c = 0; c < COLS; c++) {
        if (isNaN(data[r][c])) {
            if (n.length > 0) {
                p1 += isPartNumber(r, c_start, c - 1, data) ? Number(n) : 0;
                setGears(n, r, c_start, c - 1, data);
                n = '';
            }
        } else {
            if (n === '') c_start = c;
            n += data[r][c];
            if (c === COLS - 1) {
                p1 += isPartNumber(r, c_start, c, data) ? Number(n) : 0;
                setGears(n, r, c_start, c, data);
            }
        }
    }
}

var p2 = sum(
    [...gears.entries()].map(([_, partnumbers]) => (partnumbers.length === 2 ? partnumbers[0] * partnumbers[1] : 0))
);

console.log('Part 1:', p1); // 532331
console.log('Part 2:', p2); // 82301120
