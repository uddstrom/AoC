const fs = require("fs");
const { IntcodeComputer, state } = require('./IntcodeComputer');

const readPuzzleInput = (file, split) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", function(err, contents) {
            contents
                ? resolve(contents.split(split))
                : reject('Error reading file');
        });
    });
}

const main = async () => {
    const file = process.argv[2] || '2019/Day09/puzzle_input';
    const separator = process.argv[3] || ',';
    try {
        const puzzle_input = await readPuzzleInput(file, separator);
        const computer = new IntcodeComputer(puzzle_input, 'CompleteIntcodeComputer');
        computer.process([1]);
        computer.process([2]);
    } catch (err) {
        console.error(err);
    }
};

main();
