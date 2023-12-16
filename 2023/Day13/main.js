import { getData, getPath, rng, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n\n").map((grid) => {
        var rows = grid.split("\n");
        var R = rows.map((row) => row.replaceAll("#", 1).replaceAll(".", 0));
        var C = rng(rows[0].length)
            .map((i) => rows.map((row) => row[i]))
            .map((cols) => cols.join("").replaceAll("#", 1).replaceAll(".", 0));
        return [R, C];
    });
}

function getDiff(n1, n2) {
    var xor = (a, b) => a ^ b;
    return n1
        .split("")
        .map((n, i) => xor(n, n2[i]))
        .filter(Boolean).length;
}

function findReflection(arr, diffTolerance = 0) {
    for (let i = 0; i < arr.length - 1; i++) {
        let left = i;
        let right = i + 1;
        var diff = 0;
        while (left >= 0 && right < arr.length) {
            diff += getDiff(arr[left], arr[right]);
            left--;
            right++;
        }
        if (diff === diffTolerance) return i + 1;
    }
    return 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = sum(data.map(([R, C]) => findReflection(C) + 100 * findReflection(R)));
var p2 = sum(data.map(([R, C]) => findReflection(C, 1) + 100 * findReflection(R, 1)));

console.log("Part 1:", p1);
console.log("Part 2:", p2);
