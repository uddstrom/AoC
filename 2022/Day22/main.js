import { getData, getPath, max } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var FACINGS = { RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3 };

function parser(input) {
    function parseMaze(maze) {
        var tempMaze = maze.split('\n').map((line) => line.split(''));
        var maxCols = max(tempMaze.map((row) => row.length));
        return maze.split('\n').map((line) => line.padEnd(maxCols, ' ').split(''));
    }

    function parsePath(path) {
        if (!path.includes('R') && !path.includes('L')) return Number(path);
        if (path.startsWith('R')) return ['R', parsePath(path.substring(1))].flat();
        if (path.startsWith('L')) return ['L', parsePath(path.substring(1))].flat();

        var indexOfR = path.indexOf('R');
        var indexOfL = path.indexOf('L');

        if (indexOfR < indexOfL && indexOfR >= 0) {
            return [Number(path.substring(0, indexOfR)), parsePath(path.substring(indexOfR))].flat();
        }

        return [Number(path.substring(0, indexOfL)), parsePath(path.substring(indexOfL))].flat();
    }

    var [maze, path] = input.split('\n\n');
    return [parseMaze(maze), parsePath(path)];
}

function rotate(facing, dir) {
    if (dir === 'R') return (facing + 1).mod(4);
    if (dir === 'L') return (facing - 1).mod(4);
}

function makeStep(r, c, facing, maze) {
    if (facing === FACINGS.RIGHT) {
        if (c < maze[r].length - 1) {
            var tile = maze[r][c + 1];
            if (tile === '.') return [r, c + 1, facing];
            if (tile === '#') return [r, c, facing];
        }
        var nc = maze[r].findIndex((tile) => tile !== ' ');
        return maze[r][nc] === '.' ? [r, nc, facing] : [r, c, facing];
    }

    if (facing === FACINGS.LEFT) {
        if (c > 0) {
            var tile = maze[r][c - 1];
            if (tile === '.') return [r, c - 1, facing];
            if (tile === '#') return [r, c, facing];
        }
        var nc = maze[r].findLastIndex((tile) => tile !== ' ');
        return maze[r][nc] === '.' ? [r, nc, facing] : [r, c, facing];
    }

    if (facing === FACINGS.DOWN) {
        if (r < maze.length - 1) {
            var tile = maze[r + 1][c];
            if (tile === '.') return [r + 1, c, facing];
            if (tile === '#') return [r, c, facing];
        }
        var nr = maze.findIndex((row) => row[c] !== ' ');
        return maze[nr][c] === '.' ? [nr, c, facing] : [r, c, facing];
    }

    if (facing === FACINGS.UP) {
        if (r > 0) {
            var tile = maze[r - 1][c];
            if (tile === '.') return [r - 1, c, facing];
            if (tile === '#') return [r, c, facing];
        }
        var nr = maze.findLastIndex((row) => row[c] !== ' ');
        return maze[nr][c] === '.' ? [nr, c, facing] : [r, c, facing];
    }
}

function walkPath([r, c, facing], path, maze) {
    if (path.length === 0) return [r, c, facing];

    var [next, ...rest] = path;
    if (next === 'R' || next === 'L') {
        return () => walkPath([r, c, rotate(facing, next)], rest, maze);
    } else {
        let [newR, newC, newFacing] = makeStep(r, c, facing, maze);
        let stepsLeft = next - 1;
        if (stepsLeft > 0) return () => walkPath([newR, newC, newFacing], [stepsLeft, ...rest], maze);
        return () => walkPath([newR, newC, newFacing], rest, maze);
    }
}

function getNextPos(r, c, facing) {
    /*
      AB
     C##D
    HF#GE
    I##J
    L#MK
     N
    */
    // 1. A -> L
    if (r === 0 && c >= 50 && c < 100 && facing === FACINGS.UP) return [c + 100, 0, FACINGS.RIGHT];
    // 2. B -> N
    if (r === 0 && c >= 100 && facing === FACINGS.UP) return [199, c - 100, facing];
    // 3. C -> I
    if (c === 50 && r < 50 && facing === FACINGS.LEFT) return [149 - r, 0, FACINGS.RIGHT];
    // 4. D -> J
    if (c === 149 && r < 50 && facing === FACINGS.RIGHT) return [149 - r, 99, FACINGS.LEFT];
    // 5. E -> G
    if (r === 49 && c >= 100 && facing === FACINGS.DOWN) return [c - 50, 99, FACINGS.LEFT];
    // 6. F -> H
    if (c === 50 && r >= 50 && r < 100 && facing === FACINGS.LEFT) return [100, r - 50, FACINGS.DOWN];
    // 7. G -> E
    if (c === 99 && r >= 50 && r < 100 && facing === FACINGS.RIGHT) return [49, r + 50, FACINGS.UP];
    // 8. H -> F
    if (r === 100 && c < 50 && facing === FACINGS.UP) return [c + 50, 50, FACINGS.RIGHT];
    // 9. I -> C
    if (c === 0 && r >= 100 && r < 150 && facing === FACINGS.LEFT) return [149 - r, 50, FACINGS.RIGHT];
    // 10. J -> D
    if (c === 99 && r >= 100 && r < 150 && facing === FACINGS.RIGHT) return [149 - r, 149, FACINGS.LEFT];
    // 11. K -> M
    if (r === 149 && c >= 50 && c < 100 && facing === FACINGS.DOWN) return [c + 100, 49, FACINGS.LEFT];
    // 12. L -> A
    if (c === 0 && r >= 150 && facing === FACINGS.LEFT) return [0, r - 100, FACINGS.DOWN];
    // 13. M -> K
    if (c === 49 && r >= 150 && facing === FACINGS.RIGHT) return [149, r - 100, FACINGS.UP];
    // 14. N -> B
    if (r === 199 && c < 50 && facing === FACINGS.DOWN) return [0, c + 100, facing];

    if (facing === FACINGS.RIGHT) return [r, c + 1, facing];
    if (facing === FACINGS.LEFT) return [r, c - 1, facing];
    if (facing === FACINGS.UP) return [r - 1, c, facing];
    if (facing === FACINGS.DOWN) return [r + 1, c, facing];
}

function walkCube([r, c, facing], path, maze) {
    function makeStepOnCube(r, c, facing, maze) {
        var [nr, nc, newFacing] = getNextPos(r, c, facing);
        return maze[nr][nc] === '#' ? [r, c, facing] : [nr, nc, newFacing];
    }

    if (path.length === 0) return [r, c, facing];

    var [next, ...rest] = path;
    if (next === 'R' || next === 'L') {
        return () => walkCube([r, c, rotate(facing, next)], rest, maze);
    } else {
        let [newR, newC, newFacing] = makeStepOnCube(r, c, facing, maze);
        let stepsLeft = next - 1;
        if (stepsLeft > 0) return () => walkCube([newR, newC, newFacing], [stepsLeft, ...rest], maze);
        return () => walkCube([newR, newC, newFacing], rest, maze);
    }
}

// The JavaScript Modulo Bug
// https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
Number.prototype.mod = function (n) {
    'use strict';
    return ((this % n) + n) % n;
};

var [maze, path] = getData(PUZZLE_INPUT_PATH)(parser);
var start = [0, maze[0].indexOf('.'), 0];
var [r, c, facing] = trampoline(walkPath)(start, path, maze);
console.log('Part 1:', 1000 * (r + 1) + 4 * (c + 1) + facing);

var [r, c, facing] = trampoline(walkCube)(start, path, maze);
console.log('Part 2:', 1000 * (r + 1) + 4 * (c + 1) + facing);
