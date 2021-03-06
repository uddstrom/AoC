const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;
const { getData } = require('../lib/utils');
const { count, compose, eq } = require('../lib/fn');

function containsALetterWhichAppearsExactly(n) {
    return function checkN(str) {
        var arrOfLetters = Array.from(str);
        var strHasNOf = compose(eq(n), count(arrOfLetters));
        var uniqueLetters = new Set(arrOfLetters);
        for (let letter of uniqueLetters) {
            if (strHasNOf(letter)) return true;
        }
        return false;
    }
}

function union(str1, str2) {
    var arr1 = Array.from(str1);
    var arr2 = Array.from(str2);
    var unionStr = '';
    for (const [idx, char1] of arr1.entries()) {
        if (char1 === arr2[idx]) unionStr += char1;
    }
    return unionStr;
}

function differByExactlyOneCharacter(str1) {
    return str2 => str1.length - union(str1, str2).length === 1;
}

function findCorrectBoxIds(ids) {
    const [head, ...tail] = ids;
    const matchingId = tail.find(differByExactlyOneCharacter(head));
    if (matchingId) return union(head, matchingId);

    return findCorrectBoxIds(tail);
}

function createReducer(predicate) {
    return (acc, curr) => predicate(curr) ? acc + 1 : acc;
}

const parser = input => input.split('\n');
const boxIds = getData(PUZZLE_INPUT_PATH)(parser);

const two = boxIds.reduce(createReducer(containsALetterWhichAppearsExactly(2)), 0);
const three = boxIds.reduce(createReducer(containsALetterWhichAppearsExactly(3)), 0);
const checksum = two * three;

console.log('Part 1:', checksum);
console.log('Part 2:', findCorrectBoxIds(boxIds));