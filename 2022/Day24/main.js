import { getData, getPath, rng } from '../lib/utils.js';
import { PrioQ } from '../lib/aStar.js';
import { makeGrid } from '../lib/grid.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var ROWS, COLS;

function parser(input) {
    var isBlizzard = (x) => '<>v^'.includes(x);
    var start, goal;
    var blizzards = new Set();
    input.split('\n').forEach((row, r, rows) => {
        ROWS = rows.length;
        row.split('').forEach((col, c, cols) => {
            COLS = cols.length;
            if (r === 0 && col === '.') start = [r, c];
            if (r === rows.length - 1 && col === '.') goal = [r, c];
            if (isBlizzard(col)) blizzards.add({ r, c, dir: col });
        });
    });
    return [start, goal, blizzards];
}

function show([start_r, start_c], [goal_r, goal_c], blizzards) {
    var grid = makeGrid(ROWS, COLS, '.');
    var count = makeGrid(ROWS, COLS, 0);
    rng(ROWS).forEach((r) => {
        rng(COLS).forEach((c) => {
            if (c === 0 || c === COLS - 1 || r === 0 || r === ROWS - 1) grid[r][c] = '#';
        });
    });
    grid[start_r][start_c] = 'S';
    grid[goal_r][goal_c] = 'G';
    blizzards.forEach(({ r, c, dir }) => {
        count[r][c] += 1;
        grid[r][c] = count[r][c] > 1 ? count[r][c] : dir;
    });
    grid.forEach((row) => console.log(row.join('')));
}

var DIRS = [
    [-1, 0], // N
    [1, 0], // S
    [0, -1], // W
    [0, 1], // E
];

function simulate(B) {
    var B2 = new Set();
    B.forEach(({ r, c, dir }) => {
        if (dir === '>') c = c === COLS - 2 ? 1 : c + 1;
        if (dir === '<') c = c === 1 ? COLS - 2 : c - 1;
        if (dir === '^') r = r === 1 ? ROWS - 2 : r - 1;
        if (dir === 'v') r = r === ROWS - 2 ? 1 : r + 1;
        B2.add({ r, c, dir });
    });
    return B2;
}

function aStar(start, goal, blizzards) {
    console.log('INITIAL STATE');
    show(start, goal, blizzards);
    rng(5).forEach((n) => {
        blizzards = simulate(blizzards);
        console.log('RUNDA ', n + 1);
        show(start, goal, blizzards);
    });
}

var [start, goal, blizzards] = getData(PUZZLE_INPUT_PATH)(parser);
var startTime = Date.now();
console.log('Part 1:', aStar(start, goal, blizzards));
console.log('Part 2:');
console.log('Completed in (ms):', Date.now() - startTime);
