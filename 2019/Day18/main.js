import { getData, getPath } from '../lib/utils.js';
import { createGraph } from './graph.js';

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

const main = async () => {
    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    print(maze);
    var graph = createGraph(maze);
    graph.display();

    // console.log('Part 1:');
    // console.log('Part 2:');
};

main();
