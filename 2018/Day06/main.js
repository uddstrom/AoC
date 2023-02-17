import { count, getData, getPath, min, max, range, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
	return input.split('\n').map((coords) => coords.split(', ').map(Number));
}

function manhattan([x1, y1], [x2, y2]) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function isFinite([x, y]) {

	var coordsBelow = coords.filter(([_, yy]) => yy > y);
	var coordsAbove = coords.filter(([_, yy]) => yy < y);
	var coordsLeft = coords.filter(([xx, _]) => xx < x);
	var coordsRight = coords.filter(([xx, _]) => xx > x);

	var stopperBelow = false;
	var stopperAbove = false;
	var stopperRight = false;
	var stopperLeft = false;

	for (let [xx, yy] of coordsBelow) {
		if (Math.abs(yy - y) >= Math.abs(xx - x)) {
			stopperBelow = true;
			break;
		}
	}

	for (let [xx, yy] of coordsAbove) {
		if (Math.abs(yy - y) >= Math.abs(xx - x)) {
			stopperAbove = true;
			break;
		}
	}

	for (let [xx, yy] of coordsLeft) {
		if (Math.abs(xx - x) >= Math.abs(yy - y)) {
			stopperLeft = true;
			break;
		}
	}

	for (let [xx, yy] of coordsRight) {
		if (Math.abs(yy - y) >= Math.abs(xx - x)) {
			stopperRight = true;
			break;
		}
	}

	return stopperBelow && stopperAbove && stopperRight && stopperLeft;
}

var coords = getData(PUZZLE_INPUT_PATH)(parser);

var minx = min(coords.map(([x, y]) => x));
var maxx = max(coords.map(([x, y]) => x));
var miny = min(coords.map(([x, y]) => y));
var maxy = max(coords.map(([x, y]) => y));

function p1() {
	// the grid contains the index of the closest coord.
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
	}).flat();

	var non_infinite = coords.filter(isFinite);

	return max(coords.map((c, i) => non_infinite.includes(c) ? count(i, grid) : 0));
}

function p2() {
	var grid = range(miny, maxy).map(y => {
		return range(minx, maxx).map(x => {
			return coords.reduce((acc, curr) => acc + manhattan(curr, [x, y]), 0) < 10000
				? 1 : 0;
		});
	});
	return sum(grid.flat());
}

console.log('Part 1:', p1());
console.log('Part 2:', p2());
