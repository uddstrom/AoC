import { generatePermutations, getData, getPath, sum } from '../lib/utils.js';
import {decodeWithDeduction} from './deduction.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((line) => line.split(' | '))
        .map((line) => ({
            signals: line[0].split(' '),
            output: line[1].split(' '),
        }));
}

let _wireConfigurations = generatePermutations(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
let _segmentsMap = new Map([
    ['012456', 0],
    ['25', 1], //       0000
    ['02346', 2], //   1    2
    ['02356', 3], //   1    2
    ['1235', 4], //     3333
    ['01356', 5], //   4    5
    ['013456', 6], //  4    5
    ['025', 7], //      6666
    ['0123456', 8],
    ['012356', 9],
]);

export function numberConverter(config) {
    // the config param represents the signal wires to segments configuration
    // config: eg 'deafgbc'
    return function (signal) {
        // signal: eg 'cdfbe'
        // cdfbe = [60351] => sort => [01356] = 5
        let segmentCombination = signal
            .split('')
            .map((chr) => config.indexOf(chr))
            .sort()
            .join('');
        return _segmentsMap.get(segmentCombination);
    };
}

function decode({ signals, output }) {
    let isValid = (n) => n !== undefined;
    for (let config of _wireConfigurations) {
        let toNumber = numberConverter(config);
        let signalValues = signals.map(toNumber);
        if (signalValues.every(isValid)) {
            return Number(output.map(toNumber).join(''));
        }
    }
}


function main() {
    let entries = getData(PUZZLE_INPUT_PATH)(parser);

    let numberToCount = (str) => [2, 3, 4, 7].includes(str.length);
    let countNumbers = ({ output }) => output.filter(numberToCount).length;

    console.log('Part 1:', sum(entries.map(countNumbers)));
    let start = Date.now();
    console.log(`Part 2: ${sum(entries.map(decode))} (using brute force in ${Date.now() - start} ms)`);
    start = Date.now();
    console.log(`Part 2: ${sum(entries.map(decodeWithDeduction))} (using deduction in ${Date.now() - start} ms)`);
}

main();
