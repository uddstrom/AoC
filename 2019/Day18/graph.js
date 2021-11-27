import { createGrid, find } from './grid.js';
import aStar from '../lib/aStar.js';

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.edges[node] = [];
    }

    addEdge(from, to, weight = 1) {
        this.edges[from].push({ node: to, weight: weight });
    }

    display() {
        let graph = '';
        this.nodes.forEach((node) => {
            graph +=
                node +
                '->' +
                this.edges[node]
                    .map((e) => `(${e.node}, ${e.weight})`)
                    .join(', ') +
                '\n';
        });
        console.log(graph);
    }
}

export function createGraph(maze) {
    var graph = new Graph();

    keys.forEach((key) => {
        graph.addNode(key.value);
        keys.forEach((target) => {
            var { grid } = createGrid(maze);
            var start = find(key.value, grid);
            if (!graph.nodes.includes(target.value)) {
                graph.addNode(target.value);
            }
            if (target !== key) {
                var goal = find(target.value, grid);
                var path = aStar(start, goal, h);
                path && graph.addEdge(key.value, target.value, path.length - 1);
            }
        });
    });

    return graph;
}
