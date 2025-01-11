import { getData, getPath } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(line => line.split("-"));
}

Array.prototype.has = function(el) {
    return this.some(e => e === el);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var getLongest = (list) => list.sort((arr1, arr2) => arr1.length - arr2.length).pop();
var allConnections = (a) => data.filter(pair => pair.has(a)).map(([x, y]) => x === a ? y : x);
var areConnected = (a, b) => data.some(pair => pair.has(a) && pair.has(b));

var DP = new Map();
function largestSet(a, connectionsOfA) {
    if (DP.has(`${a},${connectionsOfA.sort().join()}`)) {
        return DP.get(`${a},${connectionsOfA.sort().join()}`);
    }
    if (connectionsOfA.length === 0) return [a];
    if (areAllConnected(connectionsOfA)) {
        return [a, ...connectionsOfA];
    }
    var list = connectionsOfA.map(b => {
        var x = computerMap.get(b).filter(c => connectionsOfA.has(c)); // connections of head that is also in tail
        return largestSet(b, x);
    });
    var res = [a, ...getLongest(list)];
    DP.set(`${a},${connectionsOfA.sort().join()}`, res);
    return res;
}


var DP1 = new Map();
var areAllConnected = trampoline(function areAllConnected(computers) {
    if (DP1.has(computers.sort().join())) {
        return DP1.get(computers.sort().join());
    }
    var [head, ...tail] = computers;
    if (tail.length === 0) {
        return true;
    }
    if (tail.length === 1) {
        return areConnected(head, tail[0]);
    }
    for (let c of tail) {
        if (!areConnected(head, c)) {
            DP1.set(computers.sort().join(), false);
            return false;
        }
    }
    return () => areAllConnected(tail);
});

var interconnected = [];
data.forEach(([a, b]) => {
    var A = data.filter((pair) => pair.has(a));
    A.forEach(pair => {
        var c = pair.find(comp => comp !== a && comp !== b);
        if (areConnected(b, c)) {
            interconnected.push([a, b, c]);
        }
    });
});

interconnected = interconnected.map(computers => computers.sort().join());
var distinct = [...new Set(interconnected)];
var T = distinct.filter(str => str.match(/^t|,t/));


var C = [...new Set(data.flatMap(pair => pair))]; // the set of distinct computers
var computerMap = new Map(C.map(c => [c, allConnections(c)]));

var x = C.map((a, i) => {
    console.log(i);
    return largestSet(a, computerMap.get(a));
});

console.log('Part 1:', T.length);
console.log('Part 2:', getLongest(x).sort().join());




