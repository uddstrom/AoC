const fs = require("fs");
const { IntcodeComputer, state } = require('./IntcodeComputer');
const FEEDBACK_MODE = process.argv[4] == 'true';

const readPuzzleInput = (file, split) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", function(err, contents) {
            contents
                ? resolve(contents.split(split))
                : reject('Error reading file');
        });
    });
}

const phase_settings = () => {
    return FEEDBACK_MODE 
    ? getPhaseCombinations([],[5,6,7,8,9])
    : getPhaseCombinations([],[0,1,2,3,4]);
}

const getPhaseCombinations = (arr, rest) => {
    if (!rest || rest.length === 0) {
        return new Set(arr);
    }
    const result = [];
    const rest_copy = [...rest];
    while (rest_copy.length > 0) {
        const i = rest_copy.shift();
        result.push(getPhaseCombinations([...arr, i], rest.filter(j => j !== i)));
    }
    return result.flat();
}

const main = async () => {
    const file = process.argv[2] || '2019/Day07/puzzle_input';
    const separator = process.argv[3] || ',';
    try {
        const puzzle_input = await readPuzzleInput(file, separator);
        let max_thrust_phase_config;
        const max_thrust = phase_settings().reduce((max, phases) => {
            console.log(`--- Processing phase config [${[...phases].toString()}] --------------------------------`);
            const amps = ['A', 'B', 'C', 'D', 'E'].map(name => new IntcodeComputer(puzzle_input, name));
            let thrust = 0;
            
            thrust = amps.reduce((acc, amp, idx) => amp.process([[...phases][idx], acc]), 0);
            if (FEEDBACK_MODE) {
                while (amps.filter(amp => amp.state === state.TERMINATED).length === 0) {
                    console.log('while...');
                    thrust = amps.reduce((acc, amp) => amp.process([acc]), thrust);
                }
            }

            if (thrust > max) {
                max_thrust_phase_config = phases;
                return thrust;
            }
            return max;
            
        }, 0);
        console.log(`Maximum thrust achieved was ${max_thrust} using phase config [${[...max_thrust_phase_config].toString()}]`);
    } catch (err) {
        console.error(err);
    }
};

main();
