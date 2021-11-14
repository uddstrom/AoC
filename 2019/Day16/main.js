const fs = require('fs');

const readPuzzleInput = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function(err, contents) {
            contents ? resolve(contents.split('').map(Number)) : reject('Error reading file');
        });
    });
};

const repeatingPattern = (n) => [0, 1, 0, -1].map(i => Array(n).fill(i)).flat();

const FFT = (input, phases, offset) => {
    let phaseCount = 0;
    while (phaseCount < phases) {
        const numbers = [];
        for (let index = 1; index <= input.length; index++) {
            const pattern = repeatingPattern(index);
            const n = input.reduce((acc, i, idx) => acc + i * pattern[(idx+1) % pattern.length], 0).toString();
            nStr = n.toString();
            numbers.push(Number(nStr.substring(nStr.length-1)));
        }
        input = numbers;
        phaseCount++;
    }

    return input.toString().replace(/,/g, '').substring(offset || 0).substring(0,8);
}

const getOffset = (input) => {
    return Number(input.slice(0, 7).toString().replace(/,/g, ''));
}

const repeatInput = (input, times) => {
    let arr = [...input];
    let count = 0;
    while (count < times) {
        arr = arr.concat(input);
        count++;
    }
    return arr;
}

const main = async () => {
    try {
        const file = process.argv[2] || '2019/Day16/puzzle_input';
        const puzzle_input = await readPuzzleInput(file);
        
        // console.log('Part I: ', FFT(puzzle_input, 100));

        const offset = getOffset(puzzle_input);
        console.log(offset);

        const input = repeatInput(puzzle_input, 10000);
        console.log(input);
        console.log('Part II:', FFT(input, 100, offset));
    } catch (err) {
        console.error(err);
    }
};

main();
