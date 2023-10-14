import { getData, getPath, max, min } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split(""));
}

var GRID = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = GRID.length;
var COLS = GRID[0].length;

// north, south, east, west vectors
var DR = [-1, 1, 0, 0];
var DC = [0, 0, 1, -1];
var NORTH = 0,
    WEST = 3;

function getNeighbours([r, c], grid) {
    var neighbors = DR.map((dr, i) => {
        var rr = r + dr;
        var cc = c + DC[i];
        return rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS ? grid[rr][cc] : null;
    });
    return neighbors;
}

function findPortal(portal, grid) {
    var [p1, p2] = portal.split("");
    var portals = grid
        .map((row, r1) => {
            for (var [c1, col] of row.entries()) {
                if (col === p1) {
                    var nOfP1 = getNeighbours([r1, c1], grid);
                    if (nOfP1.includes(p2)) {
                        if (nOfP1.includes(".")) {
                            let dir = nOfP1.indexOf(".");
                            return [r1 + DR[dir], c1 + DC[dir]];
                        }
                        let dirOfP2 = nOfP1.indexOf(p2);
                        let r2 = r1 + DR[dirOfP2];
                        let c2 = c1 + DC[dirOfP2];
                        let nOfP2 = getNeighbours([r2, c2], grid);
                        let dir = nOfP2.indexOf(".");
                        return [r2 + DR[dir], c2 + DC[dir]];
                    }
                }
            }
        })
        .filter((x) => x);
    // remove duplicates
    var S = new Set(portals.map(([r, c]) => `${r},${c}`));
    return Array.from(S).map((x) => x.split(",").map(Number));
}

function getAdjacent([r, c], grid) {
    var adj = []; // coords of neighbours that can be reached
    var neighbors = getNeighbours([r, c], grid);
    neighbors.forEach((n, dir) => {
        if (n === ".") adj.push([r + DR[dir], c + DC[dir]]);
        if (n && n.match(/^[A-Z]$/)) {
            let portal =
                dir === NORTH || dir === WEST
                    ? `${grid[r + DR[dir] + DR[dir]][c + DC[dir] + DC[dir]]}${n}`
                    : `${n}${grid[r + DR[dir] + DR[dir]][c + DC[dir] + DC[dir]]}`;

            let P = findPortal(portal, grid);
            if (P.length > 1) {
                let [[r1, c1], [r2, c2]] = P;
                r === r1 && c === c1 ? adj.push([r2, c2]) : adj.push([r1, c1]);
            }
        }
    });
    return adj;
}

var start = findPortal("AA", GRID)[0];
var goal = findPortal("ZZ", GRID)[0];

function bfs([sr, sc], [gr, gc], grid) {
    var Q = [];
    var visited = new Set();
    Q.push({ coord: [sr, sc] });
    while (Q.length > 0) {
        let v = Q.shift();
        let [vr, vc] = v.coord;
        if (vr === gr && vc === gc) return v;
        let adj = getAdjacent(v.coord, grid);
        adj.forEach(([wr, wc]) => {
            if (!visited.has(`${wr},${wc}`)) {
                visited.add(`${wr},${wc}`);
                Q.push({ coord: [wr, wc], previous: v });
            }
        });
    }
}

function reconstruct_path(_current) {
    var current = _current;
    var total_path = [current];
    while (current.previous) {
        total_path.unshift(current.previous);
        current = current.previous;
    }
    return total_path;
}

var path = reconstruct_path(bfs(start, goal, GRID));
console.log("Part 1:", path.length - 1);
// console.log("Part 2:", findPortal("NS", GRID));
