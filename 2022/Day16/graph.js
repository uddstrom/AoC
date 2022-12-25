import { sum } from '../lib/utils.js';
import { PrioQ } from './PrioQ.js';

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.edges[node.id] = [];
    }

    addEdge(from, to, weight) {
        this.edges[from].push({ target: to, weight });
    }

    display() {
        let graph = '';
        this.nodes.forEach((node) => {
            graph +=
                `${node.id}(${node.flowRate}, ${node.isOpen})` +
                ' -> ' +
                this.edges[node.id].map(({ target }) => target).join(', ') +
                '\n';
        });
        console.log(graph, sum(this.nodes.map((n) => n.flowRate)));
    }

    dijk(start, goal) {
        var paths = [];
        var visited = new PrioQ();
        var openSet = new PrioQ();
        var maxFlowRate = sum(this.nodes.map((n) => n.flowRate));

        openSet.push(start);

        while (!openSet.empty()) {
            var current = openSet.pop();
            visited.push(current);

            if (current.time === goal.time) {
                if (current.totalRelease > 1500) {
                    paths.push(current);
                }
                // return this.reconstruct_path(current);
            } else {
                // construct new state
                // three options:
                if (current.flowRate === maxFlowRate) {
                    // 1. max flowrate reached. Stand still.
                    var newState = {
                        time: current.time + 1,
                        location: current.location,
                        flowRate: current.flowRate,
                        totalRelease: current.totalRelease + current.flowRate,
                        previous: current,
                    };
                    openSet.push(newState);
                } else {
                    if (
                        !current.location.isOpen &&
                        current.location.flowRate > 0
                    ) {
                        // 2. valve not and has flowRate. open valve
                        var newState = {
                            time: current.time + 1,
                            location: {
                                ...structuredClone(current.location),
                                isOpen: true,
                            },
                            flowRate:
                                current.flowRate + current.location.flowRate,
                            totalRelease:
                                current.totalRelease + current.flowRate,
                            previous: current,
                        };
                        openSet.push(newState);
                    }
                    // 3. move to next location
                    // explore edges
                    this.edges[current.location.id].forEach((edge) => {
                        var newState = {
                            time: current.time + 1,
                            location: {
                                ...structuredClone(
                                    this.nodes.find((n) => n.id === edge.target)
                                ),
                                isOpen: this.hasBeenOpened(
                                    edge.target,
                                    current
                                ),
                            },
                            flowRate: current.flowRate,
                            totalRelease:
                                current.totalRelease + current.flowRate,
                            previous: current,
                        };

                        // ignore new state if visited already
                        if (!visited.get(newState)) {
                            // if in openSet, check if newState.g is lower.
                            var stateInPQ = openSet.get(newState);
                            if (
                                stateInPQ &&
                                newState.totalRelease < stateInPQ.totalRelease
                            ) {
                                // we found a better path
                                stateInPQ.totalRelease = newState.totalRelease;
                                stateInPQ.previous = current;
                            } else if (!stateInPQ) {
                                // New state, push to queue
                                openSet.push(newState);
                            }
                        }
                    });
                }
            }
        }

        return paths;
    }

    hasBeenOpened(id, current) {
        if (current.location.id === id && current.location.isOpen) return true;
        if (!current.previous) return false;
        return this.hasBeenOpened(id, current.previous);
    }

    reconstruct_path(current) {
        var total_path = [current];
        while (current.previous) {
            total_path.unshift(current.previous);
            current = current.previous;
        }
        return total_path;
    }
}

export function createGraph(nodes) {
    var graph = new Graph();
    // Add nodes
    nodes.forEach((n) => graph.addNode(n));
    // Add edges
    nodes.forEach(({ id, edgesTo }) => {
        edgesTo.forEach((target) => {
            graph.addEdge(id, target, 1);
        });
    });
    return graph;
}
