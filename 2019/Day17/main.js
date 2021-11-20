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
};

const generateMap = (computer) => {
    const output = [];
    let terminateProgram = false;
    // 35 means #, 46 means ., 10 starts a new line
    while (!terminateProgram) {
        const { value: out, done } = computer.next();
        output.push(out);
        terminateProgram = done;
    }
    return output;
};

const printScaffolds = (map) => {
    console.log(map.map((ascii) => String.fromCharCode(ascii)).join(''));
};

const isIntersection = (map, r, c) => {
    var top = r > 0 ? map[r - 1][c] : undefined;
    var bottom = r < map.length - 1 ? map[r + 1][c] : undefined;
    var left = c > 0 ? map[r][c - 1] : undefined;
    var right = c < map[r].length - 1 ? map[r][c + 1] : undefined;

    return (
        [top, bottom, left, right].reduce((acc, curr) => {
            return curr === '#' ? acc + 1 : acc;
        }, 0) > 2
    );
};

const calculateSumOfAlignmentParams = (scaffoldMap) => {
    return scaffoldMap
        .map((row, r) => {
            return row.map((col, c) => {
                if (col !== '#') return 0;
                if (!isIntersection(scaffoldMap, r, c)) return 0;
                return r * c;
            });
        })
        .flat()
        .reduce((acc, curr) => acc + curr);
};

const notifyRobots = () => {
    var mainRoutine = 'A,B,C,A\n';
    var a = 'R,8\n';
    var b = '2,L,1\n';
    var c = 'L,6\n';
    var video = 'n\n';
    var input = `${mainRoutine}${a}${b}${c}${video}`
        .split('')
        .map((chr) => chr.charCodeAt(0));
    //console.log(input);

    var program = getData(PUZZLE_INPUT_PATH)(parser);
    program[0] = 2; // wake up robot
    var computer = IntcodeComputer(program, input);
    //var computer = createProgramInstance(program, input);

    var map = generateMap(computer);
    printScaffolds(map);
};

const main = async () => {
    // var scaffoldMap = generateMap(
    //     initAftScaffoldingControlAndInformationInterface(),
    //     []
    // );
    // printScaffolds(scaffoldMap);
    // console.log('Part 1:', calculateSumOfAlignmentParams(scaffoldMap));
    notifyRobots();
};

main();
