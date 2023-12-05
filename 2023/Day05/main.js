import { getData, getPath, min } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var matchNumbers = (str) => Array.from(str.matchAll(/\d+/g), (m) => Number(m[0])); // coverts a string to numbers array.
    var lines = input.split('\n\n');
    var seeds = matchNumbers(lines[0]);
    var seedToLocationConverter = compose(
        ...lines
            .slice(1)
            .map((line) => line.split('\n').slice(1).map(matchNumbers))
            .map(createConverter)
    );

    return { seeds, seedToLocationConverter };
}

function createConverter(map) {
    return function (source) {
        var destination = source; // Default if not mapped.
        for (let [d, s, l] of map) {
            if (source >= s && source < s + l) {
                return source + (d - s);
            }
        }
        return destination;
    };
}

function compose(fn1, fn2, fn3, fn4, fn5, fn6, fn7) {
    return function composed(value) {
        return fn7(fn6(fn5(fn4(fn3(fn2(fn1(value)))))));
    };
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1Locations = data.seeds.map(data.seedToLocationConverter);

console.log('Part 1:', min(p1Locations));
console.log('Part 2:');
