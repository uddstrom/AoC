import { getData, getPath, sum } from '../lib/utils.js';
import { compose } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n');
}

let isOpen = (chr) => '([{<'.includes(chr);
let _openCloseMap = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
]);

function syntaxCheckAndAutoComplete(lines) {
    let illegals = [];
    let completers = [];

    lines.forEach((line) => {
        let openStack = [];
        line = line.split('');
        while (line.length > 0) {
            let next = line.shift();
            if (isOpen(next)) openStack.push(next);
            else {
                let expected = _openCloseMap.get(openStack.pop());
                if (expected !== next) {
                    // corrupt line
                    illegals.push(next);
                    return;
                }
            }
        }
        // incomplete line
        completers.push(
            openStack
                .map((chr) => _openCloseMap.get(chr))
                .reverse()
                .join('')
        );
    });

    return { illegals, completers };
}

function errorScoreCalculator({ illegals }) {
    let scoreMap = new Map([
        [')', 3],
        [']', 57],
        ['}', 1197],
        ['>', 25137],
    ]);
    let getScore = (chr) => scoreMap.get(chr);
    return sum(illegals.map(getScore));
}

function autoCompleteScoreCalculator({ completers }) {
    let scoreMap = new Map([
        [')', 1],
        [']', 2],
        ['}', 3],
        ['>', 4],
    ]);
    let getScore = (string) => string.split('').map((chr) => scoreMap.get(chr));
    var scores = completers
        .map(getScore)
        .map((score) => score.reduce((total, score) => total * 5 + score, 0))
        .sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
}

function main() {
    let lines = getData(PUZZLE_INPUT_PATH)(parser);
    let part1 = compose(errorScoreCalculator, syntaxCheckAndAutoComplete);
    let part2 = compose(
        autoCompleteScoreCalculator,
        syntaxCheckAndAutoComplete
    );
    console.log('Part 1:', part1(lines));
    console.log('Part 2:', part2(lines));
}

main();
