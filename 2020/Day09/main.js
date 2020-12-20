const fs = require('fs');

const isValid = (value, numbers) => {
    if (numbers.length < 2) {
        return false;
    }
    const [head, ...tail] = numbers;
    return tail.includes(value - head) ? true : isValid(value, tail);
};

const findInvalidNumber = (xmas, preSize) => {
    let nextIdx = preSize;
    let nextNumber;
    do {
        nextNumber = xmas[nextIdx];
        const preamble = xmas.slice(nextIdx - preSize, nextIdx);
        isValid(nextNumber, preamble) ? nextIdx++ : (nextIdx = xmas.length);
    } while (nextIdx < xmas.length);
    return nextNumber;
};

const findContiguousSet = (xmas, target) => {
    const [head, ...tail] = xmas;
    const set = [head];
    let setFound = false;
    tail.reduce((acc, curr, idx, arr) => {
        if (acc + curr + head === target) {
            setFound = true;
            arr.splice(1);
        } else {
            set.push(curr);
            return acc + curr;
        }
    }, 0);
    return setFound ? set : findContiguousSet(tail, target);
};

fs.readFile('Day09/puzzle_input', 'utf8', function (err, contents) {
    const xmas = contents.split('\n').map(Number);
    const invalidNumber = findInvalidNumber(xmas, 25);
    const contiguousSet = findContiguousSet(xmas, invalidNumber);
    const encryptionWeakness = Math.max(...contiguousSet) + Math.min(...contiguousSet);

    console.log('Part 1:', invalidNumber);
    console.log('Part 2:', encryptionWeakness);
});
