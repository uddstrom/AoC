import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map(line => line.split(''));
}

var MAS = 'MAS';
var PATTERNS = [
	[[0, -1], [0, -2], [0, -3]], // N
	[[1, -1], [2, -2], [3, -3]], // NE
	[[1, 0], [2, 0], [3, 0]],  // E
	[[1, 1], [2, 2], [3, 3]], // SE
	[[0, 1], [0, 2], [0, 3]], // S
	[[-1, 1], [-2, 2], [-3, 3]], // SW
	[[-1, 0], [-2, 0], [-3, 0]], // W
	[[-1, -1], [-2, -2], [-3, -3]]  // NW
];


function search(grid, r, c) {
	if (grid[r][c] !== 'X') return 0;
	return sum(PATTERNS.map((pattern) => {
		for (let [idx, [dr, dc]] of pattern.entries()) {
			if (grid[r+dr] === undefined || grid[r+dr][c+dc] !== MAS[idx]) return 0;
		}
		return 1;
	}, 0));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var ROWS = data.length;
var COLS = data[0].length;

var res = rng(ROWS).flatMap((r) => rng(COLS).map((c) => search(data, r, c)));

console.log('Part 1:', sum(res));
console.log('Part 2:');
