import IntcodeComputer from '../lib/IntcodeComputer.js';
import { getData, getPath } from '../lib/utils.js';
const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

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
    var output = [];
    var terminateProgram = false;
    while (!terminateProgram) {
        var { value: out, done } = computer.next();
        out && output.push(out);
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

const calculateSumOfAlignmentParams = (map) => {
    const scaffoldMap = [];
    let row = [];
    map.map((chr) => String.fromCharCode(chr)).forEach((el) => {
        if (el === '\n' && row.length > 0) {
            scaffoldMap.push([...row]);
            row = [];
        } else {
            row.push(el);
        }
    });

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
    var mainRoutine = 'A,B,A,B,C,B,C,A,C,C\n';
    var a = 'R,12,L,10,L,10\n';
    var b = 'L,6,L,12,R,12,L,4\n';
    var c = 'L,12,R,12,L,6\n';
    var video = 'n\n';
    var input = `${mainRoutine}${a}${b}${c}${video}`
        .split('')
        .map((chr) => chr.charCodeAt(0));

    var program = getData(PUZZLE_INPUT_PATH)(parser);
    program[0] = 2; // wake up robot
    var computer = IntcodeComputer(program, input);
    var map = generateMap(computer);
    // printScaffolds(map);

    return map[map.length - 1];
};

const main = async () => {
    var scaffoldMap = generateMap(
        initAftScaffoldingControlAndInformationInterface()
    );
    console.log('Part 1:', calculateSumOfAlignmentParams(scaffoldMap));
    console.log('Part 2:', notifyRobots());
};

main();
