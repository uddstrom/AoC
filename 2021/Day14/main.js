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
    let pairCount = new Map();
    str.split('')
        .map((el, idx, arr) => el + arr[idx + 1])
        .slice(0, str.length - 1)
        .forEach((pair) => {
            let cnt = pairCount.get(pair) || 0;
            pairCount.set(pair, cnt + 1);
        });
    return pairCount;
}

function createPolymerProcessor(ruleMap) {
    let insert = (pair) => `${pair[0]}${ruleMap.get(pair)}${pair[1]}`;
    return function processor(template) {
        return function process(steps) {
            let pairs = toPairs(template);
            while (steps > 0) {
                let temp = new Map();
                for (let [pair, count] of pairs.entries()) {
                    let newPairs = toPairs(insert(pair));
                    for (let [newPair, newCount] of newPairs.entries()) {
                        let cnt = temp.get(newPair) || 0;
                        temp.set(newPair, cnt + newCount * count);
                    }
                }
                pairs = temp;
                steps--;
            }
            return pairs;
        };
    };
}

function calculateAnswer(pairs, template) {
    let elCount = new Map();
    elCount.set(template[0], 1);
    for (let [pair, count] of pairs) {
        let second = pair.split('')[1];
        let curr = elCount.get(second) || 0;
        elCount.set(second, curr + count);
    }
    return Math.max(...elCount.values()) - Math.min(...elCount.values());
}

function main() {
    let [template, ruleMap] = getData(PUZZLE_INPUT_PATH)(parser);
    let processor = createPolymerProcessor(ruleMap);
    let result10 = processor(template)(10);
    let result40 = processor(template)(40);
    console.log('Part 1:', calculateAnswer(result10, template));
    console.log('Part 2:', calculateAnswer(result40, template));
}

main();
