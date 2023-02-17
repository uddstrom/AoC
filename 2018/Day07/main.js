import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
	var graph = new Map();
	// Step I must be finished before step B can begin.	
	input.split('\n').forEach((line) => {
		var words = line.split(' ');
		var [from, to] = [words[1], words[7]];
		if (!graph.has(from)) graph.set(from, []);
		if (!graph.has(to)) graph.set(to, []);
		graph.set(from, [...graph.get(from), to]);
	});
	return graph;
}

function p1(graph, sorted = []) {
	if (graph.size === 0) return sorted.join('');

	var isAvailable = (node) => ![...graph.values()].some(edges => edges.includes(node));
	var next = [...graph.keys()].filter(isAvailable).sort()[0];
	graph.delete(next);
	sorted.push(next);

	return p1(graph, sorted);
}

function p2(graph, t = 0, wip = []) {
	
	// delete nodes that are done from graph.
	wip	 
		.filter(([, timeLeft]) => timeLeft === 0)
		.forEach(([node]) => graph.delete(node));

	if (graph.size === 0) return t;

	// keep nodes with time left.
	wip = wip
		.filter(([_, timeLeft]) => timeLeft > 0)
		.map(([node, timeLeft]) => [node, timeLeft - 1]);

	// identify nodes that are available, prioritize and push on wip with duration value.
	var isAvailable = (node) => {
		if (wip.some(([n, _]) => n === node)) return false; // node is in wip.
		return ![...graph.values()].some(edges => edges.includes(node));
	}

	[...graph.keys()].filter(isAvailable).sort().slice(0, 5 - wip.length)
		.forEach(node => wip.push([node, 60 + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(node)]));

	return p2(graph, t + 1, wip);
}

var G = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', p1(structuredClone(G)));
console.log('Part 2:', p2(G));

