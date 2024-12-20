import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n')
        .map(line => {
            var [testVal, numbers] = line.split(': ');
            return [Number(testVal), numbers.split(' ').map(Number)];
        });
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

function p1(numbers, result = []) {
    if (numbers.length === 0) {
        return result;
    }
    if (result.length === 0) {
        var [n1, n2, ...tail] = numbers;
        return p1(tail, [n1 * n2, n1 + n2]);
    }
    var [head, ...tail] = numbers;
    return p1(tail, result.flatMap((n) => [n * head, n + head]));
}

function p2(numbers, result = []) {
    if (numbers.length === 0) {
        return result;
    }
    if (result.length === 0) {
        var [n1, n2, ...tail] = numbers;
        return p2(tail, [n1 * n2, n1 + n2, Number(`${n1}${n2}`)]);
    }
    var [head, ...tail] = numbers;
    return p2(tail, result.flatMap((n) => [n * head, n + head, Number(`${n}${head}`)]));
}

function isTrue([testVal, numbers], developFn) {
    return developFn(numbers).some(val => val === testVal) ? testVal : 0;
}

console.log('Part 1:', sum(data.map(eq => isTrue(eq, p1))));
console.log('Part 2:', sum(data.map(eq => isTrue(eq, p2))));
