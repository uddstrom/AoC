import { getData, getPath, min, max, rng, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) =>
    input.split('\n').map((line) => Number(line.split(' ')[4]));

function* deterministicDice() {
    let idx = 1;
    let counter = 0;
    let yieldCounter = false;
    while (true) {
        if (yieldCounter) {
            yieldCounter = yield counter;
        } else {
            yieldCounter = yield idx;
            counter++;
            idx = idx === 100 ? 1 : idx + 1;
        }
    }
}

function move(dice, player) {
    let sum = rng(3).reduce((acc) => acc + dice.next().value, 0);
    return ((player + (sum % 10) - 1) % 10) + 1;
}

function practiceGame(dice, p1, p2) {
    let p = [p1, p2];
    let s = [0, 0];
    let turn = 0;
    while (s[0] < 1000 && s[1] < 1000) {
        p[turn % 2] = move(dice, p[turn % 2]);
        s[turn % 2] += p[turn % 2];
        turn++;
    }
    return [...s, dice.next(true).value];
}

function diracGame(p) {
    let wins = [0, 0];
    let cache = new Map();
    let key = (p, s, dices, turn) =>
        `${p[0]},${p[1]},${s[0]},${s[1]},${dices.join('')},${turn}`;
    function game(p, s = [0, 0], dices = [], turn = 0) {
        if (s[0] >= 21) return [1, 0];
        if (s[1] >= 21) return [0, 1];
        if (cache.has(key(p, s, dices, turn)))
            return cache.get(key(p, s, dices, turn));

        if (dices.length === 3) {
            p[turn] = ((p[turn] + (sum(dices) % 10) - 1) % 10) + 1;
            s[turn] += p[turn];
            return game([...p], [...s], [], turn === 0 ? 1 : 0);
        } else {
            let r = [1, 2, 3].map((n) =>
                game([...p], [...s], [...dices, n], turn)
            );
            let rr = r.reduce(
                (acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
                [0, 0]
            );
            if (!cache.has(key(p, s, dices, turn))) {
                cache.set(key(p, s, dices, turn), rr);
            }
            return rr;
        }
    }
    return game(p);
}

function main() {
    let [p1, p2] = getData(PUZZLE_INPUT_PATH)(parser);
    let [s1, s2, rolls] = practiceGame(deterministicDice(), p1, p2);

    console.log('Part 1:', min([s1, s2]) * rolls);
    console.log('Part 2:', max(diracGame([p1, p2])));
}

main();
