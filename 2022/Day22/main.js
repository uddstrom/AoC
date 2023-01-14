import { getData, getPath, max } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    function parseMaze(maze) {
        var tempMaze = maze.split('\n').map((line) => line.split(''));
        var maxCols = max(tempMaze.map((row) => row.length));
        return maze
            .split('\n')
            .map((line) => line.padEnd(maxCols, ' ').split(''));
    }

    function parsePath(path) {
        if (!path.includes('R') && !path.includes('L')) return Number(path);
        if (path.startsWith('R'))
            return ['R', parsePath(path.substring(1))].flat();
        if (path.startsWith('L'))
            return ['L', parsePath(path.substring(1))].flat();

        var indexOfR = path.indexOf('R');
        var indexOfL = path.indexOf('L');

        if (indexOfR < indexOfL && indexOfR >= 0) {
            return [
                Number(path.substring(0, indexOfR)),
                parsePath(path.substring(indexOfR)),
            ].flat();
        }

        return [
            Number(path.substring(0, indexOfL)),
            parsePath(path.substring(indexOfL)),
        ].flat();
    }

    var [maze, path] = input.split('\n\n');
    return [parseMaze(maze), parsePath(path)];
}

function rotate(facing, dir) {
    if (dir === 'R') return (facing + 1).mod(4);
    if (dir === 'L') return (facing - 1).mod(4);
}

function makeStep(r, c, facing, maze) {
    var FACINGS = { RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3 };

    if (facing === FACINGS.RIGHT) {
        if (c < maze[r].length - 1) {
            var tile = maze[r][c + 1];
            if (tile === '.') return [r, c + 1];
            if (tile === '#') return [r, c];
        }
        var nc = maze[r].findIndex((tile) => tile !== ' ');
        return maze[r][nc] === '.' ? [r, nc] : [r, c];
    }

    if (facing === FACINGS.LEFT) {
        if (c > 0) {
            var tile = maze[r][c - 1];
            if (tile === '.') return [r, c - 1];
            if (tile === '#') return [r, c];
        }
        var nc = maze[r].findLastIndex((tile) => tile !== ' ');
        return maze[r][nc] === '.' ? [r, nc] : [r, c];
    }

    if (facing === FACINGS.DOWN) {
        if (r < maze.length - 1) {
            var tile = maze[r + 1][c];
            if (tile === '.') return [r + 1, c];
            if (tile === '#') return [r, c];
        }
        var nr = maze.findIndex((row) => row[c] !== ' ');
        return maze[nr][c] === '.' ? [nr, c] : [r, c];
    }

    if (facing === FACINGS.UP) {
        if (r > 0) {
            var tile = maze[r - 1][c];
            if (tile === '.') return [r - 1, c];
            if (tile === '#') return [r, c];
        }
        var nr = maze.findLastIndex((row) => row[c] !== ' ');
        return maze[nr][c] === '.' ? [nr, c] : [r, c];
    }
}

function walkPath([r, c, facing], path, maze) {
    if (path.length === 0) return [r, c, facing];

    var [next, ...rest] = path;
    if (next === 'R' || next === 'L') {
        return () => walkPath([r, c, rotate(facing, next)], rest, maze);
    } else {
        let [newR, newC] = makeStep(r, c, facing, maze);
        let stepsLeft = next - 1;
        if (stepsLeft > 0)
            return () =>
                walkPath([newR, newC, facing], [stepsLeft, ...rest], maze);
        return () => walkPath([newR, newC, facing], rest, maze);
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
console.log('Part 2:');
