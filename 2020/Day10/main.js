const fs = require('fs');

const partOne = (adapters) => {
    const diffs = adapters.map((curr, idx, arr) => curr - arr[idx - 1]);
    const ones = diffs.filter((el) => el === 1).length;
    const threes = diffs.filter((el) => el === 3).length;

    return ones * threes;
};

const partTwo = (adapters) => {
    const diffs = adapters.map((curr, idx, arr) => curr - arr[idx - 1]);
    const diffString = diffs.join().replace('NaN', '3').replaceAll(',', '');
    // A bit of a hack here, asuming maximum number of subsequent ones is four.
    const two = (diffString.match(/(?=3113)/g) || []).length;
    const four = (diffString.match(/(?=31113)/g) || []).length;
    const seven = (diffString.match(/(?=311113)/g) || []).length;

    return Math.pow(2, two) * Math.pow(4, four) * Math.pow(7, seven);
};

fs.readFile('Day10/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\r\n').map(Number);
    const adapters = input.concat([0, Math.max(...input) + 3]).sort((a, b) => a - b);

    console.log('Part 1:', partOne(adapters));
    console.log('Part 2:', partTwo(adapters));
});
