import { getData, getPath, min } from '../lib/utils.js';

import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var matchNumbers = (str) => Array.from(str.matchAll(/\d+/g), (m) => Number(m[0])); // coverts a string to numbers array.
    var lines = input.split('\n\n');
    var seeds = matchNumbers(lines[0]);
    var maps = lines.slice(1).map((line) => line.split('\n').slice(1).map(matchNumbers));
    var seedToLocationConverter = compose(...maps.map(createSourceToDestinationConverter));
    var locationToSeedConverter = compose(...maps.map(createDestinationToSourceConverter).reverse());

    return { seeds, seedToLocationConverter, locationToSeedConverter };
}

function createSourceToDestinationConverter(map) {
    return function converter(source) {
        var range = map.find(([d, s, l]) => source >= s && source < s + l);
        return range ? source + (range[0] - range[1]) : source;
    };
}

function createDestinationToSourceConverter(map) {
    return function converter(destination) {
        var range = map.find(([d, s, l]) => destination >= d && destination < d + l);
        return range ? destination - (range[0] - range[1]) : destination;
    };
}

function compose(fn1, fn2, fn3, fn4, fn5, fn6, fn7) {
    return function composed(value) {
        return fn7(fn6(fn5(fn4(fn3(fn2(fn1(value)))))));
    };
}

function isValidSeed(seed, seedRanges) {
    if (seedRanges.length < 2) return false;
    var [start, length, ...rest] = seedRanges;
    return seed >= start && seed < start + length ? true : isValidSeed(seed, rest);
}

var { seeds, seedToLocationConverter, locationToSeedConverter } = getData(PUZZLE_INPUT_PATH)(parser);

var findMinLocation = trampoline(function findMinLocation(location = 0) {
    var seed = locationToSeedConverter(location);
    if (isValidSeed(seed, seeds)) return location;
    return function () {
        return findMinLocation(location + 1);
    };
});

console.log('Part 1:', min(seeds.map(seedToLocationConverter)));
console.log('Part 2:', findMinLocation());
