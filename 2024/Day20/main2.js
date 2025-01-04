import { getData, getPath } from '../lib/utils.js';
import { HeapQ } from '../lib/HeapQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(''));
}

var GRID = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = GRID.length;
var COLS = GRID[0].length;

var sr = GRID.findIndex(row => row.some(c => c === 'S'));
var sc = GRID[sr].indexOf('S');
var er = GRID.findIndex(row => row.some(c => c === 'E'));
var ec = GRID[er].indexOf('E');

var id = ({ r, c }) => `${r},${c}`;

function dijk(G, start, goal) {
    var Q = new HeapQ(id)
    var V = new Map();
    Q.push(start);
    V.set(id(start), 0);
    while (!Q.empty()) {
        let v = Q.pop();
        if (v.r === goal.r && v.c === goal.c) {
            return v.dist;
        }
        neighbors(v).forEach((w) => {
            if (!V.has(id(w)) || w.dist < V.get(id(w)).dist) {
                V.set(id(w), w.dist);
                Q.push(w);
            }
        })
    }
    function neighbors({ r, c, dist }) {
        return [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dr, dc]) => {
            if (G[r + dr][c + dc] !== '#') {
                return { r: r + dr, c: c + dc, dist: dist + 1 };
            }
        }).filter(Boolean);
    }
}

var start = { r: sr, c: sc, dist: 0 };
var goal = { r: er, c: ec };
var baseline = dijk(GRID, start, goal);
var cheets = 0;
for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
        if (GRID[r][c] === '#') {
            let G = structuredClone(GRID);
            G[r][c] = '.';
            let dist = dijk(G, start, goal);
            if (baseline - dist >= 100) {
                cheets++;
            }
        }
    }
}

console.log('Part 1:', cheets);
console.log('Part 2:');

