import { getData, getPath, sum } from '../lib/utils.js';
import { aStar } from '../lib/aStar.js';
import { makeGrid, getNeighbors } from '../lib/grid.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    let grid = input.split('\n').map((line, r) =>
        line.split('').map((riskLevel, c) => ({
            r, c,
            d: Number(riskLevel),
            g: Number.MAX_SAFE_INTEGER,
        }))
    );
    grid.forEach(row => row.forEach(cell => cell.neighbors = getNeighbors(grid)(cell)));
    return grid;
}

function calcExtendedRiskLevel(grid, r, c) {
    let refR = r - Math.floor(r/100) * 100;
    let refC = c - Math.floor(c/100) * 100;
    let refD = grid[refR][refC].d;
    let deltaRisk = Math.floor(r/100) + Math.floor(c/100);
    return ((refD + deltaRisk - 1) % 9) + 1;
}

function extend(grid) {
    let extGrid = makeGrid(500, 500, {})
    for (let r = 0; r < 500; r++) {
        for (let c = 0; c < 500; c++) {
            extGrid[r][c] = {
                r, c, 
                g: Number.MAX_SAFE_INTEGER,
                d: calcExtendedRiskLevel(grid, r, c),
            }
        }
    }
    extGrid.forEach(row => row.forEach(cell => cell.neighbors = getNeighbors(extGrid)(cell)));
    return extGrid;
}

function findLowestRisk(grid) {
    let heuristic = (node, goal) => (Math.abs(node.r - goal.r) + Math.abs(node.c - goal.c));
    let start = grid[0][0];
    let goal = grid[grid.length-1][grid[0].length-1];
    let path = aStar(start, goal, heuristic);
    return sum(path.map(n => n.d).slice(1));
}

function main() {
    let grid = getData(PUZZLE_INPUT_PATH)(parser);
    let extGrid = extend(getData(PUZZLE_INPUT_PATH)(parser));
    console.log('Part 1:', findLowestRisk(grid));
    console.log('Part 2:', findLowestRisk(extGrid));
}

main();
