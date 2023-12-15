import { getData, getPath, count, rng, sum } from '../lib/utils.js';

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

var ans = 0;
var DP = new Map();
// pi = pattern index
// gi = group index
// dashes = number of consecutive dashes
function solve(pattern, grps, pi = 0, gi = 0, dashes = 0) {
    if (pi === pattern.length) {
        if (gi === grps.length || (gi === grps.length - 1 && grps[gi] === dashes)) ans++;
        return;
    }

    var key = `${pi},${gi},${dashes}`; // will use this for DP later.

    if (DP.has(key)) return DP.get(key);
    var p = pattern[pi];
    var g = grps[gi];

    if (p === '.') {
        if (dashes === 0) solve(pattern, grps, pi + 1, gi, 0);
        if (dashes > 0 && dashes === g) solve(pattern, grps, pi + 1, gi + 1, 0);
    }
    if (p === '#') {
        if (dashes + 1 <= g) solve(pattern, grps, pi + 1, gi, dashes + 1);
    }
    if (p === '?') {
        // Test with ".".
        if (dashes === 0) solve(pattern, grps, pi + 1, gi, 0);
        if (dashes > 0 && dashes === g) solve(pattern, grps, pi + 1, gi + 1, 0);

        // Test with "#".
        if (dashes + 1 <= g) solve(pattern, grps, pi + 1, gi, dashes + 1);

        return;
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var start = Date.now();

//solve('.??..??...?##.'.split(''), '1,1,3'.split(',').map(Number));
//solve('???.###'.split(''), '1,1,3'.split(',').map(Number));
//solve('?###????????'.split(''), '3,2,1'.split(',').map(Number));

data.forEach(([pattern, grps]) => solve(pattern.split(''), grps.split(',').map(Number)));

//data.map(unfold).forEach(([pattern, grps]) => solve(pattern.split(''), grps.split(',').map(Number)));

var t = Date.now() - start;

console.log('Part 1:', ans, t);
console.log('Part 2:');
