import { PrioQ } from './PrioQ.js';

function reconstruct_path(_current) {
    var current = _current;
    var total_path = [current];
    while (current.previous) {
        total_path.unshift(current.previous);
        current = current.previous;
    }
    return total_path;
}

// A* finds a path from start to goal.
// f(n) = g(n) + h(n)
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
// g(n) is the cost from the start node to n.
export function aStar(start, goal, h) {
    // compare is a function that defines the sort order of the nodes according to lowest fScore first.
    var compareFn = (n1, n2) => n1.f - n2.f;
    var openSet = new PrioQ(compareFn);
    openSet.push(start);

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    // gScore := map with default value of Infinity
    start.g = 0;

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    // fScore := map with default value of Infinity
    start.f = h(start, goal);

    while (!openSet.empty()) {
        // This operation can occur in O(1) time if openSet is a min-heap or a priority queue
        //current := the node in openSet having the lowest fScore[] value
        var current = openSet.pop();

        if (current === goal) return reconstruct_path(current);

        current.neighbors.forEach((neighbor) => {
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            var tentative_gScore = current.g + neighbor.d;

            if (tentative_gScore < neighbor.g) {
                // This path to neighbor is better than any previous one. Record it!
                neighbor.previous = current;
                neighbor.g = tentative_gScore;
                neighbor.f = tentative_gScore + h(neighbor, goal);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }
}
