import { getData, getPath } from '../lib/utils.js';
import { createGraph } from './graph.js';
import { createGrid, find } from './grid.js';
import { PrioQ } from '../lib/aStar.js';
import { KeyBox } from './keyBox.js';
import aStar from '../lib/aStar.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input.split('\n').map((row) => row.split(''));
};

function print(maze) {
    maze.forEach((row) => console.log(row.join('')));
}

var getDistance = (from, to) => {
    return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
};

function heuristic(start_node, key_nodes, steps = 0) {
    // Returnerar antal steg som behövs för att samla alla nycklar.
    // Strategin är att gå till närmsta nyckel först och avståndet
    // beräknas med manhattan distance.
    if (key_nodes.length === 0) return steps;

    var keys = key_nodes.slice();
    var keyDistances = keys.map((k) => getDistance(start_node, k));
    var stepsToClosestKey = Math.min(...keyDistances);
    var indexOfClosestKey = keyDistances.indexOf(stepsToClosestKey);
    var closestKey = keys[indexOfClosestKey];
    keys.splice(indexOfClosestKey, 1); // Removed closed key

    return h(closestKey, keys, steps + stepsToClosestKey);
}

class Q {
    constructor() {
        this.queue = [];
        this.ids = [];
    }

    getId(node) {
        return `${node.tile.row},${node.tile.col},${node.keys}`;
    }

    includes(node) {
        return this.ids.includes(this.getId(node));
    }

    push(node) {
        this.queue.push(node);
        this.ids.push(this.getId(node));
    }

    pop() {
        return this.queue.shift();
    }

    empty() {
        return this.queue.length === 0;
    }
}

function reconstruct_path(current) {
    var total_path = [current];
    while (current.previous) {
        total_path.unshift(current.previous);
        current = current.previous;
    }
    return total_path;
}

function bfs(start, goal) {
    var openSet = new Q();
    var closedSet = new Q();
    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();
        closedSet.push(current);

        if (current.keys === goal.keys) {
            console.log('Done!');
            return reconstruct_path(current);
        }

        current.tile.neighbors.forEach((neighbor) => {
            var kb = new KeyBox(current.keys);
            if (
                !neighbor.door ||
                neighbor.door & kb.has(neighbor.value.toLowerCase())
            ) {
                if (neighbor.key) kb.add(neighbor.value);

                var S = {
                    tile: neighbor,
                    keys: kb.val,
                    previous: current,
                };

                if (!openSet.includes(S)) {
                    if (!closedSet.includes(S)) {
                        openSet.push(S);
                    }
                }
            }
        });
    }

    return 'No solution';
}

function manhattan(from, to) {
    return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

function farthestKey(maze) {
    var { grid, keys } = createGrid(maze);
    var start = find('@', grid);
    var distances = keys.map((key) => {
        var dist = manhattan(start, key);
        return dist;
    });

    return Math.max(...distances);
}

const main = async () => {
    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    print(maze);

    var { grid, keys } = createGrid(maze);

    var start = {
        tile: find('@', grid),
        keys: 0,
    };

    var keyBox = new KeyBox();
    keys.forEach((k) => keyBox.add(k.value));
    var goal = { keys: keyBox.val };

    var startTime = Date.now();
    var path = bfs(start, goal);
    console.log('Part 1:', path.length - 1, Date.now() - startTime);
};

main();
