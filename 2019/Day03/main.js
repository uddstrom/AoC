import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((path) => {
        return path.split(',').map((part) => {
            const dir = part.slice(0, 1);
            const dist = Number(part.slice(1));
            return { dir, dist };
        });
    });
}

function calculateVisited(arr) {
    var visited = [[0, 0, 0]];
    arr.forEach(({ dir, dist }) => {
        if (dir === 'R') addVisited(1, 0, dist, visited);
        if (dir === 'L') addVisited(-1, 0, dist, visited);
        if (dir === 'U') addVisited(0, 1, dist, visited);
        if (dir === 'D') addVisited(0, -1, dist, visited);
    });
    return visited;
}

function addVisited(dx, dy, dist, visited) {
    var [x, y, d] = visited[visited.length - 1];
    for (var i = 1; i <= dist; i++) {
        visited.push([x + dx * i, y + dy * i, d + i]);
    }
}

function intersect(array1, array2) {
    var intersections = [];
    array1.forEach(([x1, y1, d1]) => {
        array2.forEach(([x2, y2, d2]) => {
            if (x1 === x2 && y1 === y2) intersections.push([x1, y1, d1 + d2]);
        });
    });
    return intersections;
}

function manhattan(intersections) {
    var ds = intersections
        .map(([x, y]) => Math.abs(x) + Math.abs(y))
        .filter((d) => d > 0);

    return Math.min(...ds);
}

function wireDistance(intersections) {
    return Math.min(
        ...intersections.map(([x, y, d]) => d).filter((d) => d > 0)
    );
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var w1 = calculateVisited(data[0]);
var w2 = calculateVisited(data[1]);
var intersections = intersect(w1, w2);

console.log('Part 1:', manhattan(intersections));
console.log('Part 2:', wireDistance(intersections));
