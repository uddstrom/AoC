import { count, getData, getPath, min, max, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((coords) => coords.split(', ').map(Number));
}

function manhattan([x1, y1], [x2, y2]) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

var coords = getData(PUZZLE_INPUT_PATH)(parser);

var minx = min(coords.map(([x, y]) => x));
var maxx = max(coords.map(([x, y]) => x));
var miny = min(coords.map(([x, y]) => y));
var maxy = max(coords.map(([x, y]) => y));

function p1() {
	// the grid contains the index of the clostest coord.
	var grid = range(miny, maxy).map(y => {
		return range(minx, maxx).map(x => {
			var min_d = Number.MAX_SAFE_INTEGER;
			var min_i = undefined;
			var tie = false;
			coords.forEach((c, i) => {
				var d = manhattan(c, [x, y]);
				if (d < min_d) {
					min_i = i;
					min_d = d;
					tie = false;
				} else if (d == min_d) {
					tie = true;
				}
			});
			return tie ? -1 : min_i;
		});
	});

	var non_infinite = coords.filter(([x, y]) => {
		
		var isBelow = coords.filter(([xx, yy]) => yy > y);
		var isAbove = coords.filter(([xx, yy]) => yy < y);
		var isLeft = coords.filter(([xx, yy]) => xx < x);
		var isRight = coords.filter(([xx, yy]) => xx > x);
		
		var stopperBelow = false;
		var stopperAbove = false;
		var stopperRight = false;
		var stopperLeft = false;

		for (let [xx, yy] of isBelow) {
			if (Math.abs(yy - y) >= Math.abs(xx - x)) {
				stopperBelow = true;
				break;
			}
		}
		
		for (let [xx, yy] of isAbove) {
			if (Math.abs(yy - y) >= Math.abs(xx - x)) {
				stopperAbove = true;
				break;
			}
		}
		
		for (let [xx, yy] of isLeft) {
			if (Math.abs(xx - x) >= Math.abs(yy - y)) {
				stopperLeft = true;
				break;
			}
		}
		
		for (let [xx, yy] of isRight) {
			if (Math.abs(yy - y) >= Math.abs(xx - x)) {
				stopperRight = true;
				break;
			}
		}

		return stopperBelow && stopperAbove && stopperRight && stopperLeft;

	});

	return max(coords.map((c, i) => {
		if (non_infinite.includes(c)) {
			return count(i, grid.flat());
		}
		return 0;
	}));
}


function p2(limit) {
	var grid = range(miny, maxy).map(y => {
		return range(minx, maxx).map(x => {
			return coords.reduce((acc, curr) => acc + manhattan(curr, [x, y]), 0) < limit
				? 1 : 0;
		});
	});
	return grid.flat().reduce((acc, curr) => acc + curr, 0);
}

console.log('Part 1:', p1());
console.log('Part 2:', p2(10000));
