import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(''));
}

// BFS to find all regions. Return the regions perimiter and visited plots.
function bfs(start) {
    var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    // Return the neighbours of a plot, ie growing the same plant.
    function neighbours({ r, c, plant }) {
        return DIRS.map(([dr, dc]) => {
            var plot_type = FARM_MAP[r + dr] && FARM_MAP[r + dr][c + dc];
            if (plot_type === plant) {
                return { r: r + dr, c: c + dc, dr, dc, plant: plot_type, id: `${r + dr},${c + dc}` };
            }
        }).filter(Boolean)
    }

    function search(Q, V, perimiter = 0, region_edges = []) {
        if (Q.length === 0) {
            return [perimiter, toNumberOfSides(region_edges), V];
        }
        var v = Q.pop();
        var N = neighbours(v);
        N.forEach((w) => {
            if (!V.has(w.id)) {
                V.add(w.id);
                Q.push(w);
            }
        });

        // If a plot does not have a neighbour in some direction, it is a region edge.
        DIRS.filter(([r, c]) => !N.some(({ dr, dc }) => r === dr && c === dc))
            .forEach(([dr, dc]) => region_edges.push({ r: v.r, c: v.c, dr, dc }));

        return search(Q, V, perimiter + 4 - N.length, region_edges);
    }

    return search([start], new Set([start.id]));
}

// Converts region edges to coherent region sides.
function toNumberOfSides(region_edges) {
    let sides = 0;
    // bfs to find side 'paths'
    let visited_edges = new Set();
    while (region_edges.length > 0) {
        let v = region_edges.pop();
        if (!visited_edges.has(`${v.r},${v.c},${v.dr},${v.dc}`)) {
            let Q = [v];
            while (Q.length > 0) {
                let w = Q.pop();
                visited_edges.add(`${w.r},${w.c},${w.dr},${w.dc}`)
                // find the neighbours of v.
                let N = region_edges.filter(({ r, c, dr, dc }) => {
                    return (
                        ((w.c === c && Math.abs(w.r - r) === 1) || (w.r === r && Math.abs(w.c - c) === 1))
                        && w.dr === dr
                        && w.dc === dc
                    );
                });
                N.forEach((n) => {
                    if (!visited_edges.has(`${n.r},${n.c},${n.dr},${n.dc}`)) {
                        Q.push(n);
                    }
                });
            }
            sides++;
        }
    }
    return sides;
}

var FARM_MAP = getData(PUZZLE_INPUT_PATH)(parser); // Grid of plot type
var VISITED = new Set();

var costs = FARM_MAP.flatMap((row, r) => row.map((col, c) => {
    if (!VISITED.has(`${r},${c}`)) {
        var [perimiter, sides, V] = bfs({ r, c, plant: `${FARM_MAP[r][c]}`, id: `${r},${c}` });
        VISITED = new Set([...VISITED, ...V]);

        let p1_cost = perimiter * V.size;
        let p2_cost = sides * V.size;

        return [p1_cost, p2_cost];
    }
    return [0, 0];
}));

console.log('Part 1:', sum(costs.map(([p1, _]) => p1))); // 1400386
console.log('Part 2:', sum(costs.map(([_, p2]) => p2))); // 851994
