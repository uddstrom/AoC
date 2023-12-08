import { getData, getPath, lcmOfArray } from '../lib/utils.js';
import { trampoline } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var lines = input.split('\n');
    var directions = lines[0].split('');
    var graph = lines.slice(2).map((line) => {
        var { id, L, R } = line.match(/(?<id>\w{3})\s=\s\((?<L>\w{3}),\s(?<R>\w{3})\)/).groups;
        return { id, L, R };
    });
    return [directions, graph];
}

var [directions, graph] = getData(PUZZLE_INPUT_PATH)(parser);

var walk = trampoline(function walk(directions, current, goal, graph, steps = 0) {
    if (current.id.endsWith(goal)) return steps;
    var dir = directions[steps % directions.length];
    var nextNodeId = current[dir];
    var nextNode = graph.find((n) => n.id === nextNodeId);
    return function () {
        return walk(directions, nextNode, goal, graph, steps + 1);
    };
});

var start = graph.find((n) => n.id === 'AAA');
console.log('Part 1:', walk(directions, start, 'ZZZ', graph));

var startNodes = graph.filter((n) => n.id.endsWith('A'));
var steps = startNodes.map((start) => walk(directions, start, 'Z', graph));
console.log('Part 2:', lcmOfArray(steps));
