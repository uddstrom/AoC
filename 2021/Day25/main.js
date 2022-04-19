import { getData, getPath, range, rng } from '../lib/utils.js';
import { compose } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => input.split('\n').map((line) => line.split(''));

function processRow(row) {
    let newRow = structuredClone(row);
    row.forEach((val, i) => {
        if (val === '>') {
            if (i + 1 < row.length && row[i + 1] === '.') {
                newRow[i] = '.';
                newRow[i + 1] = '>';
            } else if (i + 1 === row.length && row[0] === '.') {
                newRow[i] = '.';
                newRow[0] = '>';
            }
        }
    });
    return newRow;
}

function moveSouth(map) {
    let newMap = structuredClone(map);
    for (let c = 0; c < map[0].length; c++) {
        for (let r = 0; r < map.length; r++) {
            if (map[r][c] === 'v') {
                if (r + 1 < map.length && map[r + 1][c] === '.') {
                    newMap[r][c] = '.';
                    newMap[r + 1][c] = 'v';
                } else if (r + 1 === map.length && map[0][c] === '.') {
                    newMap[r][c] = '.';
                    newMap[0][c] = 'v';
                }
            }
        }
    }
    return newMap;
}

function notSame(map1, map2) {
    for (let [r, row] of map1.entries()) {
        for (let [c, col] of row.entries()) {
            if (col !== map2[r][c]) return true;
        }
    }
    return false;
}

function getSteps(map) {
    let moveEast = (m) => m.map(processRow);
    let executeStep = compose(moveSouth, moveEast);
    let steps = 1;
    let newMap = executeStep(map);
    while (notSame(newMap, map)) {
        map = newMap;
        newMap = executeStep(map);
        steps++;
    }
    return steps;
}

let map = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', getSteps(map));

// Just some dummy changes to commit