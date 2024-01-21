import { getData, getPath, intersect, range, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split("~").map((v) => v.split(",").map(Number)));
}

function overlaps(a1, a2, b1, b2) {
    return intersect(range(a1, a2), range(b1, b2)).length > 0;
}

function bricksBelow(brick, B) {
    var [[x1, y1, z1], [x2, y2, z2]] = brick;
    return B.filter((b) => {
        var [[xx1, yy1, zz1], [xx2, yy2, zz2]] = b;
        return zz2 === z1 - 1 && overlaps(x1, x2, xx1, xx2) && overlaps(y1, y2, yy1, yy2);
    });
}

function bricksAbove(brick, B) {
    var [[x1, y1, z1], [x2, y2, z2]] = brick;
    return B.filter((b) => {
        var [[xx1, yy1, zz1], [xx2, yy2, zz2]] = b;
        return zz1 === z2 + 1 && overlaps(x1, x2, xx1, xx2) && overlaps(y1, y2, yy1, yy2);
    });
}

function mergeDown(B) {
    var bricksMoved = 0;
    B.forEach((brick) => {
        // z coord of brick z > 1, otherwise brick is at lowest z already
        while (brick[0][2] > 1 && bricksBelow(brick, B).length === 0) {
            bricksMoved++;
            brick[0][2] = brick[0][2] - 1;
            brick[1][2] = brick[1][2] - 1;
        }
    });
    return bricksMoved > 0;
}

function settle(B) {
    let BB = structuredClone(B);
    while (mergeDown(BB));
    return BB;
}

function disintegrate(brick, B) {
    for (let b of bricksAbove(brick, B)) {
        if (!bricksBelow(b, B).some((b) => b !== brick)) {
            let unsettled = B.filter((b) => b !== brick);
            let settled = settle(unsettled.filter((b) => b !== brick));
            let bricksThatMoved = unsettled
                .map((b, i) => b.toString() !== settled[i].toString())
                .filter(Boolean).length;
            return bricksThatMoved;
        }
    }
    return 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var settledBricks = settle(data);
var D = settledBricks.map((brick) => disintegrate(brick, settledBricks));

var p1 = D.filter((n) => n === 0).length;
var p2 = sum(D);

// ~5 min to calculate answer.
console.log("Part 1:", p1); // 413
console.log("Part 2:", p2); // 41610
