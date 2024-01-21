import { getData, getPath, intersect, matrix, max, range } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split("~").map((v) => v.split(",").map(Number)));
}

function print(bricks) {
    function printMatrix(M) {
        M.forEach((row) => console.log(row));
    }

    var X =
        max(
            bricks.map((v) => {
                var [[x1, y1, z1], [x2, y2, z2]] = v;
                return max([x1, x2]);
            })
        ) + 1;

    var Y =
        max(
            bricks.map((v) => {
                var [[x1, y1, z1], [x2, y2, z2]] = v;
                return max([y1, y2]);
            })
        ) + 1;

    var Z =
        max(
            bricks.map((v) => {
                var [[x1, y1, z1], [x2, y2, z2]] = v;
                return max([z1, z2]);
            })
        ) + 1;

    var brickIds = "ABCDEFGHIJ";
    var space = Array(Z)
        .fill()
        .map((l) => matrix(X, Y, ""));

    bricks.forEach((v, i) => {
        var [[x1, y1, z1], [x2, y2, z2]] = v;
        for (let z = z1; z <= z2; z++) {
            for (let y = y1; y <= y2; y++) {
                for (let x = x1; x <= x2; x++) {
                    space[z][y][x] = brickIds.charAt(i);
                }
            }
        }
    });

    for (let z = Z - 1; z > 0; z--) {
        console.log(`-- z: ${z} --------------`);
        printMatrix(space[z]);
    }
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
    var bricksMovedCount = 0;
    B.forEach((brick) => {
        // z coord of brick z > 1, otherwise brick is at lowest z already
        if (brick[0][2] > 1) {
            if (bricksBelow(brick, B).length === 0) {
                // move down
                // console.log("nothing below brick", brick);
                bricksMovedCount++;
                brick[0][2] = brick[0][2] - 1;
                brick[1][2] = brick[1][2] - 1;
                // console.log("moved down to", brick);
            }
        }
    });
    return bricksMovedCount;
}

function canBeDisintegrated(brick, B) {
    for (let b of bricksAbove(brick, B)) {
        if (!bricksBelow(b, B).some((b) => b !== brick)) return false;
    }
    return true;
}

var B = getData(PUZZLE_INPUT_PATH)(parser);

var i = mergeDown(B);
while (i > 0) i = mergeDown(B);

var p1 = B.map((brick) => canBeDisintegrated(brick, B)).filter(Boolean).length;

console.log("Part 1:", p1);
// console.log("Part 2:");
