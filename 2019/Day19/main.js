import IntcodeComputer from '../lib/IntcodeComputer.js';
import draw from './draw.js';

const X_MIN = 180;
const X_MAX = 420;

const Y_MIN = 800;
const Y_MAX = 1100;

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

function initDroneSystem(program) {
    return function deployDrone(x, y) {
        var computer = IntcodeComputer(program, true, [x, y]);
        var out = computer.next();
        return out;
    };
}

function solvePart1(program) {
    var deploy = initDroneSystem(program);
    var affectedPoints = [];
    
    for (var x = 0; x < 50; x++) {
        for (var y = 0; y < 50; y++) {
            if (deploy(x, y).value === 1) {
                affectedPoints.push({ x, y });
            }
        }
    }
    return affectedPoints.length;
}

function find100x100(points) {
    var xMax = (points, Y) => Math.max(...points.filter(({_, y}) => y === Y).map(({ x, _ }) => x));
    var xMin = (points, Y) => Math.min(...points.filter(({_, y}) => y === Y).map(({ x, _ }) => x));
    
    for (var Y = Y_MIN; Y < Y_MAX; Y++) {
        var xmax = xMax(points, Y);
        var xmin = xMin(points, Y + 99);
        if (xmax - xmin >= 99) return { x: xmax - 99, y: Y };
    }
}

function calculateBeamPoints(program) {
    var deploy = initDroneSystem(program);
    var affectedPoints = [];

    for (var x = X_MIN; x < X_MAX; x++) {
        for (var y = Y_MIN; y < Y_MAX; y++) {
            if (deploy(x, y).value === 1) {
                affectedPoints.push({ x, y });
            }
        }
    }
    return affectedPoints;
}

async function main() {
    const program = await readPuzzleInput('./puzzle_input');
    console.log('Part 1:', solvePart1(program));

    var points = calculateBeamPoints(program);
    var topLeft = find100x100(points);
    
    console.log('Part 2:', topLeft.x * 10000 + topLeft.y);

    draw(points, topLeft, Y_MIN);
}

main();
