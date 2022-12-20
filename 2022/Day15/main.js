import { getData, getPath, min, max } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var reach = ([x1, y1, x2, y2]) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
    var sensors = [];
    var beacons = new Set();
    input
        .split('\n')
        .forEach((row) => {
            let caps = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
                .slice(1)
                .map(Number);

            beacons.add(`${caps[2]},${caps[3]}`);
            sensors.push([caps[0], caps[1], reach(caps)]);
        });
    return { sensors, beacons: [...beacons].map(b => b.split(',').map(Number)) };
}

function countPosWithoutBeacons({ sensors, beacons }, yy) {
    var distanceToTargetLine = (y) => Math.abs(y - yy);
    var canReachTargetLine = ([x, y, reach]) => reach >= distanceToTargetLine(y);
    var MIN_X = Number.MAX_SAFE_INTEGER;
    var MAX_X = Number.MIN_SAFE_INTEGER;
    sensors
        .filter(canReachTargetLine)
        .forEach(([x, y, reach]) => {
            let minx = x - (reach - distanceToTargetLine(y));
            let maxx = x + (reach - distanceToTargetLine(y));
            MIN_X = min([MIN_X, minx]);
            MAX_X = max([MAX_X, maxx]);
        });
    return (MAX_X - MIN_X + 1) - beacons.filter(([x, y]) => y === yy).length;
}

var map = getData(PUZZLE_INPUT_PATH)(parser);
console.log(map);

console.log('Part 1:', countPosWithoutBeacons(map, 2000000));
// console.log('Part 2:');
