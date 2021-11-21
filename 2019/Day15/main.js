import { game } from './game.js';

const readPuzzleInput = (file) => {
    return new Promise((resolve, reject) => {
        fetch(file)
            .then((response) => response.text())
            .then((contents) => {
                contents
                    ? resolve(contents.split(',').map(Number))
                    : reject('Error reading file');
            });
    });
};

const main = async () => {
    const file = './puzzle_input';
    try {
        const puzzle_input = await readPuzzleInput(file);
        game(puzzle_input);
    } catch (err) {
        console.error(err);
    }
};

main();
