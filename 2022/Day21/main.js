import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var monkeyMap = new Map();
    input.split('\n').forEach((line) => {
        let words = line.split(' ');
        monkeyMap.set(
            words[0].replace(':', ''), // monkey name
            words.length === 2 ? Number(words[1]) : [words[1], words[2], words[3]] // monkey type
        );
    });
    return monkeyMap;
}

var CALC = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    '*': (n1, n2) => n1 * n2,
    '/': (n1, n2) => n1 / n2,
};

function monkeyMath(monkey, monkeys) {
    if (typeof monkey === 'number') return monkey;
    var [m1, op, m2] = monkey;
    return CALC[op](monkeyMath(monkeys.get(m1), monkeys), monkeyMath(monkeys.get(m2), monkeys));
}

function buildMonkeyTree(monkey, monkeys) {
    if (typeof monkey === 'number') return monkey;

    var [m1, op, m2] = monkey;
    var left = m1 === 'humn' ? undefined : buildMonkeyTree(monkeys.get(m1), monkeys);
    var right = m2 === 'humn' ? undefined : buildMonkeyTree(monkeys.get(m2), monkeys);

    if (typeof left === 'number' && typeof right === 'number') {
        return CALC[op](left, right);
    }

    return [left, op, right];
}

function findMonkeyNumber(tree) {
    var [left, _, right] = tree;

    return typeof right === 'number'
        ? parseTree(left, right) // right has the answer, left is the tree with humn/undefined.
        : parseTree(right, left); // left has the answer, right is the tree with humn/undefined.

    function parseTree(tree, ans) {
        var [l, op, r] = tree;
        if (l === undefined) return getL(op, ans, r);
        if (r === undefined) return getR(op, ans, l);
        if (typeof l === 'number') return parseTree(r, getR(op, ans, l));
        if (typeof r === 'number') return parseTree(l, getL(op, ans, r));
    }

    function getL(op, ans, r) {
        if (op === '+') return ans - r; // l + r = ans => l = ans - r
        if (op === '-') return ans + r; // l - r = ans => l = ans + r
        if (op === '*') return ans / r; // l * r = ans => l = ans / r
        if (op === '/') return ans * r; // l / r = ans => l = ans * r
    }

    function getR(op, ans, l) {
        if (op === '+') return ans - l; // l + r = ans => r = ans - l
        if (op === '-') return l - ans; // l - r = ans => r = l - ans
        if (op === '*') return ans / l; // l * r = ans => r = ans / l
        if (op === '/') return l / ans; // l / r = ans => r = l / ans
    }
}

var monkeys = getData(PUZZLE_INPUT_PATH)(parser);
var root = monkeys.get('root');

console.log('Part 1:', monkeyMath(root, monkeys));
console.log('Part 2:', findMonkeyNumber(buildMonkeyTree(root, monkeys)));
