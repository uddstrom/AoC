import { getData, getPath } from '../lib/utils.js';
import aStar from '../lib/aStar.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input_test`;
const ROWS = 15;
const COLS = 30;

var parser = (input) => {
    return input.split('\n').map((row) => row.split(''));
};

function print(maze) {
    maze.forEach((row) => console.log(row.join('')));
}

function printGrid(grid, path) {
    var maze = grid.map((row, r) =>
        row.map((col, c) => {
            if (col.wall) return '#';
            else if (inPath(r, c, path)) return '*';
            else return ' ';
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

const node = (row, col) => {
    var wall = Math.random() < 0.2;
    return {
        row,
        col,
        f: 0,
        g: Number.MAX_SAFE_INTEGER,
        neighbors: [],
        previous: undefined,
        wall,
    };
};

const addNeighbors = (row, col, grid) => {
    var neighbors = [];
    if (row > 0 && !grid[row - 1][col].wall) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1 && !grid[row + 1][col].wall)
        neighbors.push(grid[row + 1][col]);
    if (col > 0 && !grid[row][col - 1].wall) neighbors.push(grid[row][col - 1]);
    if (col < grid[row].length - 1 && !grid[row][col + 1].wall)
        neighbors.push(grid[row][col + 1]);
    return neighbors;
};

const main = async () => {
    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    // print(maze);
    // console.log('Part 1:');
    // console.log('Part 2:');

    var h = (node, goal) => {
        return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
    };

    var grid = makeGrid(ROWS, COLS).map((row, r) =>
        row.map((col, c) => node(r, c))
    );

    var start = grid[0][0];
    var goal = grid[ROWS - 1][COLS - 1];
    start.wall = false;
    goal.wall = false;

    grid.forEach((row, r) =>
        row.forEach(
            (col, c) => (grid[r][c].neighbors = addNeighbors(r, c, grid))
        )
    );

    var path = aStar(start, goal, h);

    printGrid(grid, path);
    // console.log(path);
};

main();
