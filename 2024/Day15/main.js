import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var [grid, moves] = input.split('\n\n');
    var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    return {
        grid: grid.split('\n').map((row) => row.split('')),
        moves: moves.split('\n').flatMap((row) => row.split('').map((dir) => DIRS['^>v<'.indexOf(dir)]))
    }
}

var { grid, moves } = getData(PUZZLE_INPUT_PATH)(parser);

function findStart(grid) {
    return [
        grid.findIndex((row) => row.some(col => col === '@')),
        grid.find((row) => row.some(col => col === '@')).indexOf('@')
    ];
}

function expand(grid) {
    return grid.map((row) => row.flatMap((col) => {
        if (col === '#') return ['#', '#'];
        if (col === 'O') return ['[', ']'];
        if (col === '.') return ['.', '.'];
        if (col === '@') return ['@', '.'];
    }));
}

function move(sources, [dr, dc], state) {
    var next_state = structuredClone(state);
    for (let [sr, sc] of sources) {
        let dest_tile = next_state[sr + dr][sc + dc];
        let src_tile = next_state[sr][sc];
        if (dest_tile === '#') return state;

        // if dir is ^ or v we might need to check and move two positions
        if (dr !== 0) {
            let srcs = [[sr + dr, sc]];
            if ((src_tile === '@' && dest_tile === '[') || (src_tile === ']' && dest_tile === '[')) {
                // also move the one to the right.
                srcs.push([sr + dr, sc + 1]);
                next_state = move(srcs, [dr, dc], next_state);
            } else if ((src_tile === '@' && dest_tile === ']') || (src_tile === '[' && dest_tile === ']')) {
                // also move the one to the left.
                srcs.push([sr + dr, sc - 1]);
                next_state = move(srcs, [dr, dc], next_state);
            } else if (dest_tile === 'O' || dest_tile === '[' || dest_tile === ']') {
                next_state = move(srcs, [dr, dc], next_state);
            }
        } else if (dest_tile === 'O' || dest_tile === '[' || dest_tile === ']') {
            next_state = move([[sr, sc + dc]], [dr, dc], next_state);
        }

        dest_tile = next_state[sr + dr][sc + dc];

        if (dest_tile === '.') {
            next_state[sr + dr][sc + dc] = next_state[sr][sc];
            next_state[sr][sc] = '.';
        } else {
            return state;
        }
    }
    return next_state;
}

var g = moves.reduce((G, dir) => move([findStart(G)], dir, G), grid);
var p1 = g.reduce((sum, row, r) => sum + row.reduce((sum, col, c) => col === 'O' ? sum + (r * 100 + c) : sum, 0), 0);

g = moves.reduce((G, dir) => move([findStart(G)], dir, G), expand(grid));
var p2 = g.reduce((sum, row, r) => sum + row.reduce((sum, col, c) => col === '[' ? sum + (r * 100 + c) : sum, 0), 0);

console.log('Part 1:', p1);
console.log('Part 2:', p2);
