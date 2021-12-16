import { getData, getPath, sum } from '../lib/utils.js';
import { getNeighbors } from '../lib/grid.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((row, r) =>
            row.split('').map((col, c) => ({ r, c, value: Number(col) }))
        );
}

function findLowPoints(matrix) {
    let neighbors = getNeighbors(matrix);
    let isLowPoint = (point) =>
        neighbors(point).every((neighbor) => point.value < neighbor.value);
    return matrix.flat().filter(isLowPoint);
}

function exploreBasin(matrix, lowPoint) {
    let neighbors = getNeighbors(matrix);
    let basin = new Set();
    function explore(point) {
        if (point.isExplored || point.value === 9) return;
        point.isExplored = true;
        basin.add(point);
        neighbors(point).forEach(explore);
    }
    explore(lowPoint);
    return basin.size;
}

function main() {
    let matrix = getData(PUZZLE_INPUT_PATH)(parser);

    let lowPoints = findLowPoints(matrix);
    let riskLevels = lowPoints.map(({ value }) => value + 1);
    let basins = lowPoints
        .map((point) => exploreBasin(matrix, point))
        .sort((a, b) => b - a);

    console.log('Part 1:', sum(riskLevels));
    console.log('Part 2:', basins[0] * basins[1] * basins[2]);
}

main();
