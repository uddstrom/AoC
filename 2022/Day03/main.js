import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) => row.split(''));
}

function findCommon(bag) {
    var comp1 = bag.slice(0, bag.length / 2);
    var comp2 = bag.slice(bag.length / 2);
    return comp1.find((c) => comp2.includes(c));
}

function toPrio(char) {
    var prioMap = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return prioMap.indexOf(char);
}

function findBadges(data) {
    var arr = [];
    for (let i = 0; i < data.length; i += 3) {
        arr.push(findBadge(data[i], data[i + 1], data[i + 2]));
    }
    return sum(arr.map(toPrio));
}

function findBadge(bag1, bag2, bag3) {
    var bag12 = bag1.filter((c) => bag2.includes(c));
    return bag12.find((c) => bag3.includes(c));
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [['a','b'], ['c','d'], ...]
console.log('Part 1:', sum(data.map(findCommon).map(toPrio)));
console.log('Part 2:', findBadges(data));
