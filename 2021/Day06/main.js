import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split(',')
        .map(Number);
}

function simulate(_school) {
    var school = _school.slice();
    var schoolMapper = (fish) => (fish === 0 ? [6, 8] : fish - 1);
    return function newDay(daysLeft) {
        if (daysLeft === 0) return school.length;
        school = school.map(schoolMapper).flat();
        return newDay(daysLeft - 1);
    }
}

function main() {
    var initialSchool = getData(PUZZLE_INPUT_PATH)(parser);

    console.log('Part 1:', simulate(initialSchool.slice())(80));
    console.log('Part 2:');
}

main();
