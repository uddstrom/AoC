import { getData, getPath, sum } from '../lib/utils.js';
import { compose } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n');
}

function syntaxChecker(lines) {
    let isOpen = (chr) => '([{<'.includes(chr);
    let map = new Map([
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
        ['<', '>'],
    ]);
    return lines
        .map((line) => {
            let openStack = [];
            line = line.split('');
            while (line.length > 0) {
                let next = line.shift();
                if (isOpen(next)) openStack.push(next);
                else {
                    let expected = map.get(openStack.pop());
                    if (expected !== next) return next;
                }
            }
        })
        .filter((c) => c);
}

function scoreCalculator(illegals) {
    let scoreMap = new Map([
        [')', 3],
        [']', 57],
        ['}', 1197],
        ['>', 25137],
    ]);
    let getScore = (chr) => scoreMap.get(chr);
    return sum(illegals.map(getScore));
}

function main() {
    let lines = getData(PUZZLE_INPUT_PATH)(parser);
    let part1 = compose(scoreCalculator, syntaxChecker);

    console.log('Part 1:', part1(lines));
    console.log('Part 2:');
}

main();
