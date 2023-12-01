import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n');
}

var digitMap = new Map([
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
]);

function toCalibrationValue(digits) {
    var first = digits.shift();
    var last = digits.length > 0 ? digits.pop() : first;
    return Number(first + last);
}

function getCalibrationSum(lines, searchExp) {
    function toDigits(line) {
        return Array.from(line.matchAll(searchExp), (match) => digitMap.get(match[1]) || match[1]);
    }
    return sum(lines.map(toDigits).map(toCalibrationValue));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', getCalibrationSum(data, /(\d)/g));
console.log('Part 2:', getCalibrationSum(data, /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g));
