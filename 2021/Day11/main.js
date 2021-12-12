import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    return input
        .split('\n')
        .map((line, r) =>
            line.split('').map((energyLevel, c) => ({
                r,
                c,
                level: Number(energyLevel),
                flash: false,
            }))
        )
        .flat();
}

var toIndex = (r, c) => r * 10 + c;

function getNeighbors(grid, octo) {
    let DR = [-1, -1, 0, 1, 1, 1, 0, -1];
    let DC = [0, 1, 1, 1, 0, -1, -1, -1];
    let inGrid = ({ r, c }) => 0 <= r && r < 10 && 0 <= c && c < 10;
    let neighborCoords = [0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => ({
            r: octo.r + DR[i],
            c: octo.c + DC[i],
        }))
        .filter(inGrid);
    return neighborCoords.map(({ r, c }) => grid[toIndex(r, c)]);
}

function updateNeighbors(grid, flashers) {
    if (flashers.length === 0) return grid;
    let newFlashers = [];
    flashers.forEach((flasher) => {
        let affected = getNeighbors(grid, flasher);
        affected.forEach((octo) => {
            if (octo.flash) return;
            let updatedOcto = updateOcto(octo);
            if (updatedOcto.flash) newFlashers.push({ ...updatedOcto });
            grid[toIndex(updatedOcto.r, updatedOcto.c)] = updatedOcto;
        });
    });
    return updateNeighbors(grid, newFlashers);
}

function updateOcto(octo) {
    return {
        ...octo,
        level: (octo.level + 1) % 10,
        flash: octo.level === 9,
    };
}

function resetFlash(octo) {
    return { ...octo, flash: false };
}

function octoSimulator(octoGrid) {
    return function run(steps) {
        function update(grid, step = 0, flashCountAcc = 0) {
            if (steps && step === steps) return flashCountAcc;
            let updatedGrid = grid.map(resetFlash).map(updateOcto);
            let flashed = updatedGrid.filter((o) => o.flash);
            updatedGrid = updateNeighbors(updatedGrid, flashed);
            let flashCount = updatedGrid.filter((o) => o.flash).length;
            if (flashCount === 100) return step + 1;
            return update(updatedGrid, step + 1, flashCountAcc + flashCount);
        }
        return update(octoGrid);
    };
}

function main() {
    let _octoGrid = getData(PUZZLE_INPUT_PATH)(parser);
    let simulate = octoSimulator(_octoGrid);
    console.log('Part 1:', simulate(100));
    console.log('Part 2:', simulate());
}

main();
