import { getData, getPath, rng, sum, product, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    let [XMIN, XMAX] = input
        .slice(input.indexOf('x=') + 2, input.indexOf(','))
        .split('..')
        .map(Number);
    let [YMIN, YMAX] = input
        .slice(input.indexOf('y=') + 2, input.length)
        .split('..')
        .map(Number);

    return { XMIN, XMAX, YMIN, YMAX };
};
var { XMIN, XMAX, YMIN, YMAX } = getData(PUZZLE_INPUT_PATH)(parser);

function launchProbe(V_start) {
    function step(V, pos) {
        if (pos.x > XMAX || pos.y < YMIN) return false; // miss
        if (pos.x >= XMIN && pos.x <= XMAX && pos.y >= YMIN && pos.y <= YMAX)
            return true; // hit
        return step(
            { x: V.x - 1 > 0 ? V.x - 1 : 0, y: V.y - 1 }, // new velocity
            { x: pos.x + V.x, y: pos.y + V.y } // new position
        );
    }
    return step(V_start, { x: 0, y: 0 });
}

function startVelocityCandidates() {
    let V_start = [];
    let Vx_min = Math.floor(0.5 + Math.sqrt(0.5 * 0.5 + 2 * XMIN));
    let Vx_max = XMAX;
    let Vy_min = YMIN;
    let Vy_max = Math.abs(YMIN) - 1;
    for (let Vx = Vx_min; Vx <= Vx_max; Vx++) {
        for (let Vy = Vy_min; Vy <= Vy_max; Vy++) {
            V_start.push({ x: Vx, y: Vy });
        }
    }
    return V_start;
}

function main() {
    let maxHeight = ((Math.abs(YMIN) - 1) * Math.abs(YMIN)) / 2;

    var hits = startVelocityCandidates()
        .map(launchProbe)
        .filter((withinTarget) => withinTarget).length;

    console.log('Part 1:', maxHeight);
    console.log('Part 2:', hits);
}

main();
