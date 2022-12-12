import { getData, getPath, rng } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((row) => row.split(' '))
        .map(([dir, amount]) => [dir, Number(amount)]);
}

function ropeSimulation(data) {
    var rope = rng(10).map((x) => [0, 0]);
    var DR = { L: 0, U: -1, R: 0, D: 1 };
    var DC = { L: -1, U: 0, R: 1, D: 0 };

    function moveHead(dir) {
        var [r, c] = rope[0];
        rope[0] = [r + DR[dir], c + DC[dir]];
    }

    function moveTail(i = 1) {
        if (i >= 10) return;
        var [hr, hc] = rope[i - 1]; // 'head' row/col
        var [tr, tc] = rope[i]; // 'tail' row/col
        var dr = Math.abs(hr - tr);
        var dc = Math.abs(hc - tc);
        var rstep = Math.sign(hr - tr);
        var cstep = Math.sign(hc - tc);

        if (dr > 1 && dc > 1) rope[i] = [tr + rstep, tc + cstep];
        else if (dr > 1) rope[i] = [tr + rstep, hc];
        else if (dc > 1) rope[i] = [hr, tc + cstep];

        moveTail(i + 1);
    }

    function simulate(moves, p1 = new Set(), p2 = new Set()) {
        if (moves.length <= 0) return [p1, p2];
        var [dir, amount] = moves.shift();
        rng(amount).forEach((_) => {
            moveHead(dir);
            moveTail();
            p1.add(`${rope[1][0]},${rope[1][1]}`);
            p2.add(`${rope[9][0]},${rope[9][1]}`);
        });
        return simulate(moves, p1, p2);
    }

    return simulate(data);
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [['D',2], ['R',2], ['U',2], ...]
var [p1, p2] = ropeSimulation(data);
console.log('Part 1:', p1.size);
console.log('Part 2:', p2.size);
