import { createGrid, find } from './grid.js';
import { aStar } from '../lib/aStar.js';
import { KeyRing } from './keyRing.js';
import { PrioQ } from './PrioQ.js';
import { isDoor, isKey, isRobot } from './misc.js';

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.edges[node] = [];
    }

    addEdge(from, to, weight) {
        this.edges[from].push({ target: to, weight });
    }

    display() {
        let graph = '';
        this.nodes.forEach((node) => {
            graph +=
                node +
                '->' +
                this.edges[node]
                    .map(
                        (e) =>
                            `(${e.target}, ${e.weight.cost}, [${[
                                ...e.weight.doors,
                                ...e.weight.keys,
                            ]}])`
                    )
                    .join(', ') +
                '\n';
        });
        console.log(graph);
    }

    dijk(start, goal) {
        var visited = new PrioQ();
        var openSet = new PrioQ();

        start.g = 0;
        openSet.push(start);

        while (!openSet.empty()) {
            var current = openSet.pop();
            visited.push(current);

            if (current.keys === goal.keys) {
                return this.reconstruct_path(current);
            } else {
                var currentRobot =
                    current.node !== '@' && isRobot(current.node)
                        ? current.node
                        : current.robot;

                if (
                    isRobot(current.node) &&
                    current.previous.node !== '@' &&
                    current.node !== current.previous.robot &&
                    current.node !== current.robot
                ) {
                    var robotPos = current.pos[currentRobot] || currentRobot;

                    // construct new state
                    var newState = {
                        node: robotPos,
                        keys: current.keys,
                        g: current.g, // should be total cost to get here
                        previous: current,
                        robot: currentRobot,
                        pos: current.pos,
                    };
                    current = newState;
                }
                // explore edges
                this.edges[current.node].forEach((edge) =>
                    this.explore(edge, current, openSet, visited, currentRobot)
                );
            }
        }

        return 'No solution';
    }

    explore(edge, current, openSet, visited, robot) {
        var {
            target,
            weight: { cost, doors, keys },
        } = edge;

        function prerequisitesFullfilled() {
            // Target is not the start node.
            if (target === '@') return false;

            // Target is not the robots start node.
            if (target === robot) return false;

            // Don't have the key already
            if (KeyRing.has(current.keys, target)) return false;

            // If we need to pass doors, we must have the keys.
            if (doors.length > 0) {
                for (var door of doors) {
                    if (!KeyRing.has(current.keys, door.toLowerCase()))
                        return false;
                }
            }

            // No keys in the path that we don't have (in that case, go there first)
            if (keys.length > 0) {
                for (var key of keys) {
                    if (!KeyRing.has(current.keys, key)) return false;
                }
            }

            return true;
        }

        // Can we go to target node?
        if (prerequisitesFullfilled()) {
            var newKeyRing = isKey(target)
                ? KeyRing.add(current.keys, target)
                : current.keys;

            var pos = { ...current.pos };
            if (robot && !isRobot(target)) pos[robot] = target;
            // construct new state
            var newState = {
                node: target,
                keys: newKeyRing,
                g: current.g + cost, // should be total cost to get here
                previous: current,
                robot,
                pos,
            };

            // ignore new state if visited already
            if (!visited.get(newState)) {
                // if in openSet, check if newState.g is lower.
                var stateInPQ = openSet.get(newState);
                if (stateInPQ && newState.g < stateInPQ.g) {
                    // we found a shorter path
                    stateInPQ.g = newState.g;
                    stateInPQ.previous = current;
                } else if (!stateInPQ) {
                    // New state, push to queue
                    openSet.push(newState);
                }
            }
        }
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

export function createGraph(maze) {
    var h = (node, goal) => {
        return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
    };

    var { grid, robots, doors, keys } = createGrid(maze);

    var graph = new Graph();
    var start = find('@', grid);
    start && graph.addNode(start.value);
    // Add nodes
    robots.forEach((robot) => graph.addNode(robot.value));
    keys.forEach((key) => graph.addNode(key.value));
    doors.forEach((door) => graph.addNode(door.value));
    // Add edges
    graph.nodes.forEach((start_node) => {
        graph.nodes.forEach((to_node) => {
            if (start_node !== to_node && !isRobot(to_node)) {
                var { grid } = createGrid(maze);
                var start = find(start_node, grid);
                var goal = find(to_node, grid);
                var path = aStar(start, goal, h);
                if (path) {
                    var keys_in_path = path
                        .filter((grid_tile) => grid_tile.key)
                        .filter((grid_tile) => grid_tile.value !== start_node)
                        .filter((grid_tile) => grid_tile.value !== to_node)
                        .map((grid_tile) => grid_tile.value);
                    var doors_in_path = path
                        .filter((grid_tile) => grid_tile.door)
                        .map((grid_tile) => grid_tile.value);
                    graph.addEdge(start_node, to_node, {
                        cost: path.length - 1,
                        keys: keys_in_path,
                        doors: doors_in_path,
                    });
                }
            }
        });
    });

    //add fake start and edges to the robots
    if (start === undefined) {
        graph.addNode('@');
        robots.forEach((robot) =>
            graph.addEdge('@', robot.value, {
                cost: 0,
                keys: [],
                doors: [],
            })
        );
        keys.forEach((key) =>
            robots.forEach((robot) =>
                graph.addEdge(key.value, robot.value, {
                    cost: 0,
                    keys: [],
                    doors: [],
                })
            )
        );
    }

    // remove door nodes
    graph.nodes = graph.nodes.filter((node) => !isDoor(node));

    // remove door edges
    for (const from_node in graph.edges) {
        if (isDoor(from_node)) {
            delete graph.edges[from_node];
        } else {
            graph.edges[from_node] = graph.edges[from_node].filter(
                ({ target }) => !isDoor(target)
            );
        }
    }

    return graph;
}
