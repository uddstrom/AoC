const fs = require('fs');
const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;
const { IntcodeComputer } = require('./IntcodeComputer');

function getData(path) {
    const contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    };
}

var parser = (input) => {
    return input.split(',').map(Number);
};

const initAftScaffoldingControlAndInformationInterface = () => {
    var program = getData(PUZZLE_INPUT_PATH)(parser);
    var computer = IntcodeComputer(program);
    computer.next();
    return computer;
}

const generateMap = (computer) => {
    const map = [];
    let terminateProgram = false;
    let line = [];
    // 35 means #, 46 means ., 10 starts a new line
    while (!terminateProgram) {
        const { value, done } = computer.next();
        if (value === 10) {
            map.push(line);
            line = [];
        } else {
            line.push(value === 35 ? '#' : '.');
        }
        terminateProgram = done;
    }
    return map;
}

const printScaffolds = (map) => {
    console.log('Current view of the scaffolds');
    map.forEach(line => console.log(`${line.join('')}`));
}

const main = async () => {
    var map = generateMap(initAftScaffoldingControlAndInformationInterface());
    printScaffolds(map);
};

main();