import { makeGrid } from '../lib/grid.js';
import { getData, getPath, range, rng } from '../lib/utils.js';
import { PrioQ } from '../lib/PrioQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(',').map(Number));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

function path(v, p = []) {
    if (!v.parent) return p;
    return path(v.parent, [v, ...p]);
}

function dijk(bytesToSimulate) {
    var prioFn = (v, w) => v.dist - w.dist;
    var id = ({ x, y }) => `${x},${y}`;
    var neighbors = ({ x, y, dist }, G) => {
        return [[-1, 0], [0, 1], [1, 0], [0, -1]]
            .map(([dy, dx]) => {
                return G[y + dy] && G[y + dy][x + dx] === '.'
                    ? { x: x + dx, y: y + dy, dist: dist + 1 }
                    : undefined;
            })
            .filter(Boolean);
    }

    var G = makeGrid(71, 71, '.');
    rng(bytesToSimulate).forEach((n) => {
        var [x, y] = data[n];
        G[y][x] = '#';
    });

    var start = { x: 0, y: 0, dist: 0 };
    var Q = new PrioQ(prioFn, id);
    var V = new Map();
    Q.push(start);
    V.set(id(start), start);

    while (!Q.empty()) {
        let v = Q.pop();
        if (v.x === 70 && v.y === 70) return path(v);
        neighbors(v, G).forEach((w) => {
            if (!V.has(id(w)) || w.dist < V.get(id(w)).dist) {
                w.parent = v;
                V.set(id(w), w);
                Q.push(w);
            }
        });
    }
}

function findFirstBlocker() {
    for (let i of range(1025, data.length)) {
        if (dijk(i) === undefined) {
            let [x, y] = data[i - 1];
            return `${x},${y}`;
        }
    }
}

console.log('Part 1:', dijk(1024).length);
console.log('Part 2:', findFirstBlocker());
