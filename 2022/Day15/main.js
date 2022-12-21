import { getData, getPath, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var reach = ([x1, y1, x2, y2]) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
    var sensors = [];
    var beacons = new Set();
    input.split('\n').forEach((row) => {
        let captures = row
            .match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
            .slice(1)
            .map(Number);

        beacons.add(`${captures[2]},${captures[3]}`);
        sensors.push([captures[0], captures[1], reach(captures)]);
    });
    return { sensors, beacons: [...beacons].map((b) => b.split(',').map(Number)) };
}

function getLineCoverage({ sensors }, target_y) {
    var distanceToTargetLine = (y) => Math.abs(y - target_y);
    var canReachTargetLine = ([_, y, reach]) => reach >= distanceToTargetLine(y);
    return sensors.filter(canReachTargetLine).map(([x, y, reach]) => {
        let dx = reach - distanceToTargetLine(y);
        return [x - dx, x + dx];
    });
}

function countPosWithoutBeacons({ sensors, beacons }, line_y) {
    var intervals = getLineCoverage({ sensors }, line_y);
    var X = new Set(); // all x covered by a sensor on line line_y
    intervals.forEach(([from_x, to_x]) => range(from_x, to_x).forEach((x) => X.add(x)));
    return X.size - beacons.filter(([_, y]) => y === line_y).length;
}

function searchLineForUncoveredSpot({ sensors }, y) {
    let intervals = getLineCoverage({ sensors }, y);
    let x = 0;
    while (x < 4000000) {
        let interval = intervals.find(([from_x, to_x]) => x >= from_x && x <= to_x);
        if (!interval) return [x, y]; // x is not covered by any sensor
        x = interval[1] + 1;
    }
    return undefined;
}

function findDistressBeacon(map) {
    var line = 0;
    while (line < 4000000) {
        let spot = searchLineForUncoveredSpot(map, line);
        if (spot) return 4000000 * spot[0] + spot[1];
        line++;
    }
}

var map = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', countPosWithoutBeacons(map, 2000000));
console.log('Part 2:', findDistressBeacon(map));
