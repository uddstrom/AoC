import IntcodeComputer from './IntcodeComputer.js';

//const { IntcodeComputer } = require('./IntcodeComputer');

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const DIRECTIONS = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
const DIR = ['^', '>', 'V', '<'];

const PaintingRobot = (program) => {

    const computer = new IntcodeComputer(program);
    const painted = new Map();
    let dir = 0;
    let x = 0;
    let y = 0;
    let c = 0;
    let iterations = 0;
    
    const paint = (startColor) => {
        while (true) {
            iterations++;
            const coords = x + ',' + y;
            c = iterations === 1 ? startColor || 0 : painted.get(coords) || 0;
            
            const newColor = computer.process(c);
            if (newColor === painted.get(coords) || newColor === undefined) {
                // console.log(`-Iteration ${iterations} ----------------------------------------------------`);
                // console.log(`At (${coords}) facing ${DIR[dir]}. Panel is ${c ? 'WHITE' : 'BLACK'}`);
                // console.log(`Computer I/O (${c})/(${newColor})`);
                console.log('Breaking at iteration', iterations);
                break;
            }
            const turn = computer.process(c);
            if (turn === undefined) {
                break;
            }

            // console.log(`-Iteration ${iterations} ----------------------------------------------------`);
            // console.log(`At (${coords}) facing ${DIR[dir]}. Panel is ${c ? 'WHITE' : 'BLACK'}`);
            // console.log(`Computer I/O (${c})/(${newColor}, ${turn})`);
            // console.log(`Painting (${coords}) ${newColor ? 'WHITE' : 'BLACK'}`);

            painted.set(coords, newColor);
            go(turn);

            // console.log(`Going ${DIRECTIONS[dir]}`);
            
        }
        // console.log('-----------------------------------------------------');
        return painted;
    };

    const go = (turn) => {
        dir = (dir + (turn ? 1 : 3)) % 4;
        switch (dir) {
            case UP: y--; break;
            case DOWN: y++; break;
            case LEFT: x--; break;
            case RIGHT: x++; break;
        }
    };

    return { paint };
}

//module.exports = { PaintingRobot };
export default PaintingRobot;
