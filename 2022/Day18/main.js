import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(',').map(Number));
}

function countOpenSides([X, Y, Z], cubes) {
    var right = ([x, y, z]) => (X === x + 1 && Y === y && Z === z ? 1 : 0);
    var left = ([x, y, z]) => (X === x - 1 && Y === y && Z === z ? 1 : 0);
    var top = ([x, y, z]) => (Y === y + 1 && X === x && Z == z ? 1 : 0);
    var bottom = ([x, y, z]) => (Y === y - 1 && X === x && Z === z ? 1 : 0);
    var front = ([x, y, z]) => (Z === z + 1 && X === x && Y === y ? 1 : 0);
    var back = ([x, y, z]) => (Z === z - 1 && X === x && Y === y ? 1 : 0);

    var checkSides = [left, right, top, bottom, front, back];

    var connectedSides = checkSides.reduce((acc, side) => {
        for (let cube of cubes) {
            if (side(cube)) return acc + 1;
        }
        return acc;
    }, 0);

    return 6 - connectedSides;
}

var cubes = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = cubes.reduce((acc, cube) => acc + countOpenSides(cube, cubes), 0);

console.log('Part 1:', p1);
console.log('Part 2:');
