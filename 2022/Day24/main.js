import { getData, getPath, rng } from '../lib/utils.js';
import { PrioQ } from './PrioQ.js';
import { makeGrid } from '../lib/grid.js';

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
    start.blizzards = blizzards;
    return [start, goal];
}

function show([start_r, start_c], [goal_r, goal_c], blizzards) {
    var grid = makeGrid(ROWS, COLS, '.');
    var count = makeGrid(ROWS, COLS, 0);
    rng(ROWS).forEach((r) => {
        rng(COLS).forEach((c) => {
            if (c === 0 || c === COLS - 1 || r === 0 || r === ROWS - 1) grid[r][c] = '#';
        });
    });
    grid[start_r][start_c] = 'S';
    grid[goal_r][goal_c] = 'G';
    blizzards.forEach(({ r, c, dir }) => {
        count[r][c] += 1;
        grid[r][c] = count[r][c] > 1 ? count[r][c] : dir;
    });
    grid.forEach((row) => console.log(row.join('')));
}

var DIRS = [
    [-1, 0], // N
    [1, 0], // S
    [0, -1], // W
    [0, 1], // E
];

function simulate(B) {
    var B2 = new Set();
    B.forEach(({ r, c, dir }) => {
        if (dir === '>') c = c === COLS - 2 ? 1 : c + 1;
        if (dir === '<') c = c === 1 ? COLS - 2 : c - 1;
        if (dir === '^') r = r === 1 ? ROWS - 2 : r - 1;
        if (dir === 'v') r = r === ROWS - 2 ? 1 : r + 1;
        B2.add({ r, c, dir });
    });
    return B2;
}

function getNeighbors(current, blizzards, start, goal) {
    var candidates = DIRS.map(([dr, dc]) => ({
        r: current.r + dr,
        c: current.c + dc,
        g: Number.MAX_SAFE_INTEGER,
    }));
    candidates.push({
        r: current.r,
        c: current.c,
        g: Number.MAX_SAFE_INTEGER,
    });
    candidates = candidates.filter(({ r, c }) => {
        if (r === start.r && c === start.c) return true;
        if (r === goal.r && c === goal.c) return true;
        if (r <= 0) return false;
        if (r >= ROWS - 1) return false;
        if (c <= 0) return false;
        if (c >= COLS - 1) return false;
        if ([...blizzards].some((b) => r === b.r && c === b.c)) return false;
        return true;
    });
    return candidates;
}

function aStar(start, goal) {
    var compareFn = (n1, n2) => n1.f - n2.f;
    var h = (n1, n2) => Math.abs(n1.r - n2.r) + Math.abs(n1.c - n2.c);
    var openSet = new PrioQ(compareFn);

    openSet.push(start);
    start.g = 0;
    start.f = h(start, goal);

    while (!openSet.empty()) {
        var current = openSet.pop();
        console.log(current.g, openSet.queue.length, openSet.ids.size);
        if (current.r === goal.r && current.c === goal.c) {
            return current.f;
        }

        var blizzards = simulate(current.blizzards);
        current.neighbors = getNeighbors(current, blizzards, start, goal);

        current.neighbors.forEach((neighbor) => {
            // tentative_gScore is the distance from start to the neighbor through current
            var tentative_gScore = current.g + 1;

            if (tentative_gScore < neighbor.g) {
                // This path to neighbor is better than any previous one. Record it!
                neighbor.blizzards = blizzards;
                neighbor.g = tentative_gScore;
                neighbor.f = tentative_gScore + h(neighbor, goal);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }
}

var [start, goal] = getData(PUZZLE_INPUT_PATH)(parser);
var startTime = Date.now();
console.log('Part 1:', aStar(start, goal));
console.log('Part 2:');
console.log('Completed in (ms):', Date.now() - startTime);
