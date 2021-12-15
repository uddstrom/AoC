import { count, getData, getPath, matrix } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    let [template, rules] = input.split('\n\n');
    rules = rules.split('\n').map((rule) => rule.split(' -> '));
    let ruleMap = new Map();
    rules.forEach(([pair, insert]) => ruleMap.set(pair, insert));
    return [template, ruleMap];
}

function toPairs(str) {
    return str
        .split('')
        .map((el, idx, arr) => {
            return el + arr[idx + 1];
        })
        .slice(0, str.length - 1);
}

function createPolymerProcessor(ruleMap) {
    let insert = (pair) =>
        `${pair.split('')[0]}${ruleMap.get(pair)}${pair.split('')[1]}`;
    return function processor(template) {
        return function process(steps) {
            let polymer = template;
            while (steps > 0) {
                let pairs = toPairs(polymer);
                polymer = pairs.reduce((acc, pair) => {
                    let next =
                        acc.length > 0
                            ? insert(pair).substring(1)
                            : insert(pair);
                    return acc + next;
                }, '');
                steps--;
            }
            return polymer;
        };
    };
}

function calculateAnswer(polymer) {
    let resultArr = polymer.split('');
    let distinctLetters = [...new Set(resultArr)];
    let countArr = distinctLetters.map((letter) => count(letter, resultArr));
    let min = Math.min(...countArr);
    let max = Math.max(...countArr);
    return max - min;
}

function main() {
    let [template, ruleMap] = getData(PUZZLE_INPUT_PATH)(parser);
    let processor = createPolymerProcessor(ruleMap);
    let result10 = processor(template)(10);
    let result40 = processor(template)(40);
    console.log('Part 1:', calculateAnswer(result10));
    console.log('Part 2:', calculateAnswer(result40));
}

main();

/*
NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB
NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB

*/
