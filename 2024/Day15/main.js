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

// var print = (grid) => grid.forEach(row => console.log(row.join('')));

var { grid, moves } = getData(PUZZLE_INPUT_PATH)(parser);

function findStart(grid) {
    return [
        grid.findIndex((row) => row.some(col => col === '@')),
        grid.find((row) => row.some(col => col === '@')).indexOf('@')
    ];
}

function move([sr, sc], [dr, dc], grid) {
    var dest = grid[sr + dr][sc + dc];
    var next = structuredClone(grid);

    if (dest === 'O') {
        next = move([sr + dr, sc + dc], [dr, dc], grid);
        dest = next[sr + dr][sc + dc];
    }

    if (dest === '.') {
        next[sr + dr][sc + dc] = next[sr][sc];
        next[sr][sc] = '.';
        return next;
    }

    return grid;
}

var g = moves.reduce((G, dir) => move(findStart(G), dir, G), grid);
var p1 = g.reduce((sum, row, r) => sum + row.reduce((sum, col, c) => col === 'O' ? sum + (r * 100 + c) : sum, 0), 0);

console.log('Part 1:', p1);
console.log('Part 2:');
