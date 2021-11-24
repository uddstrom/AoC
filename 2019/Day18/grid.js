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

function emptyGrid(rows, cols) {
    var g = new Array(rows);
    g.fill(new Array(cols).fill());
    return g;
}

function tile(row, col, value) {
    var wall = '#'.includes(value);
    var door = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(value);
    var key = 'abcdefghijklmnopqrstuvwxyz'.includes(value);
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
        value,
    };
}

function inPath(r, c, path) {
    return (
        path &&
        path.find((node) => node.row === r && node.col === c) !== undefined
    );
}

export function find(tile, grid) {
    for (var row of grid) {
        for (var col of row) {
            if (col.value === tile) return col;
        }
    }
}

export function createGrid(maze) {
    const ROWS = maze.length;
    const COLS = maze[0].length;

    var grid = emptyGrid(ROWS, COLS).map((row, r) =>
        row.map((_, c) => tile(r, c, maze[r][c]))
    );
    grid.forEach((row, r) =>
        row.forEach((_, c) => (grid[r][c].neighbors = addNeighbors(r, c, grid)))
    );
    var doors = grid.flat().filter((tile) => tile.door === true);
    var keys = grid.flat().filter((tile) => tile.key === true);

    return { grid, doors, keys };
}

export function printGrid(grid, path) {
    var maze = grid.map((row, r) =>
        row.map((col, c) => {
            if (inPath(r, c, path)) return '*';
            if (col.value === '.') return ' ';
            return col.value;
        })
    );
    maze.forEach((row) => console.log(row.join('')));
}
