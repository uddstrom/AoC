import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    return input
        .split('\n')
        .map((line) => line.split(' '))
        .map(([state, coords]) => {
            coords = coords
                .split(',')
                .map((coord) => coord.substring(2).split('..').map(Number));
            return {
                state: state === 'on' ? 1 : 0,
                xmin: coords[0][0],
                xmax: coords[0][1],
                ymin: coords[1][0],
                ymax: coords[1][1],
                zmin: coords[2][0],
                zmax: coords[2][1],
            };
        });
};

function reboot(instructions, cuboids = []) {
    if (instructions.length === 0)
        return cuboids.reduce((acc, curr) => acc + volume(curr), 0);
    let instr = instructions.shift();
    let newCuboids = [];
    if (instr.state === 1) newCuboids.push(instr);
    cuboids.forEach((c) => {
        let i = intersection(c, instr);
        if (i) newCuboids.push(i);
    });
    return reboot(instructions, [...cuboids, ...newCuboids]);
}

function volume(cuboid) {
    let dx = cuboid.xmax - cuboid.xmin + 1;
    let dy = cuboid.ymax - cuboid.ymin + 1;
    let dz = cuboid.zmax - cuboid.zmin + 1;
    let v = dx * dy * dz;
    return cuboid.state === 1 ? v : v * -1;
}

function intersection(c1, c2) {
    let x = intersect(c1.xmin, c1.xmax, c2.xmin, c2.xmax);
    if (x.length > 0) {
        let y = intersect(c1.ymin, c1.ymax, c2.ymin, c2.ymax);
        if (y.length > 0) {
            let z = intersect(c1.zmin, c1.zmax, c2.zmin, c2.zmax);
            if (z.length > 0) {
                return {
                    state: c1.state === 1 ? 0 : 1,
                    xmin: x[0],
                    xmax: x[1],
                    ymin: y[0],
                    ymax: y[1],
                    zmin: z[0],
                    zmax: z[1],
                };
            }
        }
    }
}

function intersect(min1, max1, min2, max2) {
    let min, max;
    for (let i = min1; i <= max1; i++) {
        if (i >= min2 && i <= max2) {
            min = i;
            break;
        }
    }
    if (min !== undefined) {
        for (let i = max1; i >= min1; i--) {
            if (i <= max2 && i >= min2) {
                max = i;
                break;
            }
        }
        if (max !== undefined) {
            return [min, max];
        }
    }
    return [];
}

function main() {
    let instructions = getData(PUZZLE_INPUT_PATH)(parser);
    console.log('Part 1:', reboot(instructions.slice(0, 20)));
    console.log('Part 2:', reboot(instructions));
}

main();
