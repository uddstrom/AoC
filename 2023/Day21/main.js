import { getData, getPath } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split(""));
}

var grid = getData(PUZZLE_INPUT_PATH)(parser);

function solve(grid, curr, steps) {
    var next = new Set();
    while (curr.length > 0) {
        let [r, c] = curr.shift();
        for (let [dr, dc] of [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ]) {
            if (grid[r + dr][c + dc] === "." || grid[r + dr][c + dc] === "S") {
                next.add(`${r + dr},${c + dc}`);
            }
        }
    }
    if (steps - 1 === 0) return next.size;
    return solve(
        grid,
        [...next].map((n) => n.split(",").map(Number)),
        steps - 1
    );
}

var start_r = grid.findIndex((row) => row.includes("S"));
var start_c = grid[start_r].indexOf("S");

var p1 = solve(grid, [[start_r, start_c]], 64);

console.log("Part 1:", p1);
console.log("Part 2:");
