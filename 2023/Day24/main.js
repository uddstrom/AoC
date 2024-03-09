import { getData, getPath } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((row) => row.split("@").map((part) => part.split(",").map(Number)));
}

function intersection(v1, v2) {
    // vector math
    // v1 = (x1, y1, z1) + λ(dx1, dy1, dz1)
    // v2 = (x2, y2, z2) + μ(dx2, dy2, dz2)

    var [[x1, y1, z1], [dx1, dy1, dz1]] = v1;
    var [[x2, y2, z2], [dx2, dy2, dz2]] = v2;

    var mu = (y2 - y1 + (dy1 / dx1) * (x1 - x2)) / ((dy1 * dx2) / dx1 - dy2);
    var lamda = (x2 + dx2 * mu - x1) / dx1;

    var x = x1 + lamda * dx1;
    var y = y1 + lamda * dy1;

    return [v1, v2, x, y];
}

function isWithinTestArea([v1, v2, x, y]) {
    var min = 200000000000000;
    var max = 400000000000000;

    return x >= min && x <= max && y >= min && y <= max;
}

function isFutureIntersection([v1, v2, x, y]) {
    function isFutureCoordinate(curr, delta, target) {
        return delta > 0 ? target > curr : target < curr;
    }
    var [[x1, y1], [dx1, dy1]] = v1;
    var [[x2, y2], [dx2, dy2]] = v2;

    return (
        isFutureCoordinate(x1, dx1, x) &&
        isFutureCoordinate(y1, dy1, y) &&
        isFutureCoordinate(x2, dx2, x) &&
        isFutureCoordinate(y2, dy2, y)
    );
}

var hailstones = getData(PUZZLE_INPUT_PATH)(parser);

var intersections = hailstones
    .flatMap((v1, i1) => hailstones.map((v2, i2) => (i2 > i1 ? intersection(v1, v2) : undefined)))
    .filter(Boolean)
    .filter(isFutureIntersection)
    .filter(isWithinTestArea).length;

console.log("Part 1:", intersections);
console.log("Part 2:");
