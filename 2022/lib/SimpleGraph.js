export default class SimpleGraph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        if (!this.nodes.includes(node)) {
            this.nodes.push(node);
            this.edges[node] = [];
        }
    }

    addEdge(n1, n2) {
        this.edges[n1].push({ target: n2 });
        this.edges[n2].push({ target: n1 });
    }

    display() {
        let graph = '';
        this.nodes.forEach((node) => {
            graph +=
                node +
                ' -> ' +
                this.edges[node].map((e) => `${e.target}`).join(', ') +
                '\n';
        });
        console.log(graph);
    }
}
