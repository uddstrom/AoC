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
    return DR.map((dr, i) => {
        var rr = r + dr;
        var cc = c + DC[i];
        return rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS ? grid[rr][cc] : null;
    });
}

function isOuterPortal(r, c) {
    return r === 2 || r === ROWS - 3 || c === 2 || c === COLS - 3;
}

function findPortal(portal, grid, recursive = false) {
    var [p1, p2] = portal.split("");
    var portals = grid
        .map((row, r1) => {
            for (var [c1, col] of row.entries()) {
                if (col === p1) {
                    var nOfP1 = getNeighbours([r1, c1], grid);
                    if (nOfP1.includes(p2)) {
                        if (nOfP1.includes(".")) {
                            let dir = nOfP1.indexOf(".");
                            let dl = recursive ? (isOuterPortal(r1 + DR[dir], c1 + DC[dir]) ? -1 : 1) : 0;
                            return [r1 + DR[dir], c1 + DC[dir], dl];
                        }
                        let dirOfP2 = nOfP1.indexOf(p2);
                        let r2 = r1 + DR[dirOfP2];
                        let c2 = c1 + DC[dirOfP2];
                        let nOfP2 = getNeighbours([r2, c2], grid);
                        let dir = nOfP2.indexOf(".");
                        let dl = recursive ? (isOuterPortal(r2 + DR[dir], c2 + DC[dir]) ? -1 : 1) : 0;
                        return [r2 + DR[dir], c2 + DC[dir], dl];
                    }
                }
            }
        })
        .filter((x) => x);
    // remove duplicates
    var S = new Set(portals.map(([r, c, l]) => `${r},${c},${l}`));
    return Array.from(S).map((x) => x.split(",").map(Number));
}

function createGetAdjacent(recursive) {
    return function getAdjacent([r, c], level, grid) {
        var adj = []; // coords of neighbours that can be reached
        var neighbors = getNeighbours([r, c], grid);
        neighbors.forEach((n, dir) => {
            if (n === ".") adj.push([r + DR[dir], c + DC[dir], level]);
            if (n && n.match(/^[A-Z]$/)) {
                let portal =
                    dir === NORTH || dir === WEST
                        ? `${grid[r + DR[dir] + DR[dir]][c + DC[dir] + DC[dir]]}${n}`
                        : `${n}${grid[r + DR[dir] + DR[dir]][c + DC[dir] + DC[dir]]}`;

                let P = findPortal(portal, grid, recursive);
                if (P.length > 1) {
                    let [[r1, c1, dl1], [r2, c2, dl2]] = P;
                    if (r === r1 && c === c1) {
                        if (level + dl1 >= 0) adj.push([r2, c2, level + dl1]);
                    } else {
                        if (level + dl2 >= 0) adj.push([r1, c1, level + dl2]);
                    }
                }
            }
        });
        return adj;
    };
}

var start = findPortal("AA", GRID)[0];
var goal = findPortal("ZZ", GRID)[0];

function bfs(start, [gr, gc], grid, recursive) {
    var getAdjacent = createGetAdjacent(recursive);
    var Q = [{ coord: start, level: 0 }];
    var visited = new Set();
    while (Q.length > 0) {
        let v = Q.shift();
        let [vr, vc] = v.coord;
        if (v.level === 0 && vr === gr && vc === gc) return v;
        let adj = getAdjacent(v.coord, v.level, grid);
        adj.forEach(([wr, wc, level]) => {
            if (!visited.has(`${wr},${wc},${level}`)) {
                visited.add(`${wr},${wc},${level}`);
                Q.push({ coord: [wr, wc], level: level, previous: v });
            }
        });
    }
}

function reconstructPath(_current) {
    var current = _current;
    var total_path = [current];
    while (current.previous) {
        total_path.unshift(current.previous);
        current = current.previous;
    }
    return total_path;
}

var path = reconstructPath(bfs(start, goal, GRID, false));
console.log("Part 1:", path.length - 1);

var recursivePath = reconstructPath(bfs(start, goal, GRID, true));
console.log("Part 2:", recursivePath.length - 1);
