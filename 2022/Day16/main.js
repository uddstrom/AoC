import { getData, getPath, max } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var maps = new Map();
    var flows = new Map();
    input.split('\n').forEach((row) => {
        var { valve, rate, edges } = row.match(
            /Valve (?<valve>\w{2}) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<edges>.+)/
        ).groups;

        maps.set(valve, edges.split(', '));
        flows.set(valve, Number(rate));
    });
    return [maps, flows];
}

function dijk(G, start) {
    var dist = new Map();
    var Q = [];

    dist.set(start, 0);
    Q.push(start);

    while (Q.length > 0) {
        let current = Q.pop();
        G.get(current).forEach((neighbor) => {
            let tentative_gScore = dist.get(current) + 1;
            if (!dist.has(neighbor) || tentative_gScore < dist.get(neighbor)) {
                dist.set(neighbor, tentative_gScore);
                Q.push(neighbor);
            }
        });
    }

    return dist;
}

function solve(pos, time, opened, elephants = 0) {
    if (time <= 0) {
        return elephants > 0 ? solve('AA', 26, [...opened], 0) : 0;
    }

    var key = `${pos};${time};${opened.join()};${elephants}`;
    if (cache.has(key)) return cache.get(key);

    var scores = [];
    var distMap = distances.get(pos);
    for (let next of distMap.keys()) {
        if (pos !== next && flows.get(next) > 0 && !opened.includes(next)) {
            scores.push(
                solve(next, time - distMap.get(next), [...opened], elephants)
            );
        }
    }

    var flow = flows.get(pos);
    if (flow > 0 && !opened.includes(pos)) {
        scores.push(
            flow * (time - 1) +
                solve(pos, time - 1, [...opened, pos].sort(), elephants)
        );
    }

    var score = scores.length ? max(scores) : 0;
    cache.set(key, score);

    return score;
}

var [maps, flows] = getData(PUZZLE_INPUT_PATH)(parser);
var distances = new Map();
var cache = new Map();
var start = Date.now();

[...maps.keys()].forEach((n) => distances.set(n, dijk(maps, n)));

console.log('Part 1:', solve('AA', 30, [], 0));
console.log('Part 2:', solve('AA', 26, [], 1));
console.log(`Finished in ${Date.now() - start} ms.`);
