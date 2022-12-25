import { getData, getPath } from '../lib/utils.js';
import { PrioQ } from './PrioQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var nodes = new Map();
    input.split('\n').forEach((row) => {
        let captures = row
            .match(
                /Valve (\w{2}) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.+)/
            )
            .slice(1);

        nodes.set(captures[0], {
            id: captures[0],
            flowRate: Number(captures[1]),
            edgesTo: captures[2].split(', '),
        });
    });
    return nodes;
}

function dijk(nodes, start, goal) {
    var visited = new PrioQ();
    var openSet = new PrioQ();
    var maxRelease = 0;

    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();
        visited.push(current);

        if (current.time === goal.time) {
            if (current.totalRelease > maxRelease) {
                maxRelease = current.totalRelease;
            }
        } else {
            // construct new state
            // three options:
            let currentFlowRate = nodes.get(current.location.id).flowRate;
            if (!current.location.isOpen && currentFlowRate > 0) {
                // 2. valve not and has flowRate. open valve
                var newState = {
                    time: current.time + 1,
                    location: {
                        id: current.location.id,
                        isOpen: true,
                    },
                    flowRate: current.flowRate + currentFlowRate,
                    totalRelease: current.totalRelease + current.flowRate,
                    previous: current,
                };
                openSet.push(newState);
            }
            // 3. move to next location
            // explore edges
            var edges = nodes.get(current.location.id).edgesTo;
            edges.forEach((edge) => {
                var newState = {
                    time: current.time + 1,
                    location: {
                        id: edge,
                        isOpen: hasBeenOpened(edge, current),
                    },
                    flowRate: current.flowRate,
                    totalRelease: current.totalRelease + current.flowRate,
                    previous: current,
                };

                // ignore new state if visited already
                if (!visited.get(newState)) {
                    openSet.push(newState);
                }
            });
        }
    }

    return maxRelease;
}

function hasBeenOpened(id, current) {
    if (current.location.id === id && current.location.isOpen) return true;
    if (!current.previous) return false;
    return hasBeenOpened(id, current.previous);
}

var nodes = getData(PUZZLE_INPUT_PATH)(parser);

var start = {
    time: 0,
    location: { id: 'AA', isOpen: false },
    flowRate: 0,
    totalRelease: 0,
};

var startTime = Date.now();
var goal = { time: 30 };
var maxRelease = dijk(nodes, start, goal);
var endTime = Date.now();
var time = (endTime - startTime) / 1000;

console.log('Part 1:', maxRelease, time);

console.log('Part 2:');
