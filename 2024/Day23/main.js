import { getData, getPath } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var G = new Map();
    input.split('\n').map(line => line.split("-")).forEach(([n, m]) => {
        if (!G.has(n)) G.set(n, new Set());
        if (!G.has(m)) G.set(m, new Set());
        G.get(n).add(m);
        G.get(m).add(n);
    });
    return G;
}

var G = getData(PUZZLE_INPUT_PATH)(parser);

var largest = (list) => list.sort((arr1, arr2) => arr1.length - arr2.length).pop();
var areConnected = (a, b) => G.get(a).has(b);

var DP = new Map();
function largestSet(a, connectionsOfA) {
    var id = `${a},${[...connectionsOfA].sort().join()}`;
    if (DP.has(id)) return DP.get(id);
    if (connectionsOfA.size === 0) return [a];
    if (areAllConnected(connectionsOfA)) return [a, ...connectionsOfA];

    var list = [...connectionsOfA].map(b => {
        var x = new Set([...G.get(b)].filter(c => connectionsOfA.has(c))); // connections of head that is also in tail
        return largestSet(b, x);
    });
    var res = [a, ...largest(list)];
    DP.set(id, res);

    return res;
}

var areAllConnected = trampoline(function areAllConnected(computers) {
    if (computers.size === 1) return true;

    var C = [...computers];
    if (computers.size === 2) {
        return areConnected(C[0], C[1]);
    }

    var [head, ...tail] = C;
    for (let c of tail) {
        if (!areConnected(head, c)) return false;
    }

    return () => areAllConnected(new Set(tail));
});

var interconnected = new Set();
G.keys().forEach((a) => {
    let EA = G.get(a);
    EA.forEach((b) => {
        G.get(b).forEach((c) => {
            if (EA.has(c) && c !== a) {
                interconnected.add([a, b, c].sort().join());
            }
        });
    });
});

console.log('Part 1:', [...interconnected].filter(str => str.match(/^t|,t/)).length);
console.log('Part 2:', largest([...G.keys()].map((n) => largestSet(n, G.get(n)))).sort().join());
