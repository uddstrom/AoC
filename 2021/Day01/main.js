import { getData, getPath } from '../lib/utils.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input.split('\n').map(Number);
};


function countIncreases(data) {
    return data.reduce((acc, curr, idx, arr) => curr > arr[idx-1] ? acc + 1 : acc, 0);
}

function sumOfThree(data) {
    return data.map((el ,idx, arr) => (el + arr[idx - 1] + arr[idx - 2]));
}

const main = async () => {
    var puzzle = getData(PUZZLE_INPUT_PATH)(parser);

    console.log('Part 1:', countIncreases(puzzle));
    console.log('Part 2:', countIncreases(sumOfThree(puzzle)));
};

main();
