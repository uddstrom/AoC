import { getData, getPath } from '../lib/utils.js';
import SimpleGraph from '../lib/SimpleGraph.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    let G = new SimpleGraph();
    input
        .split('\n')
        .map((line) => line.split('-'))
        .forEach(([n1, n2]) => {
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(n1, n2);
        });
    return G;
}

function isSmallCave(node) {
    return node.match(/^[a-z]+$/);
}

function haveVisitASmallCaveTwice(path) {
    let visitedSmallCaves = path.split('-').filter(isSmallCave);
    let distinctSmallCaves = [...new Set(visitedSmallCaves)];
    return visitedSmallCaves.length !== distinctSmallCaves.length;
}

function exploreGraph(graph, start, end, part2 = false) {
    let paths = [];
    function explore(current, path = '') {
        if (current === end) paths.push(path);
        else {
            graph.edges[current].forEach(({ target }) => {
                if (target === 'start') return;
                if (path.includes(target) && isSmallCave(target)) {
                    if (!part2) return;
                    if (part2 && haveVisitASmallCaveTwice(`${path}-${current}`))
                        return;
                }
                explore(target, `${path}-${current}`);
            });
        }
    }
    explore(start);
    return paths.length;
}

function main() {
    let graph = getData(PUZZLE_INPUT_PATH)(parser);
    console.log('Part 1:', exploreGraph(graph, 'start', 'end'));
    console.log('Part 2:', exploreGraph(graph, 'start', 'end', true));
}

main();
