import { getData, getPath } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("\n").map((line) => line.split(""));
}

class DirectedGraph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.edges[node] = [];
    }

    addEdge(source, target, distance) {
        this.edges[source].push({ target, distance });
    }

    display() {
        let graph = "";
        this.nodes.forEach((node) => {
            graph += node + " -> " + this.edges[node].map((e) => `${e.target} (${e.distance})`).join(", ") + "\n";
        });
        console.log(graph);
    }
}

function createGraph(maze, p2 = false) {
    var G = new DirectedGraph();
    G.addNode("0,1"); // start

    // find nodes
    maze.forEach((row, r) => {
        row.forEach((_, c) => {
            if (maze[r][c] === "#") return;
            if ((r === goal[0] && c === goal[1]) || neighbors(maze, r, c, p2).length > 2) {
                G.addNode(`${r},${c}`);
            }
        });
    });

    // add edges
    G.nodes.forEach((node) => {
        var [r, c] = node.split(",").map(Number);
        neighbors(maze, r, c, p2).forEach(([nr, nc]) => {
            var stack = [[[nr, nc], `${r},${c}`, 1, new Set()]];
            while (stack.length > 0) {
                let [[row, col], source, dist, visited] = stack.pop();
                let node = `${row},${col}`;
                visited.add(node);
                let N = neighbors(maze, row, col, p2);
                if (N.length > 2 || (row === goal[0] && col === goal[1])) {
                    G.addEdge(source, node, dist);
                    continue;
                }
                N.forEach(([nr, nc]) => {
                    if (!visited.has(`${nr},${nc}`)) {
                        stack.push([[nr, nc], source, dist + 1, new Set(visited)]);
                    }
                });
            }
        });
    });
    //G.display();
    return G;
}

function neighbors(G, r, c, p2) {
    return [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ]
        .map(([dr, dc], index) => {
            let curr = G[r][c];
            let slope = p2 ? -1 : ["^", ">", "v", "<"].indexOf(curr);
            if (slope === -1 || (slope >= 0 && slope === index)) {
                if (G[r + dr] && G[r + dr][c + dc] && G[r + dr][c + dc] !== "#") return [r + dr, c + dc];
            }
        })
        .filter(Boolean);
}

function solve(p2) {
    var seen = new Set();
    function dfs(G, node, steps = 0) {
        if (node === `${goal[0]},${goal[1]}`) return steps;
        seen.add(node);
        var max = 0;
        G.edges[node].forEach(({ target, distance }) => {
            if (!seen.has(target)) {
                let len = dfs(G, target, steps + distance);
                max = len > max ? len : max;
            }
        });
        seen.delete(node);
        return max;
    }
    return dfs(createGraph(maze, p2), "0,1");
}

var maze = getData(PUZZLE_INPUT_PATH)(parser);
var goal = [maze.length - 1, maze[0].length - 2];

console.log("Part 1:", solve(false));
console.log("Part 2:", solve(true));
