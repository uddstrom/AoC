import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(''));
}

function isPartNumber(row, c_start, c_end, grid) {
    var above = grid[row - 1]?.slice(c_start > 0 ? c_start - 1 : c_start, c_end + 1).some((x) => x !== '.');
    var below = grid[row + 1]?.slice(c_start > 0 ? c_start - 1 : c_start, c_end + 1).some((x) => x !== '.');
    var left = grid[row][c_start - 1] && grid[row][c_start - 1] !== '.';
    var right = grid[row][c_end] && grid[row][c_end] !== '.';
    return above || below || left || right;
}

function GetNumber(n1, n2, n3) {
    var n = '';
    if (!isNaN(n1)) n += n1;
    if (!isNaN(n2)) n += n2;
    if (!isNaN(n3)) n += n3;
    return Number(n);
}

function gearRatio(r, c, grid) {
    function checkRow(r) {
        // 123 - ett partnr
        if (!isNaN(grid[r][c - 1]) && !isNaN(grid[r][c]) && !isNaN(grid[r][c + 1])) {
            return [GetNumber(grid[r][c - 1], grid[r][c], grid[r][c + 1])];
        }

        // .12 - ett partnr
        if (isNaN(grid[r][c - 1]) && !isNaN(grid[r][c]) && !isNaN(grid[r][c + 1])) {
            return [GetNumber(grid[r][c], grid[r][c + 1], grid[r][c + 2])];
        }
        // 1.2 - två partnr
        if (!isNaN(grid[r][c - 1]) && isNaN(grid[r][c]) && !isNaN(grid[r][c + 1])) {
            return [
                GetNumber(grid[r][c - 3], grid[r][c - 2], grid[r][c - 1]),
                GetNumber(grid[r][c + 1], grid[r][c + 2], grid[r][c + 3]),
            ];
        }
        // 12. - ett partnr
        if (!isNaN(grid[r][c - 1]) && !isNaN(grid[r][c]) && isNaN(grid[r][c + 1])) {
            return [GetNumber(grid[r][c - 2], grid[r][c - 1], grid[r][c])];
        }

        // ..1 - ett partnr
        if (isNaN(grid[r][c - 1]) && isNaN(grid[r][c]) && !isNaN(grid[r][c + 1])) {
            return [GetNumber(grid[r][c + 1], grid[r][c + 2], grid[r][c + 3])];
        }
        // .1. - ett partnr
        if (isNaN(grid[r][c - 1]) && !isNaN(grid[r][c]) && isNaN(grid[r][c + 1])) {
            return [Number(grid[r][c])];
        }
        // 1.. - ett partnr
        if (!isNaN(grid[r][c - 1]) && isNaN(grid[r][c]) && isNaN(grid[r][c + 1])) {
            return [GetNumber(grid[r][c - 3], grid[r][c - 2], grid[r][c - 1])];
        }

        // ... - inget partnr
        if (isNaN(grid[r][c - 1]) && isNaN(grid[r][c]) && isNaN(grid[r][c + 1])) {
            return [];
        }
    }

    if (grid[r][c] !== '*') return 0;

    var above = checkRow(r - 1);
    var below = checkRow(r + 1);
    var left = !isNaN(grid[r][c - 1]) ? [GetNumber(grid[r][c - 3], grid[r][c - 2], grid[r][c - 1])] : [];
    var right = !isNaN(grid[r][c + 1]) ? [GetNumber(grid[r][c + 1], grid[r][c + 2], grid[r][c + 3])] : [];

    var partnumbers = [...above, ...below, ...left, ...right];

    return partnumbers.length === 2 ? partnumbers[0] * partnumbers[1] : 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = 0;
var p2 = 0;
for (let r = 0; r < data.length; r++) {
    let n = '';
    let c_start = 0;
    for (let c = 0; c < data[0].length; c++) {
        p2 += gearRatio(r, c, data);
        if (isNaN(data[r][c])) {
            if (n.length > 0) {
                p1 += isPartNumber(r, c_start, c, data) ? Number(n) : 0;
                n = '';
            }
        } else {
            if (n === '') c_start = c;
            n += data[r][c];
            if (c === data[r].length - 1) {
                p1 += isPartNumber(r, c_start, c + 1, data) ? Number(n) : 0;
            }
        }
    }
}

console.log('Part 1:', p1); // 532331
console.log('Part 2:', p2); // 82301120
