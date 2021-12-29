import { getData, getPath, matrix, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    let instructions = input
        .split('\n')
        .map((line) => line.split(' '))
        .map(([state, coords]) => {
            state = state === 'on' ? true : false;
            coords = coords
                .split(',')
                .map((coord) => coord.substring(2).split('..').map(Number));
            return { state, coords };
        });
    return instructions;
};

function init(instructions) {
    return reboot(instructions.slice(0, 20));
}

function volume(cuboid_id) {
    let coords = cuboid_id.split(',');
    let dx = coords[1] - coords[0] + 1;
    let dy = coords[3] - coords[2] + 1;
    let dz = coords[5] - coords[4] + 1;
    let v = dx * dy * dz;
    return v;
}

function reboot(instructions) {
    let X = new Set();
    let Y = new Set();
    let Z = new Set();

    instructions.forEach((i) => {
        X.add(i.coords[0][0]);
        X.add(i.coords[0][1] + 1);
        Y.add(i.coords[1][0]);
        Y.add(i.coords[1][1] + 1);
        Z.add(i.coords[2][0]);
        Z.add(i.coords[2][1] + 1);
    });

    X = Array.from(X).sort((a, b) => a - b);
    Y = Array.from(Y).sort((a, b) => a - b);
    Z = Array.from(Z).sort((a, b) => a - b);

    let count = new Set();

    function id(cuboid) {
        return `${cuboid[0][0]},${cuboid[0][1]},${cuboid[1][0]},${cuboid[1][1]},${cuboid[2][0]},${cuboid[2][1]}`;
    }

    function split(i) {
        let xmin = i.coords[0][0];
        let xmax = i.coords[0][1];
        let ymin = i.coords[1][0];
        let ymax = i.coords[1][1];
        let zmin = i.coords[2][0];
        let zmax = i.coords[2][1];

        X.filter((x) => x >= xmin && x <= xmax).forEach((x, ix, xarr) =>
            Y.filter((y) => y >= ymin && y <= ymax).forEach((y, iy, yarr) =>
                Z.filter((z) => z >= zmin && z <= zmax).forEach(
                    (z, iz, zarr) => {
                        let cuboid = matrix(3, 2);
                        cuboid[0][0] = x;
                        cuboid[0][1] =
                            xarr[ix + 1] !== undefined
                                ? xarr[ix + 1] - 1
                                : xmax;
                        cuboid[1][0] = y;
                        cuboid[1][1] =
                            yarr[iy + 1] !== undefined
                                ? yarr[iy + 1] - 1
                                : ymax;
                        cuboid[2][0] = z;
                        cuboid[2][1] =
                            zarr[iz + 1] !== undefined
                                ? zarr[iz + 1] - 1
                                : zmax;
                        i.state
                            ? count.add(id(cuboid))
                            : count.delete(id(cuboid));
                    }
                )
            )
        );
    }

    instructions.forEach((i, index) => {
        split(i);
        console.log(`processed ${index + 1} of ${instructions.length}`);
    });

    return [...count].reduce((acc, curr) => acc + volume(curr), 0);
}

function main() {
    let instructions = getData(PUZZLE_INPUT_PATH)(parser);

    console.log('Part 1:', init(instructions));
    console.log('Part 2:', reboot(instructions));
}

main();
