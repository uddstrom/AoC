import { getData, getPath, max, min } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var GRID = getData(PUZZLE_INPUT_PATH)(parser);
var PATHS = new Map();
var SIDES = ['left', 'right', 'top', 'bottom', 'front', 'back'];
var MAXX = max(GRID.map(([x, y, z]) => x));
var MINX = min(GRID.map(([x, y, z]) => x));
var MAXY = max(GRID.map(([x, y, z]) => y));
var MINY = min(GRID.map(([x, y, z]) => y));
var MAXZ = max(GRID.map(([x, y, z]) => z));
var MINZ = min(GRID.map(([x, y, z]) => z));
var GET_POS = {
    right: ([x, y, z]) => [x + 1, y, z],
    left: ([x, y, z]) => [x - 1, y, z],
    top: ([x, y, z]) => [x, y + 1, z],
    bottom: ([x, y, z]) => [x, y - 1, z],
    back: ([x, y, z]) => [x, y, z + 1],
    front: ([x, y, z]) => [x, y, z - 1],
};

function parser(input) {
    return input.split('\n').map((line) => line.split(',').map(Number));
}

function isOpen(cube, side) {
    var [nx, ny, nz] = GET_POS[side](cube);
    return !GRID.some(([x, y, z]) => x === nx && y === ny && z === nz);
}

function findPath(cube, side) {
    function goal(x, y, z) {
        if (x <= MINX || x >= MAXX) return true;
        if (y <= MINY || y >= MAXY) return true;
        if (z <= MINZ || z >= MAXZ) return true;
        return false;
    }

    function neighbors(cube) {
        return SIDES.map((side) =>
            isOpen(cube, side) ? GET_POS[side](cube) : undefined
        ).filter((c) => c);
    }

    function dfs([x, y, z], visited) {
        if (goal(x, y, z)) return true;
        visited.add(`${x},${y},${z}`);
        for (let [nx, ny, nz] of neighbors([x, y, z])) {
            if (visited.has(`${nx},${ny},${nz}`)) continue;
            var path = dfs([nx, ny, nz], visited);
            PATHS.set(`${x},${y},${z}`, path);
            if (path) return true;
        }
        return false;
    }

    if (!isOpen(cube, side)) return false;

    var [x, y, z] = GET_POS[side](cube);
    var id = `${x},${y},${z}`;
    if (PATHS.has(id)) return PATHS.get(id);

    var path = dfs([x, y, z], new Set());
    PATHS.set(`${x},${y},${z}`, path);
    return path;
}

function countOpenSides(acc, cube) {
    return (
        acc +
        SIDES.reduce((acc, side) => (isOpen(cube, side) ? acc + 1 : acc), 0)
    );
}

function countAccessibleSides(acc, cube) {
    return (
        acc +
        SIDES.reduce((acc, side) => (findPath(cube, side) ? acc + 1 : acc), 0)
    );
}

console.log('Part 1:', GRID.reduce(countOpenSides, 0));
console.log('Part 2:', GRID.reduce(countAccessibleSides, 0));
