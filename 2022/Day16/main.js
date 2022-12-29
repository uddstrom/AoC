import { getData, getPath } from '../lib/utils.js';
import { PrioQ } from './PrioQ.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var nodes = new Map();
    input.split('\n').forEach((row) => {
        var { valve, rate, edges } = row.match(
            /Valve (?<valve>\w{2}) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<edges>.+)/
        ).groups;

        nodes.set(valve, {
            id: valve,
            flowRate: Number(rate),
            edgesTo: edges.split(', '),
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
        let current = openSet.pop();
        visited.push(current);

        if (current.time === goal.time) {
            if (current.totalRelease > maxRelease) {
                maxRelease = current.totalRelease;
            }
            continue;
        }
        // construct new states
        let currentFlowRate = nodes.get(current.location).flowRate;
        if (
            !current.openValves.includes(current.location) &&
            currentFlowRate > 0
        ) {
            // valve not open and has flowRate. open valve
            let newState = {
                time: current.time + 1,
                location: current.location,
                flowRate: current.flowRate + currentFlowRate,
                totalRelease: current.totalRelease + current.flowRate,
                openValves: [...current.openValves, current.location],
                previous: current,
            };
            openSet.push(newState);
        }
        // explore edges
        let edges = nodes.get(current.location).edgesTo;
        edges.forEach((edge) => {
            let newState = {
                time: current.time + 1,
                location: edge,
                flowRate: current.flowRate,
                totalRelease: current.totalRelease + current.flowRate,
                openValves: [...current.openValves],
                previous: current,
            };

            // ignore new state if visited already
            if (!visited.includes(newState)) {
                openSet.push(newState);
            }
        });
    }

    return maxRelease;
}

var nodes = getData(PUZZLE_INPUT_PATH)(parser);

var start = {
    time: 0,
    location: 'AA',
    openValves: [],
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
