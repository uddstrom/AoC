import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map(line => line.split('').map(Number));
}

var TOPO_MAP = getData(PUZZLE_INPUT_PATH)(parser);

function bfs(root, p2 = false) {
    function search(Q, V = new Set(), score = 0) {
        if (Q.length === 0) { return score; }
        let v = Q.pop();
        V.add(v.id);
        if (v.h === 9) {
            return search(Q, V, score + 1);
        }
        neighbours(v).forEach((w) => {
            if (!V.has(w.id) || p2) {
                V.add(w.id);
                Q.push(w);
            }
        });
        return search(Q, V, score);
    }
    return search([root]);
}

function neighbours({ r, c, h }) {
    return [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dr, dc]) => {
        var neighbour = TOPO_MAP[r + dr] && TOPO_MAP[r + dr][c + dc];
        if (neighbour - h === 1) {
            return { r: r + dr, c: c + dc, h: neighbour, id: `${r + dr},${c + dc}` };
        }
    }).filter(Boolean)
}

var trailHeadsScores = TOPO_MAP.flatMap((row, r) => row.map((col, c) => col === 0 ? bfs({ r, c, h: 0, id: `${r},${c}` }) : 0));
var trailHeadsRates = TOPO_MAP.flatMap((row, r) => row.map((col, c) => col === 0 ? bfs({ r, c, h: 0, id: `${r},${c}` }, true) : 0));

console.log('Part 1:', sum(trailHeadsScores));
console.log('Part 2:', sum(trailHeadsRates));
