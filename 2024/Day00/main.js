import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n');
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', data);
console.log('Part 2:');
