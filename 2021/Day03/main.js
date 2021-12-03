import { getData, getPath } from '../lib/utils.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input
        .split('\n')
        .map((n) => n.split(''))
        .map((arr) => arr.map(Number));
};

function mostCommon(data, bit) {
    var sum = data.reduce((acc, curr) => acc + curr[bit], 0);
    return sum >= data.length / 2 ? 1 : 0;
}

function leastCommon(data, bit) {
    var sum = data.reduce((acc, curr) => acc + curr[bit], 0);
    return sum < Math.ceil(data.length / 2) ? 1 : 0;
}

function gamma(data) {
    var strGamma = '';
    for (var i = 0; i < data[0].length; i++) {
        strGamma += mostCommon(data, i);
    }
    return parseInt(strGamma, 2);
}

function epsilon(data) {
    var strGamma = '';
    for (var i = 0; i < data[0].length; i++) {
        strGamma += leastCommon(data, i);
    }
    return parseInt(strGamma, 2);
}

function oxygen(data, bit = 0) {
    if (data.length === 1) return parseInt(data[0].join(''), 2);
    var most = mostCommon(data, bit);
    return oxygen(
        data.filter((val) => val[bit] === most),
        bit + 1
    );
}

function co2(data, bit = 0) {
    if (data.length === 1) return parseInt(data[0].join(''), 2);
    var most = leastCommon(data, bit);
    return co2(
        data.filter((val) => val[bit] === most),
        bit + 1
    );
}

const main = async () => {
    var data = getData(PUZZLE_INPUT_PATH)(parser);

    var gammaRate = gamma(data);
    var epsilonRate = epsilon(data);
    var oxygenRate = oxygen(data);
    var co2Rate = co2(data);

    console.log('Part 1:', gammaRate * epsilonRate);
    console.log('Part 2:', oxygenRate * co2Rate);
};

main();
