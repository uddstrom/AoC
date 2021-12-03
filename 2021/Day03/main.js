import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input
        .split('\n')
        .map((n) => n.split(''))
        .map((arr) => arr.map(Number));
};

var getBitBy = (predicate) => (bytes, pos) => {
    var frequency = bytes.reduce((acc, curr) => acc + curr[pos], 0);
    return predicate(frequency) ? 1 : 0;
};

var mostCommon = (bytes) => {
    var mostCommonPredicate = (frequency) => frequency >= bytes.length / 2;
    return (pos) => getBitBy(mostCommonPredicate)(bytes, pos);
};

var leastCommon = (bytes) => {
    var leastCommonPredicate = (frequency) => frequency < bytes.length / 2;
    return (pos) => getBitBy(leastCommonPredicate)(bytes, pos);
};

function rateBy(predicate) {
    return function rate(bytes, bStr = '', pos = 0) {
        var byteSize = bytes[0].length;
        return pos > byteSize - 1
            ? parseInt(bStr, 2)
            : rate(bytes, `${bStr}${predicate(bytes)(pos)}`, pos + 1);
    };
}

function filterBy(predicate) {
    return function filter(bytes, pos = 0) {
        return bytes.length === 1
            ? parseInt(bytes[0].join(''), 2)
            : filter(
                  bytes.filter((byte) => byte[pos] === predicate(bytes)(pos)),
                  pos + 1
              );
    };
}

function main() {
    var bytes = getData(PUZZLE_INPUT_PATH)(parser);

    var gamma = rateBy(mostCommon);
    var epsilon = rateBy(leastCommon);
    var oxygen = filterBy(mostCommon);
    var co2 = filterBy(leastCommon);

    console.log('Part 1:', gamma(bytes) * epsilon(bytes));
    console.log('Part 2:', oxygen(bytes) * co2(bytes));
}

main();
