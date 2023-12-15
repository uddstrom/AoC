import { getData, getPath, rng, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n\n").map((grid) => {
        var rows = grid.split("\n");
        var R = rows.map((row) => parseInt(row.replaceAll("#", 1).replaceAll(".", 0), 2));
        var C = rng(rows[0].length)
            .map((i) => rows.map((row) => row[i]))
            .map((cols) => parseInt(cols.join("").replaceAll("#", 1).replaceAll(".", 0), 2));
        return [R, C];
    });
}

function findReflection(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            let k = i - 1;
            let l = i + 2;
            var reflection = true;
            while (k >= 0 && l < arr.length) {
                // console.log("Comparing", arr[k], arr[l]);
                if (arr[k] !== arr[l]) {
                    reflection = false;
                    break;
                }
                k--;
                l++;
            }
            if (reflection) return i + 1;
        }
    }
    return 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = sum(
    data.map(([R, C]) => {
        var rows = findReflection(R);
        var cols = findReflection(C);
        return cols + 100 * rows;
    })
);

console.log("Part 1:", p1);
console.log("Part 2:");
