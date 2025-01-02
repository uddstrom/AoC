import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var [registers, instr] = input.split('\n\n');
    var [A, B, C] = registers.split('\n').map(line => Number(line.split(': ')[1]))
    var I = instr.split(': ')[1].split(',').map(BigInt);
    return { A, B, C, I };
}

function* computer(a, b, c, I) {
    var A = BigInt(a);
    var B = BigInt(b);
    var C = BigInt(c);
    var combo = (op) => {
        if (op < 4n) return op;
        if (op === 4n) return A;
        if (op === 5n) return B;
        if (op === 6n) return C;
        throw new Error("Invalid operand.", op);
    }

    var operations = [
        function adv(op) { A = A / (2n ** combo(op)) },
        function bxl(op) { B = B ^ BigInt(op) },
        function bst(op) { B = combo(op) % 8n },
        function jnz(op) { if (A !== 0n) { pointer = op; return true; } },
        function bxc() { B = B ^ C },
        function out(op) { return combo(op) % 8n },
        function bdv(op) { B = A / (2n ** combo(op)) },
        function cdv(op) { C = A / (2n ** combo(op)) },
    ]

    var pointer = 0n;
    while (pointer < I.length) {
        let instr = I[pointer];
        let operand = I[pointer + 1n];
        let result = operations[instr](operand);
        if (instr === 5n) yield result;
        if (result !== true) pointer += 2n;
    }
}

function findA() {
    var a = 0n;
    var cnt = 0n;
    var best = 0;
    var goal = I.join();

    while (true) {
        // a = cnt;
        a = cnt * (8n ** 9n) + 0o654025052n;
        let prgm = [...computer(a, B, C, I)];
        if (prgm.join() == goal) return a;
        if (prgm.length > I.length) return;
        for (let i = 0; i < prgm.length; i++) {
            if (prgm[i] !== I[i]) {
                if (i >= best) {
                    best = i;
                    // console.log(a, a.toString(8), best, prgm.join(''));
                }
                break;
            }
        }
        cnt++;
    }
}

var { A, B, C, I } = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', [...computer(A, B, C, I)].join());
console.log('Part 2:', findA());

