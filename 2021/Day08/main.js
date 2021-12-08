import { getData, getPath } from '../lib/utils.js';
import { isEven, isOdd } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    // edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
    var sortAlphabetically = (str) => str.split('').sort().join('');
    return input
        .split('\n')
        .map((line) => line.split(' | '))
        .map((line) => ({
            signalPattern: line[0].split(' ').map(sortAlphabetically),
            output: line[1].split(' ').map(sortAlphabetically),
        }));
}

// function recursiveHeap(elementsToPermutate, lengthOfArray, generatedPerms = []) {
//     if (lengthOfArray === 1) {
//         generatedPerms.push(elementsToPermutate[0]);
//         return generatedPerms;
//     } else {
//         lengthOfArray--;
//         recursiveHeap(elementsToPermutate, lengthOfArray);
//         for (let i=0; i< lengthOfArray)

//     }
// }

function swap(list, x, y) {
    var b = list[y];
    list[y] = list[x];
    list[x] = b;
}

function recursiveHeap(k, A, S) {
    if (k === 1) {
        S.add(A.join(''));
    } else {
        recursiveHeap(k - 1, A, S);
        for (var i = 0; i < k - 1; i++) {
            if (isEven(k))
                swap(A, i, k - 1);
            else
                swap(A, 0, k - 1);
            recursiveHeap(k - 1, A, S);
        }
    }
}

function main() {
    /* ----------------
    0: abcefg (6)
    1: cf (2)       <--
    2: acdeg (5)
    3: acdfg (5)
    4: bcdf (4)     <--
    5: abdfg (5)
    6: abdefg (6)
    7: acf (3)      <--
    8: abcdefg (7)  <--
    9: abcdfg (6)
    ------------------- */

    // In the output values, how many times do digits 1, 4, 7, or 8 appear?
    var entries = getData(PUZZLE_INPUT_PATH)(parser);

    var digits = entries.reduce(
        (acc, entry) =>
            acc +
            entry.output.filter((str) => [2, 3, 4, 7].includes(str.length))
                .length,
        0
    );

    /*    
    acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

     dddd        0000
    e    a      1    2
    e    a      1    2
     ffff        3333
    g    b      4    5
    g    b      4    5
     cccc        6666

    config => [d,e,a,f,g,b,c]
    7! = 5040 kombinationer

    dab = [025] = en 7:a
    acedgfb = [2610435] => sort => [0123456] = 8
    cdfbe = [60351] => sort => [01356] = 5

    ------------------- 
    Valid numbers
    0: [0,1,2,4,5,6]
    1: [2,5]
    2: [0,2,3,4,6]
    3: [0,2,3,5,6]
    4: [1,2,3,5]
    5: [0,1,3,5,6]
    6: [0,1,3,4,5,6]
    7: [0,2,5]
    8: [0,1,2,3,4,5,6]
    9: [0,1,2,3,5]
    ------------------- 
    */

    let validNumbers = new Map([
        ['123456', 0],
        ['25', 1],
        ['02346', 2],
        ['02356', 3],
        ['1235', 4],
        ['01356', 5],
        ['013456', 6],
        ['025', 7],
        ['0123456', 8],
        ['01235', 9],
    ]);

    console.log(validNumbers.get('25')); // => 1
    console.log(validNumbers.get('013456')); // => 6

    console.log('Part 1:', digits);
    console.log('Part 2:');
}


var combos = new Set();
recursiveHeap(7, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], combos);
console.log(combos.size);
//main();
