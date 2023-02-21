import { getData, getPath, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split(' ').map(Number);
}

function p1(tree) {
    var [children, meta, ...rest] = tree;

    if (children === 0) return [sum(rest.slice(0, meta)), rest.slice(meta)];

    var meta_sum = 0;
    for (let _ of rng(children)) {
        let [ms, tail] = p1(rest);
        meta_sum += ms;
        rest = tail;
    }

    return [meta_sum + sum(rest.slice(0, meta)), rest.slice(meta)];
}

function p2(tree) {
    var [c, m, ...rest] = tree;

    if (c === 0) return [sum(rest.slice(0, m)), rest.slice(m)];

    var children = [];

    for (let _ of rng(c)) {
        let [val, tail] = p2(rest);
        children.push(val);
        rest = tail;
    }

    var indexes = rest.slice(0, m).map((i) => i - 1);
    var val = sum(indexes.map((i) => (i < children.length ? children[i] : 0)));

    return [val, rest.slice(m)];
}

var tree = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', p1(tree)[0]);
console.log('Part 2:', p2(tree)[0]);
