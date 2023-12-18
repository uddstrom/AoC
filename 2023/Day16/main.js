import { getData, getPath, max, rng } from "../lib/utils.js";
import { not, trampoline } from "../lib/fn.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split(""));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var ROWS = data.length;
var COLS = data[0].length;
var U = 0,
    R = 1,
    D = 2,
    L = 3;
var DR = [-1, 0, 1, 0];
var DC = [0, 1, 0, -1];
var DIRS = {
    ".": [[U], [R], [D], [L]],
    "/": [[R], [U], [L], [D]],
    "\\": [[L], [D], [R], [U]],
    "-": [[L, R], [R], [L, R], [L]],
    "|": [[U], [U, D], [D], [U, D]],
};

var solve = trampoline(function solve(beams, grid, visited = new Set()) {
    var seen = ([r, c, dir]) => visited.has(`${r},${c},${dir}`);
    var inGrid = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

    function update([r, c, dir]) {
        var rr = r + DR[dir];
        var cc = c + DC[dir];
        var newDir = inGrid(rr, cc) ? DIRS[grid[rr][cc]][dir] : [];
        return newDir.map((dir) => [rr, cc, dir]);
    }

    if (beams.length === 0) {
        return new Set([...visited].map((beam) => `${beam.split(",")[0]}, ${beam.split(",")[1]}`)).size;
    }

    beams = beams.flatMap(update).filter(not(seen));
    beams.forEach(([r, c, dir]) => visited.add(`${r},${c},${dir}`));

    return function () {
        return solve(beams, grid, visited);
    };
});

var p2 = max([
    ...rng(COLS).map((c) => solve([[-1, c, D]], data)), // starting top, going down
    ...rng(COLS).map((c) => solve([[ROWS, c, U]], data)), // starting bottom, going up
    ...rng(ROWS).map((r) => solve([[r, -1, R]], data)), // starting left, going right
    ...rng(ROWS).map((r) => solve([[r, COLS, L]], data)), // starting right, going left
]);

console.log("Part 1:", solve([[0, -1, R]], data));
console.log("Part 2:", p2);
