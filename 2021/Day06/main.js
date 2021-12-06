import { count, getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split(',')
        .map(Number);
}

function updateSchoolState(school) {
    let newSchool = new Map();
    [0,1,2,3,4,5,6,7,8].forEach(n => {
        n === 6
            ? newSchool.set(6, school.get(7) + school.get(0))
            : newSchool.set(n, school.get((n + 1) % 9));
    });
    return newSchool;
}

function simulate(_school) {
    var school = new Map();
    // calculate initial school state
    [0,1,2,3,4,5,6,7,8].forEach(n => school.set(n, count(n, _school)));

    return function newDay(daysLeft) {
        if (daysLeft === 0) return sum([...school.values()]);
        school = updateSchoolState(school);
        return newDay(daysLeft - 1);
    }
}

function main() {
    var initialSchool = getData(PUZZLE_INPUT_PATH)(parser);

    console.log('Part 1:', simulate(initialSchool)(80));
    console.log('Part 2:', simulate(initialSchool)(256));
}

main();
