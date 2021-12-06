import IntcodeComputer from '../lib/IntcodeComputer.js';
// import {
//     getData,
//     getPath,
// } from '../lib/utils.js';

function readPuzzleInput(file) {
    return new Promise((resolve, reject) => {
        fetch(file)
            .then((response) => response.text())
            .then((contents) => {
                contents
                    ? resolve(contents.split(',').map(Number))
                    : reject('Error reading file');
            });
    });
}

function parser(input) {
    return input.split(',').map(Number);
}

function initDroneSystem(program) {
    return function deployDrone(x, y) {
        var computer = IntcodeComputer(program, true, [x, y]);
        var out = computer.next();
        return out;
    };
}

function drawGrid(ctx) {
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'black';
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 6; y++) {
            ctx.rect(x * 100, y * 100, 100, 100);
            ctx.stroke();
        }
    }
}

function draw(x, y, ctx, offsetY = 0) {
    ctx.fillRect(x, y - offsetY, 1, 1);
}

async function main() {
    const program = await readPuzzleInput('./puzzle_input');

    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'deeppink';

    // const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
    // var program = getData(PUZZLE_INPUT_PATH)(parser);

    var deploy = initDroneSystem(program);
    var affectedPoints = [];

    console.log('Setting up points.');

    for (var x = 100; x < 400; x++) {
        for (var y = 800; y < 1200; y++) {
            if (deploy(x, y).value === 1) {
                affectedPoints.push({ x, y });
            }
        }
    }

    console.log('point setup done.');

    affectedPoints.forEach(({ x, y }) => draw(x, y, ctx, 800));

    drawGrid(ctx);

    console.log('Part 1:', affectedPoints.length);
    console.log('Part 2:');
}

main();
