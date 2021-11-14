import PaintingRobot from './PaintingRobot.js';

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

const renderImage = (panels, ctx) => {
    panels.forEach((value, key, map) => {
        ctx.fillStyle = value ? 'white' : 'black';
        const c = key.split(',').map(Number)[0] + 100;
        const r = key.split(',').map(Number)[1] + 100;
        ctx.fillRect(c, r, 1, 1);
    });
};

const main = async () => {
    const file = '/puzzle_input';
    try {
        const puzzle_input = await readPuzzleInput(file);
        const answer_part_1 = PaintingRobot(puzzle_input).paint(0).size;
        console.log(
            'Part I: Number of panels painted at least once is',
            answer_part_1
        );
        const panelsPainted = PaintingRobot(puzzle_input).paint(1);
        console.log('Part II: The canvas contains the answer.');
        const canvas = document.getElementById('screen');
        const context = canvas.getContext('2d');
        renderImage(panelsPainted, context);
    } catch (err) {
        console.error(err);
    }
};

main();
