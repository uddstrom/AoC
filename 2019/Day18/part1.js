import { getData, getPath } from '../lib/utils.js';
import { createGraph } from './graph.js';
import { createGrid } from './grid.js';
import { KeyRing } from './keyRing.js';
import { parser, printMaze, printPath } from './misc.js';

export function solvePartOne(verbose = false) {
    var startTime = Date.now();

    //const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input_test_2`;
    const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input_part1`;

    var maze = getData(PUZZLE_INPUT_PATH)(parser);
    verbose && printMaze(maze);

    var graph = createGraph(maze);
    verbose && graph.display();

    var { keys } = createGrid(maze);

    var start = {
        node: '@',
        keys: 0,
        g: 0,
        previous: undefined,
        pos: {},
    };

    var keyRing = keys.map((k) => k.value).reduce(KeyRing.add, KeyRing.empty());
    var goal = { keys: keyRing };

    // Dijk
    var path = graph.dijk(start, goal);
    verbose && printPath(path);
    var [lastItem] = path.slice(-1);

    var answer = lastItem.g;
    answer += ` (${Date.now() - startTime} ms)`;

    return answer;
}
