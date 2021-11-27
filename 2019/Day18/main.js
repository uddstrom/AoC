import { getData, getPath } from '../lib/utils.js';
import { createGraph } from './graph.js';
import { createGrid, find } from './grid.js';
import { PrioQ } from '../lib/aStar.js';
import { KeyBox } from './keyBox.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input_test`;

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

class XPrioQ extends PrioQ {
    getId(node) {
        return `${node.tile.row},${node.tile.col},${node.keys}`;
    }
    includes(node) {
        var nodeId = this.getId(node);
        var incl = this.queue.map(this.getId).includes(nodeId);
        return incl;
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

function aStar(start, goal, h) {
    var compareFn = (n1, n2) => n1.f - n2.f;
    var openSet = new XPrioQ(compareFn);
    var closedSet = new XPrioQ(compareFn);
    start.g = 0;
    start.f = h(start, goal);
    openSet.push(start);

    while (!openSet.empty()) {
        var current = openSet.pop();
        closedSet.push(current);

        // console.log(
        //     `Current: (${current.tile.row}, ${current.tile.col}) Keys: ${current.keys}`
        // );

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

                var tentative_gScore = current.g + 1;
                var S = {
                    tile: neighbor,
                    keys: kb.val,
                    previous: current,
                    g: tentative_gScore,
                    f: tentative_gScore + h(neighbor, goal),
                };
                // if (tentative_gScore < neighbor.g) { // Vad ska man jämföra scoren med? Grannen har ju ingen score.

                if (!closedSet.includes(S)) {
                    if (!openSet.includes(S)) {
                        // console.log(
                        //     '  pushing',
                        //     S.tile.row,
                        //     S.tile.col,
                        //     S.keys
                        // );
                        openSet.push(S);
                    }
                }
                // }
            }
        });
    }

    return 'No solution';
}

const main = async () => {
    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    print(maze);
    // console.log(maze);
    // var graph = createGraph(maze);
    // graph.display();

    // console.log('Part 1:');
    // console.log('Part 2:');

    var { grid, doors, keys } = createGrid(maze);

    var start = {
        tile: find('@', grid),
        keys: 0,
    };

    var keyBox = new KeyBox();
    keys.forEach((k) => keyBox.add(k.value));
    var goal = { keys: keyBox.val };

    var h = () => 0;

    var path = aStar(start, goal, h);

    console.log('Part 1:', path.length - 1);
};

main();

// var kb = new KeyBox();
// kb.add('a')
// kb.add('c')
// kb.add('d')
// console.log('c', kb.has('c'))
// console.log('b', kb.has('b'))
