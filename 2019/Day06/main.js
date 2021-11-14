const fs = require("fs");

class Graph {
    constructor() {
        this.adjList = new Map();
    }
    addVertex(v) {
        this.adjList.set(v, []);
    }
    addEdge(src, dest) {
        this.adjList.get(src).push(dest);
    }
    print() {
        const Vs = this.adjList.keys();
        for (const v of Vs) {
            console.log(`${v} -> ${this.adjList.get(v).toString()}`);
        }
    }
    countOrbits() {
        const Vs = this.adjList.keys();
        let orbits = 0;
        for (const v of Vs) {
            orbits += this.distance(v, "COM");
        }
        return orbits;
    }

    distance(src, dest) {
        let dist = 0;
        let parent = src;
        while (parent != dest) {
            dist++;
            parent = this.adjList.get(parent).toString();
        }
        return dist;
    }

    pathToCOM(v) {
        let path = [];
        let parent = v;
        while (parent != "COM") {
            parent = this.adjList.get(parent).toString();
            path.push(parent);
        }
        return path;
    }
}

let puzzle_input;

fs.readFile("Day06/puzzle_input", "utf8", function(err, contents) {
    puzzle_input = contents.split("\r\n");
    const g = buildGraph(puzzle_input);
    console.log('Part I: ', g.countOrbits());
    
    const firstCommon = g.pathToCOM('YOU').filter(v => g.pathToCOM('SAN').includes(v)).shift();
    console.log('Part II: ', g.distance("YOU", firstCommon) + g.distance("SAN", firstCommon) - 2);
});

const buildGraph = (puzzle_input) => {
    const getVertices = (input) => {
        return [...new Set(input.map((i) => i.split(")")).flat())];
    };

    const g = new Graph();
    getVertices(puzzle_input).map(v => g.addVertex(v));
    puzzle_input.map(edge => {
        g.addEdge(edge.split(')')[1], edge.split(')')[0]);
    });
    return g;
}


