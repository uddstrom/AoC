import { getData, getPath } from '../lib/utils.js';
import { createGraph } from './graph.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) => {
        let captures = row
            .match(
                /Valve (\w{2}) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.+)/
            )
            .slice(1);
        return {
            id: captures[0],
            flowRate: Number(captures[1]),
            edgesTo: captures[2].split(', '),
            isOpen: false,
        };
    });
}

function printPath(path) {
    if (path.previous) {
        printPath(path.previous);
    }
    console.log(
        `[${path.time},${path.location.id},${
            path.location.isOpen ? 'open' : 'closed'
        },${path.flowRate},${path.totalRelease}]`
    );
}

var nodes = getData(PUZZLE_INPUT_PATH)(parser);

var graph = createGraph(nodes);
graph.display();

var start = {
    time: 0,
    location: graph.nodes.find((n) => n.id === 'AA'),
    flowRate: 0,
    totalRelease: 0,
};
var goal = { time: 30 };
var paths = graph
    .dijk(start, goal)
    .sort((p1, p2) => p2.totalRelease - p1.totalRelease)
    .slice(0, 3);

// paths.forEach(printPath);

console.log('Part 1:', paths[0].totalRelease);
console.log('Part 2:');

// > 1563
