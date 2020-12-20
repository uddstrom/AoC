const fs = require('fs');

class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    get dir() {
        const deg = Math.atan2(this.y, this.x) * 180 / Math.PI;
        return (deg < 0) ? deg + 360 : deg;
    }

    rotate(deg = 0) {
        this.setDir(this.dir + deg);
        return this;
    }

    setDir(angle, dist = 1) {
        this.x = dist * Math.cos(angle / 360 * Math.PI * 2);
        this.y = dist * Math.sin(angle / 360 * Math.PI * 2);
    };

    scale(f) {
        this.x *= f;
        this.y *= f;
    };

    clone() {
        return new Vec2(this.x, this.y);
    }
};

const actions = {
    N: (pos, val) => { return { ...pos, N: pos.N + val }},
    S: (pos, val) => { return { ...pos, N: pos.N - val }},
    E: (pos, val) => { return { ...pos, E: pos.E + val }},
    W: (pos, val) => { return { ...pos, E: pos.E - val }},
    L: (pos, val) => { return { ...pos, direction: pos.direction.rotate(-val) }},
    R: (pos, val) => { return { ...pos, direction: pos.direction.rotate(val) }},
    F: (pos, val) => {
        // console.log('executing F', pos, val);
        const dir = pos.direction.clone();
        dir.scale(val);
        return {
            ...pos,
            N: pos.N + dir.x,
            E: pos.E + dir.y,
        }
    },
}

const process = (instructions) => {
    const start = { N: 0, E: 0, direction: new Vec2(0, 1) };
    const end = instructions.reduce((pos, instruction) => {
        const newPos = actions[instruction.action](pos, instruction.value);
        // console.log(newPos);
        return newPos;
    }, start);
    console.log(end);
    return Math.abs(end.N) + Math.abs(end.E);
};

fs.readFile('Day12/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n').map(instr => {
        return {
            action: instr.charAt(0),
            value: Number(instr.substring(1)),
        }
    });
    const dist = process(input);
    console.log('Part 1:', dist);
    console.log('Part 2:');
});
