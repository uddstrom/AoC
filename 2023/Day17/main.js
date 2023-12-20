import { PrioQ } from "../lib/PrioQ.js";
import { getData, getPath, rng } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split("").map(Number));
}

function solve(grid, start, goal, h, p2) {
    var compareFn = (n1, n2) => n1.f - n2.f;
    var id = ({ r, c, dir, steps }) => `${r},${c},${dir},${steps}`;

    var openSet = new PrioQ(compareFn, id);
    var visited = new Map();

    start.g = 0;
    start.f = h(start, goal);

    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();

        if (current.r === goal.r && current.c === goal.c) return current.g;

        visited.set(id(current), current.g);

        getNeighbors(grid, current, p2).forEach((neighbor) => {
            if (!visited.has(id(neighbor)) || neighbor.g < visited.get(id(neighbor))) {
                neighbor.f = neighbor.g + h(neighbor, goal);
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }
}

function getNeighbors(grid, node, p2) {
    var inGrid = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
    var DR = [-1, 0, 1, 0];
    var DC = [0, 1, 0, -1];
    var N = rng(4).map((dir) => {
        if (p2) {
            // Part 2
            let r = node.r,
                c = node.c,
                g = node.g;

            if (node.dir === dir && node.steps < 10) {
                r += DR[dir];
                c += DC[dir];
                if (inGrid(r, c)) {
                    g += grid[r][c];
                    return { r, c, dir, steps: node.steps + 1, g };
                }
            }
            if (dir !== node.dir && dir !== (node.dir + 2) % 4) {
                rng(4).forEach((_) => {
                    r += DR[dir];
                    c += DC[dir];
                    g += inGrid(r, c) ? grid[r][c] : 0;
                });
                if (inGrid(r, c)) {
                    return { r, c, dir, steps: 4, g };
                }
            }
        } else {
            // Part 1
            if ((dir !== node.dir && dir !== (node.dir + 2) % 4) || (node.dir === dir && node.steps < 3)) {
                let r = node.r + DR[dir];
                let c = node.c + DC[dir];
                if (inGrid(r, c)) {
                    return {
                        r,
                        c,
                        dir,
                        steps: node.dir === dir ? node.steps + 1 : 1,
                        g: node.g + grid[r][c],
                    };
                }
            }
        }
    });
    return N.filter(Boolean);
}

var grid = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = grid.length;
var COLS = grid[0].length;

var start = {
    r: 0,
    c: 0,
    dir: 0,
    steps: 0,
    g: 0,
};

var goal = {
    r: ROWS - 1,
    c: COLS - 1,
};

var startTime = Date.now();
var h = (node, goal) => Math.abs(node.r - goal.r) + Math.abs(node.c - goal.c);
var [p1, p2] = [false, true].map((p2) => solve(grid, start, goal, h, p2));

console.log("Part 1:", p1);
console.log("Part 2:", p2);
console.log(Date.now() - startTime);
