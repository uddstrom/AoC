import { getData, getPath } from '../lib/utils.js';
import { PrioQ } from '../lib/PrioQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

var parser = (input) => input.split('\n').map((line) => line.split(''));

var maze = getData(PUZZLE_INPUT_PATH)(parser);

var [sr, sc] = [maze.findIndex(row => row.some(col => col === 'S')), maze.find(row => row.some(col => col === 'S')).indexOf('S')];
var goal = [maze.findIndex(row => row.some(col => col === 'E')), maze.find(row => row.some(col => col === 'E')).indexOf('E')];

var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
var id = ({ r, c, dir }) => `${r},${c},${dir}`;
var compareFn = ({ dist: d1 }, { dist: d2 }) => d1 - d2;
var path = (v) => v.parent ? [v, ...path(v.parent)] : [v];

function bfs(start, [gr, gc]) {
    var best = Number.MAX_VALUE;
    var P = []; // paths
    var Q = new PrioQ(compareFn, id);
    var V = new Map();
    V.set(id(start), start);
    Q.push(start);
    while (!Q.empty()) {
        let v = Q.pop();
        if (v.r === gr && v.c === gc) {
            if (v.dist <= best) {
                best = v.dist;
                P.push(path(v));
            }
        } else {
            neighbors(v).forEach(w => {
                if (!V.has(id(w)) || v.dist <= V.get(id(w)).dist) {
                    V.set(id(w), w);
                    Q.push(w);
                }
            });
        }
    }
    return P;
}

function neighbors(v) {
    // stand still and rotate OR take a step in dir we are facing
    var { r, c, dir, dist } = v;
    var [dr, dc] = DIRS[dir];
    return DIRS.map(([ddr, ddc], idx) => {
        if (idx === dir && maze[r + dr][c + dc] !== '#') {
            return { r: r + dr, c: c + dc, dir, dist: dist + 1, parent: v };
        }
        if (Math.abs(dir - idx) !== 2 && maze[r + ddr][c + ddc] !== '#') {
            return { r, c, dir: idx, dist: dist + 1000, parent: v };
        }
    }).filter(Boolean);
}

var paths = bfs({ r: sr, c: sc, dir: 1, dist: 0 }, goal);
var p2 = new Set([...paths.flatMap((path) => path.map(v => `${v.r},${v.c}`))]).size;

console.log('Part 1:', paths[0][0].dist);
console.log('Part 2:', p2);
