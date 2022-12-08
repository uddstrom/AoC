import { getData, getPath, matrix } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var [crates, moves] = input.split('\n\n');
    var stacks = matrix(9, 0);
    crates.split('\n').forEach((row) => {
        [1, 5, 9, 13, 17, 21, 25, 29, 33].forEach((c, idx) => {
            if (row[c] !== ' ') stacks[idx].push(row[c]);
        });
    });
    stacks = stacks.map((pile) => pile.reverse());

    moves = moves.split('\n').map((row) => {
        let R = row.split(' ');
        return {
            n: Number(R[1]),
            from: Number(R[3]),
            to: Number(R[5]),
        };
    });
    return [stacks, moves];
}

function reArrange9000(stacks, moves) {
    function move({ n, from, to }) {
        for (let i = 0; i < n; i++) {
            stacks[to - 1].push(stacks[from - 1].pop());
        }
    }
    moves.forEach(move);
    return stacks.map((stack) => stack.pop()).join('');
}

function reArrange9001(stacks, moves) {
    function move({ n, from, to }) {
        var tempStack = [];
        for (let i = 0; i < n; i++) {
            tempStack.push(stacks[from - 1].pop());
        }
        for (let i = 0; i < n; i++) {
            stacks[to - 1].push(tempStack.pop());
        }
    }
    moves.forEach(move);
    return stacks.map((stack) => stack.pop()).join('');
}

var [stacks, moves] = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', reArrange9000(structuredClone(stacks), moves));
console.log('Part 2:', reArrange9001(structuredClone(stacks), moves));
