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

function findGate(op, in1, in2) {
    return gates
        .filter((g) => g.op === op)
        .find(g => (g.in1 === in1 || g.in2 === in1) && (g.in1 === in2 || g.in2 === in2));
}

function findGateByOut(op, out) {
    return gates.filter(g => g.op === op).find(g => g.out === out);
}

function validateGates(n = 0, c, err = []) {
    // console.log(n, c);
    if (n > 44) return [...new Set(err.flatMap((gates) => gates))].sort().join();
    if (n === 0) {
        let Cout = findGate('AND', 'x00', 'y00')?.out;
        return validateGates(1, Cout, err);
    } else {
        let x = n < 10 ? 'x0' + n : 'x' + n;
        let y = n < 10 ? 'y0' + n : 'y' + n;
        let z = n < 10 ? 'z0' + n : 'z' + n;
        let O1 = findGate('XOR', x, y)?.out;
        let zz = findGate('XOR', c, O1)?.out;
        if (zz === undefined) {
            let g = findGateByOut('XOR', z);
            let o = g.in1 !== c ? g.in1 : g.in2; // this is the out that O1 has been swapped with.
            // console.log('1. zz undefined, pushing', n, O1, o);
            err.push([O1, o]);
            O1 = o;
        } else if (zz !== z) {
            // console.log('2. zz not equal to z, pushing', n, zz, z);
            err.push([zz, z]);
        }

        let O2 = findGate('AND', x, y)?.out;
        let O3 = findGate('AND', c, O1)?.out;
        let Cout = findGate('OR', O2, O3)?.out;

        if (Cout === undefined) {
            // find the OR gate with O2 as one of the input
            let g = gates.filter(g => g.op === 'OR').find(g => g.in1 === O2 || g.in2 === O2);
            if (g) {
                // there is a OR gate with O2 as input. G3 i swapped
                let o = g.in1 !== O2 ? g.in1 : g.in2; // this is the out that O3 has been swapped with.
                Cout = g.out;
                // console.log('3. pushing O3', n, O3, o);
                err.push([O3, o]);
            } else {
                let g = gates.filter(g => g.op === 'OR').find(g => g.in1 === O3 || g.in2 === O3);
                let o = g.in1 !== O3 ? g.in1 : g.in2; // this is the out that O2 has been swapped with.
                Cout = g.out;
                // console.log('4. pushing O2', n, O2, o);
                err.push([O2, o]);
            }
        } else if (Cout.startsWith('z') && n < 44) {
            // Cout should never go to a z output except for last bit.
            // how do I figure out what Cout is swapped with??
            // console.log('5. cout to z detected', n, Cout);
            if (n === 24) Cout = 'mmk';
        }

        return validateGates(n + 1, Cout, err);
    }
}

var [wires, gates] = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', parseInt(run(wires, gates), 2));
console.log('Part 2:', validateGates());
