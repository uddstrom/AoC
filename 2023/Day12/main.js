import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => line.split(' '));
}

function unfold([pattern, grps]) {
    return [
        pattern + '?' + pattern + '?' + pattern + '?' + pattern + '?' + pattern,
        grps + ',' + grps + ',' + grps + ',' + grps + ',' + grps,
    ];
}

// pi = pattern index
// gi = group index
// dashes = number of consecutive '#'
function solve(pattern, grps, pi = 0, gi = 0, dashes = 0, DP = new Map()) {
    var key = `${pi},${gi},${dashes}`;
    if (DP.has(key)) return DP.get(key);

    var cnt = 0;
    if (pi === pattern.length) {
        if (gi === grps.length || (gi === grps.length - 1 && grps[gi] === dashes)) return 1;
        return 0;
    }

    var p = pattern[pi];
    var g = grps[gi];

    if (p === '.' && dashes === 0) cnt += solve(pattern, grps, pi + 1, gi, 0, DP);
    if (p === '.' && dashes > 0 && dashes === g) cnt += solve(pattern, grps, pi + 1, gi + 1, 0, DP);
    if (p === '#' && dashes + 1 <= g) cnt += solve(pattern, grps, pi + 1, gi, dashes + 1, DP);
    if (p === '?') {
        // Test with ".".
        if (dashes === 0) cnt += solve(pattern, grps, pi + 1, gi, 0, DP);
        if (dashes > 0 && dashes === g) cnt += solve(pattern, grps, pi + 1, gi + 1, 0, DP);
        // Test with "#".
        if (dashes + 1 <= g) cnt += solve(pattern, grps, pi + 1, gi, dashes + 1, DP);
    }

    DP.set(key, cnt);
    return cnt;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = sum(data.map(([pattern, grps]) => solve(pattern.split(''), grps.split(',').map(Number))));
var p2 = sum(data.map(unfold).map(([pattern, grps]) => solve(pattern.split(''), grps.split(',').map(Number))));

console.log('Part 1:', p1);
console.log('Part 2:', p2);
