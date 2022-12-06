import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input;
}

function findMarker(stream, size, marker = size) {
    if (marker > stream.length) return 'not found';
    var distinct = new Set(stream.slice(marker - size, marker).split(''));
    if (distinct.size === size) return marker;
    return findMarker(stream, size, marker + 1);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', findMarker(data, 40));
console.log('Part 2:', findMarker(data, 14));
