import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(''));
}

var GRID = getData(PUZZLE_INPUT_PATH)(parser);

var sr = GRID.findIndex(row => row.some(c => c === 'S'));
var sc = GRID[sr].indexOf('S');
var er = GRID.findIndex(row => row.some(c => c === 'E'));
var ec = GRID[er].indexOf('E');
var goal = { r: er, c: ec };
var start = { r: sr, c: sc, dist: 0 };

var id = ({ r, c }) => `${r},${c}`;
var distance = (from, to) => Math.abs(to.r - from.r) + Math.abs(to.c - from.c);

function bfs(G, start, goal) {
    var Q = [];
    var V = new Map();
    Q.push(start);
    V.set(id(start), 0);
    while (Q.length > 0) {
        let v = Q.shift();
        if (v.r === goal.r && v.c === goal.c) {
            return path(v);
        }
        neighbors(v).forEach((w) => {
            if (!V.has(id(w))) {
                V.set(id(w), w.dist);
                Q.push(w);
            }
        })
    }
    function neighbors(v) {
        return [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dr, dc]) => {
            if (G[v.r + dr][v.c + dc] !== '#') {
                return { r: v.r + dr, c: v.c + dc, dist: v.dist + 1, parent: v };
            }
        }).filter(Boolean);
    }
}

function path(v) {
    var P = [];
    while (v.parent) {
        P.push(v);
        v = v.parent;
    }
    P.push(v);
    return P;
}


function findCheets(maxDistance) {
    var basePath = bfs(GRID, start, goal);
    var cheets = new Map();
    basePath.forEach((v) => {
        var targets = basePath.filter(w => w.dist > v.dist && distance(v, w) <= maxDistance);
        targets.forEach(target => {
            let saving = target.dist - v.dist - distance(v, target);
            if (saving >= 100) cheets.set(`${v.r},${v.c},${target.r},${target.c}`, saving);
        });
    });
    return cheets.size;
}

console.log('Part 1:', findCheets(2));
console.log('Part 2:', findCheets(20));
