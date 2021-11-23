import { getData, getPath } from '../lib/utils.js';
import aStar from '../lib/aStar.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input.split('\n').map((row) => row.split(''));
};

function print(maze) {
    maze.forEach((row) => console.log(row.join('')));
}

function printGrid(grid, path) {
    var maze = grid.map((row, r) =>
        row.map((col, c) => {
            if (inPath(r, c, path)) return '*';
            if (col.tile === '.') return ' ';
            return col.tile;
        })
    );
    print(maze);
}

function inPath(r, c, path) {
    return (
        path &&
        path.find((node) => node.row === r && node.col === c) !== undefined
    );
}

function makeGrid(rows, cols) {
    var g = new Array(rows);
    g.fill(new Array(cols).fill());
    return g;
}

function node(row, col, tile) {
    var wall = '#'.includes(tile);
    var door = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(tile);
    var key = 'abcdefghijklmnopqrstuvwxyz'.includes(tile);
    return {
        row,
        col,
        f: 0,
        g: Number.MAX_SAFE_INTEGER,
        neighbors: [],
        previous: undefined,
        wall,
        door,
        key,
        tile,
    };
}

function addNeighbors(row, col, grid) {
    var neighbors = [];
    if (row > 0 && !grid[row - 1][col].wall) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1 && !grid[row + 1][col].wall)
        neighbors.push(grid[row + 1][col]);
    if (col > 0 && !grid[row][col - 1].wall) neighbors.push(grid[row][col - 1]);
    if (col < grid[row].length - 1 && !grid[row][col + 1].wall)
        neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function find(tile, grid) {
    for (var row of grid) {
        for (var col of row) {
            if (col.tile === tile) return col;
        }
    }
}

const main = async () => {
    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    const ROWS = maze.length;
    const COLS = maze[0].length;
    // print(maze);
    // console.log('Part 1:');
    // console.log('Part 2:');

    var h = (node, goal) => {
        return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
    };

    var grid = makeGrid(ROWS, COLS).map((row, r) =>
        row.map((_, c) => node(r, c, maze[r][c]))
    );
    grid.forEach((row, r) =>
        row.forEach((_, c) => (grid[r][c].neighbors = addNeighbors(r, c, grid)))
    );

    var start = find('@', grid);
    var goal = find('z', grid);

    var path = aStar(start, goal, h);

    printGrid(grid, path);
};

main();
