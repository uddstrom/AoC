import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var [towels, designs] = input.split('\n\n');
    return [towels.split(', '), designs.split('\n')];
}

var [TOWELS, DESIGNS] = getData(PUZZLE_INPUT_PATH)(parser);

var DP = new Map();

function options(design) {
    if (design.length === 0) return 1;
    if (DP.has(design)) return DP.get(design);

    var cnt = 0;
    for (let l = 1; l <= design.length; l++) {
        let head = design.substring(0, l);
        let tail = design.substring(l);
        let tailCnt = options(tail);
        if (TOWELS.some((t) => t === head) && tailCnt > 0) {
            cnt += tailCnt;
        }
    }

    DP.set(design, cnt);
    return cnt;
}

console.log('Part 1:', DESIGNS.filter((design) => options(design) > 0).length);
console.log('Part 2:', sum(DESIGNS.map(options)));
