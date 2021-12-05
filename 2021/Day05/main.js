import { getData, getPath, range } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var vecs = input
        .split('\n')
        .map((row) => row.split(' -> '))
        .map(toVector);
    return vecs;
}

function toVector([start, end]) {
    var vec2 = (x, y) => ({ x, y });
    return {
        start: vec2(...start.split(',').map(Number)),
        end: vec2(...end.split(',').map(Number)),
    };
}

function toPoints({
    start: { x: start_x, y: start_y },
    end: { x: end_x, y: end_y },
}) {
    var xs = start_x <= end_x ? range(start_x, end_x) : range(end_x, start_x);
    var ys = start_y <= end_y ? range(start_y, end_y) : range(end_y, start_y);
    var vecToString = ({ x, y }) => `${x},${y}`;

    var points = xs.map((x) => {
        return ys.map((y) => ({
            x,
            y,
        }));
    });
    return points.flat().map(vecToString);
}

function countOverlaps(vectors) {
    var horisontalOrVertical = (vec) =>
        vec.start.x === vec.end.x || vec.start.y === vec.end.y;
    var points = vectors.filter(horisontalOrVertical).map(toPoints).flat();
    var ventsMap = new Map();
    points.forEach((p) => {
        let n = ventsMap.get(p);
        n ? ventsMap.set(p, n + 1) : ventsMap.set(p, 1);
    });
    return [...ventsMap.values()].filter((val) => val > 1).length;
}

function main() {
    var vectors = getData(PUZZLE_INPUT_PATH)(parser);

    console.log('Part 1:', countOverlaps(vectors));
    console.log('Part 2:');
}

main();
