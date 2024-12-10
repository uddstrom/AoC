import { getData, getPath, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var [rules, updates] = input.split("\n\n");

    return [
        rules.split("\n").map((rule) => rule.split("|").map(Number)),
        updates.split("\n").map((update) => update.split(",").map(Number)),
    ];
}

var [rules, updates] = getData(PUZZLE_INPUT_PATH)(parser);

function compare(a, b) {
    var rule = rules.find((rule) => rule.includes(a) && rule.includes(b));
    if (rule?.indexOf(a) === 0) return -1; // sort a before b
    if (rule?.indexOf(a) === 1) return 1; // sort a after b
    return 0;
}

var p1 = sum(
    updates.map((update) => {
        var sorted = [...update].sort(compare);
        return sorted.toString() === update.toString() ? update[Math.floor(update.length / 2)] : 0;
    })
);

var p2 = sum(
    updates.map((update) => {
        var sorted = [...update].sort(compare);
        return sorted.toString() !== update.toString() ? sorted[Math.floor(update.length / 2)] : 0;
    })
);

console.log("Part 1:", p1);
console.log("Part 2:", p2);
