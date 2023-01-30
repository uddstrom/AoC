import { getData, getPath, lcm, rng } from '../lib/utils.js';
import { PrioQ } from '../lib/PrioQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var ROWS, COLS;

function parser(input) {
    var isBlizzard = (x) => '<>v^'.includes(x);
    var start, goal;
    var blizzards = new Set();
    input.split('\n').forEach((row, r, rows) => {
        ROWS = rows.length;
        row.split('').forEach((col, c, cols) => {
            COLS = cols.length;
            if (r === 0 && col === '.') start = { r, c };
            if (r === rows.length - 1 && col === '.') goal = { r, c };
            if (isBlizzard(col)) blizzards.add({ r, c, dir: col });
        });
    });
    return [blizzards, start, goal];
}

function createBlizzSimulator(initialBlizzards) {
    var blizzardsStates = new Map();
    var b_start = structuredClone(initialBlizzards);
    var b_next = new Set();
    rng(lcm(ROWS, COLS)).forEach((n) => {
        blizzardsStates.set(n, b_start);
        b_start.forEach(({ r, c, dir }) => {
            if (dir === '>') c = c === COLS - 2 ? 1 : c + 1;
            if (dir === '<') c = c === 1 ? COLS - 2 : c - 1;
            if (dir === '^') r = r === 1 ? ROWS - 2 : r - 1;
            if (dir === 'v') r = r === ROWS - 2 ? 1 : r + 1;
            b_next.add({ r, c, dir });
        });
        b_start = b_next;
        b_next = new Set();
    });
    return (n) => blizzardsStates.get(n % blizzardsStates.size);
}

function getNeighbors(current, blizzards, start, goal) {
    var candidates = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [0, 0],
    ].map(([dr, dc]) => ({
        r: current.r + dr,
        c: current.c + dc,
        g: Number.MAX_SAFE_INTEGER,
    }));
    return candidates.filter(({ r, c }) => {
        if (r === start.r && c === start.c) return true;
        if (r === goal.r && c === goal.c) return true;
        if (r <= 0 || r >= ROWS - 1) return false;
        if (c <= 0 || c >= COLS - 1) return false;
        if ([...blizzards].some((b) => r === b.r && c === b.c)) return false;
        return true;
    });
}

function aStar(start, goal, getBlizzards) {
    var compareFn = (n1, n2) => n1.f - n2.f;
    var idFn = (state) => `${state.r};${state.c};${state.g}`;
    var h = (n1, n2) => Math.abs(n1.r - n2.r) + Math.abs(n1.c - n2.c);
    var openSet = new PrioQ(compareFn, idFn);

    start.f = h(start, goal);
    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();
        if (current.r === goal.r && current.c === goal.c) return current.f;

        current.neighbors = getNeighbors(current, getBlizzards(current.g + 1), start, goal);
        current.neighbors.forEach((neighbor) => {
            neighbor.g = current.g + 1;
            neighbor.f = current.g + 1 + h(neighbor, goal);
            if (!openSet.includes(neighbor)) openSet.push(neighbor);
        });
    }
}

var startTime = Date.now();
var [blizzards, start, goal] = getData(PUZZLE_INPUT_PATH)(parser);
var simulator = createBlizzSimulator(blizzards);
var trip1 = aStar({ ...start, g: 0 }, goal, simulator);
var trip2 = aStar({ ...goal, g: trip1 }, start, simulator);
var trip3 = aStar({ ...start, g: trip2 }, goal, simulator);

console.log('Part 1:', trip1);
console.log('Part 2:', trip3);
console.log('Completed in (ms):', Date.now() - startTime);
