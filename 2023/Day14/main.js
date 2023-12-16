import { getData, getPath, count, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split(""));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var ROWS = data.length;
var COLS = data[0].length;

function north(grid) {
    for (let i = 0; i < ROWS; i++) {
        for (let [r, row] of grid.entries()) {
            for (let [c, col] of row.entries()) {
                if (col === "O" && grid[r - 1] && grid[r - 1][c] === ".") {
                    grid[r][c] = ".";
                    grid[r - 1][c] = "O";
                }
            }
        }
    }
    return grid;
}

function east(grid) {
    for (let i = 0; i < COLS; i++) {
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS; r++) {
                if (grid[r][c] === "O" && grid[r][c + 1] === ".") {
                    grid[r][c] = ".";
                    grid[r][c + 1] = "O";
                }
            }
        }
    }
    return grid;
}

function south(grid) {
    return north(grid.reverse()).reverse();
}

function west(grid) {
    return east(grid.map((row) => row.reverse())).map((row) => row.reverse());
}

function cycle(grid) {
    return east(south(west(north(grid))));
}

function load(grid) {
    return sum(grid.map((row, i) => count("O", row) * (ROWS - i)));
}

function state(grid) {
    return grid.map((row) => row.filter((col) => col !== "#").join("")).join("");
}

function solveP2(grid) {
    var seen = new Map();
    var i = 0;
    while (true) {
        i++;
        grid = cycle(grid);
        let s = state(grid);
        if (seen.has(s)) {
            let repeat = i - seen.get(s);
            let rest = (1000000000 - i) % repeat;
            for (let j = 0; j < rest; j++) {
                grid = cycle(grid);
            }
            break;
        }
        seen.set(s, i);
    }
    return load(grid);
}

console.log("Part 1:", load(north(structuredClone(data))));
console.log("Part 2:", solveP2(structuredClone(data)));
