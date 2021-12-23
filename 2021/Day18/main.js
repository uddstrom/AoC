import { getData, getPath, max } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => input.split('\n').map((line) => JSON.parse(line));

function explode(node, depth = 0) {
    if (depth === 4) return node;

    let original = structuredClone(node);
    let left = node[0];
    let right = node[1];

    if (typeof left === 'object') {
        let [l, r] = explode(left, depth + 1);
        if (r !== null) {
            if (depth === 3) node[0] = 0;
            typeof right === 'object' ? addLeft(right, r) : (node[1] += r);
        }
        if (l !== null) return [l, null];
    }

    if (print(original) === print(node)) {
        if (typeof right === 'object') {
            let [ll, rr] = explode(node[1], depth + 1);
            if (ll !== null) {
                if (depth === 3) node[1] = 0;
                typeof left === 'object' ? addRight(left, ll) : (node[0] += ll);
            }
            if (rr !== null) return [null, rr];
        }
    }

    return [null, null];
}

function split(node) {
    if (node >= 10) {
        let newNode = [Math.floor(node / 2), Math.ceil(node / 2)];
        return newNode;
    }
    if (typeof node === 'object') {
        let original = structuredClone(node);
        let [left, right] = node;
        let splittedPair = split(left);
        if (splittedPair) {
            node[0] = splittedPair;
            return;
        }
        if (print(original) === print(node)) {
            splittedPair = split(right);
            if (splittedPair) {
                node[1] = splittedPair;
                return;
            }
        }
    }
}

function addRight(pair, val) {
    let [_, right] = pair;
    if (typeof right === 'number') pair.push(pair.pop() + val);
    else addRight(right, val);
}

function addLeft(pair, val) {
    let [left, _] = pair;
    if (typeof left === 'number') pair.unshift(pair.shift() + val);
    else addLeft(left, val);
}

function magnitude([l, r]) {
    let left = typeof l === 'object' ? 3 * magnitude(l) : 3 * l;
    let right = typeof r === 'object' ? 2 * magnitude(r) : 2 * r;
    return left + right;
}

function print(node) {
    if (typeof node === 'number') return node;
    let [left, right] = node;
    return `[${typeof left === 'object' ? print(left) : left}, ${
        typeof right === 'object' ? print(right) : right
    }]`;
}

function add(n1, n2) {
    let n = [n1, n2];
    let prev = [];
    while (print(n) !== print(prev)) {
        prev = structuredClone(n);
        explode(n);
        if (print(n) === print(prev)) split(n);
    }
    return n;
}

function part2(numbers) {
    return max(
        numbers.flatMap((number) => {
            return numbers
                .filter((n) => print(n) !== print(number))
                .map((n) => add(structuredClone(number), structuredClone(n)))
                .map(magnitude);
        })
    );
}

function main() {
    let numbers = getData(PUZZLE_INPUT_PATH)(parser);
    let number = structuredClone(numbers).reduce(add);
    console.log('Part 1:', magnitude(number));
    console.log('Part 2:', part2(numbers));
}

main();
