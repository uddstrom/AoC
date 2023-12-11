import { getData, getPath } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) => row.split(''));
}

var UP = 'S|F7';
var DOWN = 'S|JL';
var LEFT = 'S-LF';
var RIGHT = 'S-J7';

function createGraph(matrix) {
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

    if (r1 < r && c2 < c) return 'J';
    if (r2 < r && c1 < c) return 'J';
    if (r1 < r && c2 > c) return 'L';
    if (r2 < r && c1 > c) return 'L';
    if (r1 < r && c2 === c) return '|';
    if (r2 < r && c1 === c) return '|';
    if (r1 > r && c2 < c) return '7';
    if (r2 > r && c1 < c) return '7';
    if (r1 > r && c2 > c) return 'F';
    if (r2 > r && c1 > c) return 'F';
    if (c1 > c && c2 < c) return '-';
    if (c2 > c && c1 < c) return '-';
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

function tagEnclosed(maze, enclosed) {
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
    var G = maze.map((row, r) => row.map((col, c) => ({ r, c, type: col, explored: false })));
    var rows = maze.length - 1;
    var cols = maze[0].length - 1;
    start.explored = true;
    var Q = [start];
    while (Q.length > 0) {
        let v = Q.shift();
        let { r, c } = v;
        if (r === 0 || r === rows || c === 0 || c === cols) {
            console.log('UTE!', v);
            return false;
        }
        for (let w of neighbors(G, v)) {
            if (!w.explored) {
                w.explored = true;
                Q.push(w);
            }
        }
    }
    return true;
}

function neighbors(G, pos) {
    var N = [];
    var { r, c, type, side } = pos;
    // ok to go up?
    if (G[r - 1]) {
        if (G[r - 1][c].type === '.') {
            if (!(type === '-' && side === 'down')) N.push(G[r - 1][c]);
        }
        if (G[r - 1][c].type === 'L') {
            G[r - 1][c].side = 'left';
            N.push(G[r - 1][c]);
        }
        if (G[r - 1][c].type === 'J') {
            G[r - 1][c].side = 'right';
            N.push(G[r - 1][c]);
        }
        if (G[r - 1][c].type === '|') {
            if (type === 'J') G[r - 1][c].side = 'right';
            else if (type === 'L') G[r - 1][c].side = 'left';
            else G[r - 1][c].side = side;
            N.push(G[r - 1][c]);
        }
        if (G[r - 1][c].type === 'F' && side === 'left') {
            G[r - 1][c].side = side;
            N.push(G[r - 1][c]);
        }
        if (G[r - 1][c].type === '7' && side === 'right') {
            G[r - 1][c].side = side;
            N.push(G[r - 1][c]);
        }
    }

    // ok to go down?
    if (G[r + 1]) {
        if (G[r + 1][c].type === '.') {
            if (!(type === '-' && side === 'up')) N.push(G[r + 1][c]);
        }
        if (G[r + 1][c].type === 'F') {
            G[r + 1][c].side = 'left';
            N.push(G[r + 1][c]);
        }
        if (G[r + 1][c].type === '7') {
            G[r + 1][c].side = 'right';
            N.push(G[r + 1][c]);
        }
        if (G[r + 1][c].type === '|') {
            if (type === '7') G[r + 1][c].side = 'right';
            else if (type === 'F') G[r + 1][c].side = 'left';
            else G[r + 1][c].side = side;
            N.push(G[r + 1][c]);
        }
        if (G[r + 1][c].type === 'L' && side === 'left') {
            G[r + 1][c].side = side;
            N.push(G[r + 1][c]);
        }
        if (G[r + 1][c].type === 'J' && side === 'right') {
            G[r + 1][c].side = side;
            N.push(G[r + 1][c]);
        }
    }

    // ok to go left?
    if (G[r][c - 1].type === '.') {
        if (!(type === '|' && side === 'right')) N.push(G[r][c - 1]);
    }
    if (G[r][c - 1].type === '7') {
        G[r][c - 1].side = 'up';
        N.push(G[r][c - 1]);
    }
    if (G[r][c - 1].type === 'J') {
        G[r][c - 1].side = 'down';
        N.push(G[r][c - 1]);
    }
    if (G[r][c - 1].type === '-') {
        if (type === '7') G[r][c - 1].side = 'up';
        else if (type === 'J') G[r][c - 1].side = 'down';
        else G[r][c - 1].side = side;
        N.push(G[r][c - 1]);
    }
    if (G[r][c - 1].type === 'L' && side === 'down') {
        G[r][c - 1].side = side;
        N.push(G[r][c - 1]);
    }
    if (G[r][c - 1].type === 'F' && side === 'up') {
        G[r][c - 1].side = side;
        N.push(G[r][c - 1]);
    }

    // ok to go right?
    if (G[r][c + 1].type === '.') {
        if (!(type === '|' && side === 'left')) N.push(G[r][c + 1]);
    }
    if (G[r][c + 1].type === 'F') {
        G[r][c + 1].side = 'up';
        N.push(G[r][c + 1]);
    }
    if (G[r][c + 1].type === 'L') {
        G[r][c + 1].side = 'down';
        N.push(G[r][c + 1]);
    }
    if (G[r][c + 1].type === '-') {
        if (type === 'F') G[r][c + 1].side = 'up';
        else if (type === 'L') G[r][c + 1].side = 'down';
        else G[r][c + 1].side = side;
        N.push(G[r][c + 1]);
    }
    if (G[r][c + 1].type === 'J' && side === 'down') {
        G[r][c + 1].side = side;
        N.push(G[r][c + 1]);
    }
    if (G[r][c + 1].type === '7' && side === 'up') {
        G[r][c + 1].side = side;
        N.push(G[r][c + 1]);
    }
    console.log(pos, N);
    return N;
}

var maze = getData(PUZZLE_INPUT_PATH)(parser);

var [graph, start, startType] = createGraph(maze);
var loop = loopPipes(graph, start);
var mazeWithoutJunkPipes = removeJunk(maze, loop, startType);

// var enclosed = mazeWithoutJunkPipes.flatMap((row, r) =>
//     row
//         .map((col, c) => {
//             if (col === '.' && isEnclosed(mazeWithoutJunkPipes, { r, c, type: col })) {
//                 return [r, c];
//             }
//         })
//         .filter((x) => x)
// );
// var mazeWithoutJunkPipesAndEnclosed = tagEnclosed(mazeWithoutJunkPipes, enclosed);

// console.log('Part 1:', Math.floor(loop.length / 2));
// console.log('Part 2:', enclosed.filter(Boolean).length);

//print(mazeWithoutJunkPipesAndEnclosed);
print(mazeWithoutJunkPipes);

var x = isEnclosed(mazeWithoutJunkPipes, { r: 6, c: 14, type: '.' });
console.log(x);

// 728 too high
