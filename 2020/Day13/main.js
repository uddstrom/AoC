const fs = require('fs');

function inverse(n, mod) {
    for (let b = 1n; b <= mod; b++) {
        if ((n * b - 1n) % mod === 0n) return b;
    }
}

function chinese(reminders, mods) {
    const N = mods.reduce((acc, curr) => acc * curr, 1n);
    const n = mods.map(n => N / n);
    const b = n.map((n, i) => inverse(n, mods[i]));
    const x = reminders.reduce((acc, a, i) => acc + a * b[i] * n[i], 0n);
    return x % N;
}

const partOne = (timestamp, ids) => {
    const idArr = Array.from(ids, ([_, val]) => Number(val));
    const waits = idArr.map(id => Math.ceil( timestamp / id ) * id - timestamp);
    const minWait = Math.min(...waits);
    const id = idArr[waits.indexOf(minWait)];
    return minWait * id;
};

const partTwo = (ids) => {
    const reminders = Array.from(ids, ([key, val]) => (val - (key % val)) % val);
    const mods = Array.from(ids, ([_, val]) => val);
    return chinese(reminders, mods);
};

fs.readFile('Day13/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');
    const timestamp = Number(input[0]);

    const ids = new Map();
    input[1].split(',').forEach((id, index) => {
        if (!isNaN(id)) {
            ids.set(BigInt(index), BigInt(id));
        }
    });

    console.log('Part 1:', partOne(timestamp, ids));
    console.log('Part 2:', partTwo(ids));
});
