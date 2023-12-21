import { PrioQ } from "../lib/PrioQ.js";
import { getData, getPath, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split("").map(Number));
}

function solve(grid, start, goal, p2) {
    var compareFn = (n1, n2) => n1.g - n2.g;
    var id = ({ r, c, dir, steps }) => `${r},${c},${dir},${steps}`;

    var openSet = new PrioQ(compareFn, id);
    var visited = new Map();

    start.g = 0;
    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();
        if (current.r === goal.r && current.c === goal.c) return current.g;
        visited.set(id(current), current.g);

        getNeighbors(grid, current, p2).forEach((neighbor) => {
            if (!visited.has(id(neighbor)) || neighbor.g < visited.get(id(neighbor))) {
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }
}

function getNeighbors(grid, node, p2) {
    var inGrid = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
    return [
        [-1, 0], // up
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
    ]
        .map(([dr, dc], dir) => {
            var r = node.r + dr;
            var c = node.c + dc;
            var g = node.g + (grid[r] && grid[r][c]);
            var steps = node.dir === dir ? node.steps + 1 : 1;

            // part 2, changeing direction -> take 4 steps at once.
            var rr = node.r + dr * 4;
            var cc = node.c + dc * 4;
            var gg = g + sum([1, 2, 3].map((i) => grid[r + i * dr] && grid[r + i * dr][c + i * dc]));

            var isntReverse = dir !== (node.dir + 2) % 4;
            var isValidStepP1 = inGrid(r, c) && (node.steps < 3 || dir !== node.dir);
            var isValidStepP2a = inGrid(r, c) && dir === node.dir && steps <= 10;
            var isValidStepP2b = inGrid(rr, cc) && dir !== node.dir && node.steps >= 4;

            if (!p2 && isntReverse && isValidStepP1) return { r, c, dir, steps, g };
            if (p2 && isntReverse && isValidStepP2a) return { r, c, dir, steps, g };
            if (p2 && isntReverse && isValidStepP2b) return { r: rr, c: cc, dir, steps: 4, g: gg };
        })
        .filter(Boolean);
}

var grid = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = grid.length;
var COLS = grid[0].length;

var start = { r: 0, c: 0, dir: 1, steps: 0, g: 0 };
var goal = { r: ROWS - 1, c: COLS - 1 };

var startTime = Date.now();
var [p1, p2] = [false, true].map((p2) => solve(grid, start, goal, p2));

console.log("Part 1:", p1);
console.log("Part 2:", p2);
console.log(Date.now() - startTime);
