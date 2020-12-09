const fs = require('fs');

const process = (numbers, sum) => {
    const [head, ...tail] = numbers;
    if (tail.length === 0) return;
    const match = tail.find((element) => head + element === sum);
    return match ? head * match : process(tail, sum);
};

const process2 = (numbers) => {
    const [head, ...tail] = numbers;
    const match = process(tail, 2020 - head);
    return match ? head * match : process2(tail);
};

fs.readFile('Day01/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\r\n').map((el) => Number(el));
    console.log('Part 1: ', process(puzzle_input, 2020));
    console.log('Part 2: ', process2(puzzle_input));
});
