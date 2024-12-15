import { count, getData, getPath, rng } from "../lib/utils.js";
import { trampoline } from "../lib/fn.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((row) => row.split("").map((col) => col));
}

var DIRS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];
var GUARDS = ["^", ">", "v", "<"];

var GRID = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = GRID.length;
var COLS = GRID[0].length;

var isGuard = (char) => GUARDS.includes(char);
var inGrid = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

var START_ROW = GRID.findIndex((row) => row.some((col) => isGuard(col)));
var START_COL = GRID.find((row) => row.some((col) => isGuard(col))).findIndex((col) => isGuard(col));
var START_DIR = GUARDS.indexOf(GRID[START_ROW][START_COL]);

var p1 = trampoline(function patrol(r, c, dir, steps = new Set()) {
    if (!inGrid(r, c)) return steps.size;

    steps.add(`${r},${c}`);
    var [dr, dc] = DIRS[dir];
    var next = GRID[r + dr] && GRID[r + dr][c + dc];
    while (next === "#") {
        dir = (dir + 1) % 4; // turn 90 degrees clockwise
        var [dr, dc] = DIRS[dir];
        next = GRID[r + dr][c + dc];
    }
    return () => patrol(r + dr, c + dc, dir, steps);
});

var isLoop = trampoline(function patrol(grid, r, c, dir, steps = new Set()) {
    if (!inGrid(r, c)) return false;
    if (steps.has(`${r},${c},${dir}`)) return true;

    steps.add(`${r},${c},${dir}`);
    var [dr, dc] = DIRS[dir];
    var next = grid[r + dr] && grid[r + dr][c + dc];
    while (next === "#") {
        dir = (dir + 1) % 4; // turn 90 degrees clockwise
        var [dr, dc] = DIRS[dir];
        next = grid[r + dr][c + dc];
    }
    return () => patrol(grid, r + dr, c + dc, dir, steps);
});

function obstruct(GRID, r, c) {
    var grid = structuredClone(GRID);
    grid[r][c] = "#";
    return grid;
}

var p2 = count(
    true,
    rng(ROWS).flatMap((r) =>
        rng(COLS).map((c) => GRID[r][c] === "." && isLoop(obstruct(GRID, r, c), START_ROW, START_COL, START_DIR))
    )
);

console.log("Part 1:", p1(START_ROW, START_COL, START_DIR));
console.log("Part 2:", p2);
