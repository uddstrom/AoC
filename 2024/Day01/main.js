import { count, getData, getPath, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").reduce(
        ([L1, L2], line) => {
            var [l1, l2] = line.split("   ");
            L1.push(Number(l1));
            L2.push(Number(l2));
            return [L1.toSorted(), L2.toSorted()];
        },
        [[], []]
    );
}

var [LID1, LID2] = getData(PUZZLE_INPUT_PATH)(parser);
var DISTS = LID1.map((lid1, idx) => Math.abs(lid1 - LID2[idx]));
var SIMS = LID1.map((lid1) => lid1 * count(lid1, LID2));

console.log("Part 1:", sum(DISTS));
console.log("Part 2:", sum(SIMS));
