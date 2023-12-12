import { getData, getPath } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) => row.split(''));
}

function createGraph(matrix) {
    var UP = 'S|F7';
    var DOWN = 'S|JL';
    var LEFT = 'S-LF';
    var RIGHT = 'S-J7';
    var G = new Map();
    var start;
    matrix.forEach((row, r) => {
        row.forEach((col, c) => {
            var id = `${r},${c}`;
            var neighbors = [];
            if (col === '|') {
                if (UP.includes(matrix[r - 1] && matrix[r - 1][c])) neighbors.push(`${r - 1},${c}`);
                if (DOWN.includes(matrix[r + 1] && matrix[r + 1][c])) neighbors.push(`${r + 1},${c}`);
            }
            if (col === '-') {
                if (LEFT.includes(matrix[r][c - 1])) neighbors.push(`${r},${c - 1}`);
                if (RIGHT.includes(matrix[r][c + 1])) neighbors.push(`${r},${c + 1}`);
            }
            if (col === 'L') {
                if (UP.includes(matrix[r - 1] && matrix[r - 1][c])) neighbors.push(`${r - 1},${c}`);
                if (RIGHT.includes(matrix[r][c + 1])) neighbors.push(`${r},${c + 1}`);
            }
            if (col === 'J') {
                if (UP.includes(matrix[r - 1] && matrix[r - 1][c])) neighbors.push(`${r - 1},${c}`);
                if (LEFT.includes(matrix[r][c - 1])) neighbors.push(`${r},${c - 1}`);
            }
            if (col === '7') {
                if (LEFT.includes(matrix[r][c - 1])) neighbors.push(`${r},${c - 1}`);
                if (DOWN.includes(matrix[r + 1] && matrix[r + 1][c])) neighbors.push(`${r + 1},${c}`);
            }
            if (col === 'F') {
                if (RIGHT.includes(matrix[r][c + 1])) neighbors.push(`${r},${c + 1}`);
                if (DOWN.includes(matrix[r + 1] && matrix[r + 1][c])) neighbors.push(`${r + 1},${c}`);
            }
            if (col === 'S') {
                start = id;
            }
            G.set(id, neighbors);
        });
    });

    var neighborsOfStart = [...G.entries()]
        .filter(([_, neighbors]) => neighbors.some((neighbor) => neighbor === start))
        .map(([id, _]) => id);

    G.set(start, neighborsOfStart);

    return [G, start, getStartType(start, neighborsOfStart)];
}

function getStartType(start, neighbors) {
    var [r, c] = start.split(',').map(Number);
    var [[r1, c1], [r2, c2]] = neighbors.map((n) => n.split(',').map(Number));
    if ((r1 < r && c2 < c) || (r2 < r && c1 < c)) return 'J';
    if ((r1 < r && c2 > c) || (r2 < r && c1 > c)) return 'L';
    if ((r1 < r && c2 === c) || (r2 < r && c1 === c)) return '|';
    if ((r1 > r && c2 < c) || (r2 > r && c1 < c)) return '7';
    if ((r1 > r && c2 > c) || (r2 > r && c1 > c)) return 'F';
    if ((c1 > c && c2 < c) || (c2 > c && c1 < c)) return '-';
}

var loopPipes = trampoline(function loopPipes(graph, start, current = start, pipes = []) {
    var neighbors = graph.get(current);
    if (pipes.length > 1 && neighbors.includes(start)) return [start, current, ...pipes];
    var next = neighbors.find((n) => !pipes.includes(n));
    return function () {
        return loopPipes(graph, start, next, [...pipes, current]);
    };
});

function removeJunk(maze, loop, startType) {
    return maze.map((row, r) =>
        row.map((col, c) => (loop.includes(`${r},${c}`) ? (col === 'S' ? startType : col) : '.'))
    );
}

function markEnclosed(maze, enclosed) {
    return maze.map((row, r) => row.map((col, c) => (enclosed.some(([rr, cc]) => r === rr && c === cc) ? 'x' : col)));
}

function print(maze) {
    console.log('='.repeat(maze[0].length));
    maze.map((row) =>
        row
            .join('')
            .replaceAll('x', '\x1b[31mx\x1b[0m')
            .replaceAll('L', '\x1b[36m┗\x1b[0m')
            .replaceAll('J', '\x1b[36m┛\x1b[0m')
            .replaceAll('7', '\x1b[36m┓\x1b[0m')
            .replaceAll('F', '\x1b[36m┏\x1b[0m')
            .replaceAll('|', '\x1b[36m┃\x1b[0m')
            .replaceAll('-', '\x1b[36m━\x1b[0m')
            .replaceAll('S', '\x1b[33m█\x1b[0m')
    ).forEach((row) => console.log(row));
    console.log('='.repeat(maze[0].length));
}

function isEnclosed(maze, start) {
    var rows = maze.length - 1;
    var cols = maze[0].length - 1;
    var explored = new Set();
    explored.add(`${start.r},${start.c}`);
    var Q = [start];

    while (Q.length > 0) {
        let v = Q.shift();
        let { r, c } = v;
        if (r === 0 || r === rows || c === 0 || c === cols) return false;
        for (let w of neighbors(maze, v)) {
            let { r, c, side } = w;
            if (!explored.has(`${r},${c},${side}`)) {
                explored.add(`${r},${c},${side}`);
                w.parent = v;
                Q.push(w);
            }
        }
    }
    return true;
}

function neighbors(G, pos) {
    var N = [];
    var { r, c, side } = pos;
    var type = G[r][c];

    // ok to go up?
    if (G[r - 1] && !(type === '-' && side === 'down')) {
        if (G[r - 1][c] === '.') N.push({ r: r - 1, c });
        if (G[r - 1][c] === '-') N.push({ r: r - 1, c, side: 'down' });
        if (G[r - 1][c] === 'L') N.push({ r: r - 1, c, side: 'left' });
        if (G[r - 1][c] === 'J') N.push({ r: r - 1, c, side: 'right' });
        if (G[r - 1][c] === 'F' && side === 'left') N.push({ r: r - 1, c, side: 'left' });
        if (G[r - 1][c] === '7' && side === 'right') N.push({ r: r - 1, c, side: 'right' });
        if (G[r - 1][c] === '|') {
            if (type === 'J') N.push({ r: r - 1, c, side: 'right' });
            else if (type === 'L') N.push({ r: r - 1, c, side: 'left' });
            else N.push({ r: r - 1, c, side });
        }
    }

    // ok to go down?
    if (G[r + 1] && !(type === '-' && side === 'up')) {
        if (G[r + 1][c] === '.') N.push({ r: r + 1, c });
        if (G[r + 1][c] === '-') N.push({ r: r + 1, c, side: 'up' });
        if (G[r + 1][c] === 'F') N.push({ r: r + 1, c, side: 'left' });
        if (G[r + 1][c] === '7') N.push({ r: r + 1, c, side: 'right' });
        if (G[r + 1][c] === 'L' && side === 'left') N.push({ r: r + 1, c, side: 'left' });
        if (G[r + 1][c] === 'J' && side === 'right') N.push({ r: r + 1, c, side: 'right' });
        if (G[r + 1][c] === '|') {
            if (type === '7') N.push({ r: r + 1, c, side: 'right' });
            else if (type === 'F') N.push({ r: r + 1, c, side: 'left' });
            else N.push({ r: r + 1, c, side });
        }
    }

    // ok to go left?
    if (!(type === '|' && side === 'right')) {
        if (G[r][c - 1] === '.') N.push({ r, c: c - 1 });
        if (G[r][c - 1] === '|') N.push({ r, c: c - 1, side: 'right' });
        if (G[r][c - 1] === '7') N.push({ r, c: c - 1, side: 'up' });
        if (G[r][c - 1] === 'J') N.push({ r, c: c - 1, side: 'down' });
        if (G[r][c - 1] === 'L' && side === 'down') N.push({ r, c: c - 1, side: 'down' });
        if (G[r][c - 1] === 'F' && side === 'up') N.push({ r, c: c - 1, side: 'up' });
        if (G[r][c - 1] === '-') {
            if (type === '7') N.push({ r, c: c - 1, side: 'up' });
            else if (type === 'J') N.push({ r, c: c - 1, side: 'down' });
            else N.push({ r, c: c - 1, side });
        }
    }

    // ok to go right?
    if (!(type === '|' && side === 'left')) {
        if (G[r][c + 1] === '.') N.push({ r, c: c + 1 });
        if (G[r][c + 1] === '|') N.push({ r, c: c + 1, side: 'left' });
        if (G[r][c + 1] === 'F') N.push({ r, c: c + 1, side: 'up' });
        if (G[r][c + 1] === 'L') N.push({ r, c: c + 1, side: 'down' });
        if (G[r][c + 1] === 'J' && side === 'down') N.push({ r, c: c + 1, side: 'down' });
        if (G[r][c + 1] === '7' && side === 'up') N.push({ r, c: c + 1, side: 'up' });
        if (G[r][c + 1] === '-') {
            if (type === 'F') N.push({ r, c: c + 1, side: 'up' });
            else if (type === 'L') N.push({ r, c: c + 1, side: 'down' });
            else N.push({ r, c: c + 1, side });
        }
    }

    return N;
}

var maze = getData(PUZZLE_INPUT_PATH)(parser);
var [graph, start, startType] = createGraph(maze);
var loop = loopPipes(graph, start);
var mazeWithoutJunkPipes = removeJunk(maze, loop, startType);
var enclosed = mazeWithoutJunkPipes.flatMap((row, r) =>
    row
        .map((col, c) => (col === '.' && isEnclosed(mazeWithoutJunkPipes, { r, c }) ? [r, c] : undefined))
        .filter((x) => x)
);

print(markEnclosed(mazeWithoutJunkPipes, enclosed));
console.log('Part 1:', Math.floor(loop.length / 2));
console.log('Part 2:', enclosed.filter(Boolean).length);
