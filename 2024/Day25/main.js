import { count, getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

var rotate = (G) => G[0].map((_, i) => G.map(row => row[i]).reverse());
var isLock = (G) => G[0].every(c => c === '#');
var convert = (G) => rotate(G).map(row => count('#', row) - 1);

function parser(input) {
    var locks = [];
    var keys = [];
    input.split('\n\n').forEach((schema) => {
        var grid = schema.split('\n').map((row) => row.split(''));
        isLock(grid) ? locks.push(convert(grid)) : keys.push(convert(grid));
    });
    return [locks, keys];
}

var fit = (key, lock) => key.every((k, i) => k + lock[i] < 6);
var [locks, keys] = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', sum(locks.flatMap((lock) => keys.map((key) => fit(key, lock)))));
