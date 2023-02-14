import { getData, getPath, min } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('');
}

function trigger(polymer) {
    var pol = [...polymer];
    var i = 0;
    while (i + 1 < pol.length) {
        let p1 = pol[i];
        let p2 = pol[i + 1];
        if (p1 !== p2 && p1.toLowerCase() === p2.toLowerCase()) {
            // reaction!
            pol.splice(i, 2);
            i = i - 2 < 0 ? 0 : i - 2;
        } else {
            i++;
        }
    }
    return pol.length;
}

function optimize(polymer) {
    var unitTypes = 'abcdefghijkklmnopqrstuvwxyz'.split('').map(c => [c, c.toUpperCase()]);
    var results = unitTypes.map(([t1, t2]) => trigger(polymer.filter(t => t !== t1 && t !== t2)));
    return min(results);
}

var polymer = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', trigger(polymer));
console.log('Part 2:', optimize(polymer));
