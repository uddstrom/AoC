const fs = require('fs');

class Vec2 {
    constructor(N, E) {
        this.N = N || 0;
        this.E = E || 0;
    }

    get dir() {
        return Math.atan2(this.E, this.N) * 180 / Math.PI;
    }

    set dir(deg) {
        const l = this.length;
        this.N = Math.round(l * Math.cos(deg / 360 * Math.PI * 2));
        this.E = Math.round(l * Math.sin(deg / 360 * Math.PI * 2));
    };

    get length() {
        return Math.sqrt(this.N * this.N + this.E * this.E);
    }

    add(v) {
        this.N += v.N;
        this.E += v.E;
        return this;
    };

    clone() {
        return new Vec2(this.N, this.E);
    }

    rotate(deg = 0) {
        this.dir += deg;
        return this;
    }

    scale(f) {
        this.N *= f;
        this.E *= f;
        return this;
    };
};

const actions1 = {
    N: (ship, _, val) => ship.N += val,
    S: (ship, _, val) => ship.N -= val,
    E: (ship, _, val) => ship.E += val,
    W: (ship, _, val) => ship.E -= val,
    L: (_, dir, val) => dir.rotate(-val),
    R: (_, dir, val) => dir.rotate(val),
    F: (ship, dir, val) => ship.add(dir.clone().scale(val)),
}

const actions2 = {
    N: (_, wp, val) => wp.N += val,
    S: (_, wp, val) => wp.N -= val,
    E: (_, wp, val) => wp.E += val,
    W: (_, wp, val) => wp.E -= val,
    L: (_, wp, val) => wp.rotate(-val),
    R: (_, wp, val) => wp.rotate(val),
    F: (ship, wp, val) => ship.add(wp.clone().scale(val)),
}

const partOne = (instructions) => {
    const ship = new Vec2();
    const dir = new Vec2(0, 1);
    instructions.forEach((instruction) => actions1[instruction.action](ship, dir, instruction.value));
    return Math.abs(ship.N) + Math.abs(ship.E);
};

const partTwo = (instructions) => {
    const ship = new Vec2();
    const wp = new Vec2(1, 10);
    instructions.forEach((instruction) => actions2[instruction.action](ship, wp, instruction.value));
    return Math.abs(ship.N) + Math.abs(ship.E);
};

fs.readFile('Day12/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n').map(instr => {
        return {
            action: instr.charAt(0),
            value: Number(instr.substring(1)),
        }
    });
    console.log('Part 1:', partOne(input));
    console.log('Part 2:', partTwo(input));
});
