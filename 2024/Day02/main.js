import { getData, getPath, removeAt, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(' ').map(Number));
}

function processLine(line, prev, shouldIncrease) {
    if (line.length === 0) return true;
    var [head, ...tail] = line;
    shouldIncrease = shouldIncrease ?? head < tail[0];
    if (prev !== undefined) {
        if (head === prev || Math.abs(head - prev) > 3) return false;
        if (shouldIncrease && head < prev) return false;
        if (!shouldIncrease && head > prev) return false;
    }

    return processLine(tail, head, shouldIncrease);
}

function processData(p1, data) {
    return data
        .map((line) => {
            var isSafe = processLine(line);
            if (p1 || isSafe) return isSafe;
            // activate problem dampener
            var safeWithProblemDampener = rng(line.length).map((i) => processLine(removeAt(line, i)));
            return safeWithProblemDampener.some((el) => el === true);
        })
        .filter((x) => x === true).length;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', processData(true, data));
console.log('Part 2:', processData(false, data));
