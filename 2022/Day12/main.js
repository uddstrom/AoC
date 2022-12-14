import { getData, getPath, min } from '../lib/utils.js';
import { aStar } from '../lib/aStar.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function toNumber(char) {
    if (char === 'S') return 0;
    if (char === 'E') return 25;
    return 'abcdefghijklmnopqrstuvwxyz'.indexOf(char);
}

function getNeighbors(M) {
    return function ({ r, c }) {
        var atMostOneHigher = (neighbor) => neighbor.elevation < M[r][c].elevation + 2;
        var neighbors = [];
        if (r > 0) neighbors.push(M[r - 1][c]); // top
        if (c + 1 < M[0].length) neighbors.push(M[r][c + 1]); // right
        if (r + 1 < M.length) neighbors.push(M[r + 1][c]); // bottom
        if (c > 0) neighbors.push(M[r][c - 1]); // left

        return neighbors.filter(atMostOneHigher);
    };
}

function parser(input) {
    var grid = input.split('\n').map((line, r) =>
        line.split('').map((elevation, c) => ({
            r, c,
            d: 1, // cost to neighbors
            g: Number.MAX_SAFE_INTEGER,
            elevation: toNumber(elevation),
            start: elevation === 'S',
            goal: elevation === 'E'
        }))
    );
    grid.forEach(row => row.forEach(node => node.neighbors = getNeighbors(grid)(node)));
    return grid;
}

function findShortestPath(start, goal) {
    var heuristic = (node, goal) => (Math.abs(node.r - goal.r) + Math.abs(node.c - goal.c));
    return aStar(start, goal, heuristic)?.length - 1 || Number.MAX_SAFE_INTEGER;
}

// Part 1
var grid = getData(PUZZLE_INPUT_PATH)(parser);
var start = grid.flat().find(n => n.start);
var goal = grid.flat().find(n => n.goal);
console.log('Part 1:', findShortestPath(start, goal));

// Part 2
var start_candidates = grid.flat().filter(n => n.elevation === 0).map(node => [node.r, node.c]);
var paths = start_candidates.map(([r, c]) => {
    let grid = getData(PUZZLE_INPUT_PATH)(parser);
    let start = grid[r][c];
    let goal = grid.flat().find(n => n.goal);
    return findShortestPath(start, goal);
});
console.log('Part 2:', min(paths));
