import { getData, getPath, min } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('');
}

function trigger(polymer) {
    var pol = [...polymer];
    for (let i = 1; i < pol.length; i++) {
        let p1 = pol[i - 1];
        let p2 = pol[i];
        if (p1 !== p2 && p1.toLowerCase() === p2.toLowerCase()) {
            // reaction!
            pol.splice(i - 1, 2);
            i = i - 2 > 0 ? i - 2 : 0;
        }
    }
    return pol.length;
}

function optimize(polymer) {
    var unitTypes = 'abcdefghijkklmnopqrstuvwxyz'.split('').map(c => [c, c.toUpperCase()]);
    var results = unitTypes.map(([p1, p2]) => {
        var pol = [...polymer].filter(c => c !== p1 && c !== p2);
        var res = trigger(pol);
        return res;
    });
    return min(results);
}

var polymer = getData(PUZZLE_INPUT_PATH)(parser);
console.log('Part 1:', trigger(polymer));
console.log('Part 2:', optimize(polymer));
