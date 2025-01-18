import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var [wires, gates] = input.split('\n\n');
    var W = new Map();
    wires.split('\n').map(line => line.split(': ')).forEach(([name, val]) => W.set(name, Number(val)));
    gates = gates.split('\n').map(line => {
        var { in1, in2, op, out } = line.match(/^(?<in1>.{3})\s(?<op>AND|OR|XOR)\s(?<in2>.{3})\s->\s(?<out>.{3})$/).groups;
        return { in1, in2, op, out };
    });
    return [W, gates];
}

function gate(in1, in2, op) {
    if (op === "AND") return in1 && in2;
    if (op === "OR") return in1 || in2;
    if (op === "XOR") return in1 ^ in2;
}

function run(wires, gates) {
    var W = structuredClone(wires);
    var G = structuredClone(gates);
    while (G.length > 0) {
        var { in1, in2, op, out } = G.shift();
        if (W.has(in1) && W.has(in2)) {
            W.set(out, gate(W.get(in1), W.get(in2), op));
        } else {
            G.push({ in1, in2, op, out });
        }
    }
    return [...W.entries()].filter(([wire]) => wire.startsWith('z')).sort().reverse().map(([_, val]) => val).join('');
}

var [wires, gates] = getData(PUZZLE_INPUT_PATH)(parser);


var x = [...wires.entries()].filter(([wire]) => wire.startsWith('x')).sort().reverse().map(([_, val]) => val).join('');
var y = [...wires.entries()].filter(([wire]) => wire.startsWith('y')).sort().reverse().map(([_, val]) => val).join('');
var z = run(wires, gates);

console.log('x', x, parseInt(x, 2));
console.log('y', y, parseInt(y, 2));
console.log('z', z, parseInt(z, 2));

var expected = parseInt(x, 2) + parseInt(y, 2);
console.log('e', expected.toString(2), expected);

// z 10.1011.1011.0110.1010.1000.1010.1000.0011.1110.1110.0110 48063513640678
// e 10.1011.0111.0110.1001.0111.1010.1000.0100.0110.1110.0110 47788350523110
//   44   40   36   32   28   24   20   16   12    8    4    0

// Bad bits: 11, 12, 13, 14, 24, 25, 26, 27, 28, 29, 38, 39

var outputPorts = [...new Set(gates.map(({ out }) => out))].sort();
console.log(outputPorts, outputPorts.length);

console.log('Part 1:', parseInt(z, 2));
console.log('Part 2:',);
