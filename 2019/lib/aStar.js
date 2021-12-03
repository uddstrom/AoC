export class PrioQ {
    constructor(compareFn) {
        this.queue = [];
        this.compareFn = compareFn;
    }

    push(node) {
        this.queue.push(node);
        this.queue.sort(this.compareFn);
    }

    pop() {
        return this.queue.shift();
    }

    includes(node) {
        return this.queue.includes(node);
    }

    empty() {
        return this.queue.length === 0;
    }
}

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
// compare is a function that defines the sort order of the nodes according to lowest fScore first.
export function aStar(start, goal, h) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    //openSet := {start}
    var compareFn = (n1, n2) => n1.f - n2.f;
    var openSet = new PrioQ(compareFn);
    openSet.push(start);

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    //cameFrom := an empty map

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    // gScore := map with default value of Infinity
    // gScore[start] := 0
    start.g = 0;

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    // fScore := map with default value of Infinity
    // fScore[start] := h(start)
    start.f = h(start, goal);

    while (!openSet.empty()) {
        // This operation can occur in O(1) time if openSet is a min-heap or a priority queue
        //current := the node in openSet having the lowest fScore[] value
        //openSet.Remove(current)
        var current = openSet.pop();

        if (current === goal) {
            // console.log(`Path from ${start.value} to ${goal.value} found.`);
            return reconstruct_path(current);
        }

        //for each neighbor of current
        current.neighbors.forEach((neighbor) => {
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            //tentative_gScore := gScore[current] + d(current, neighbor)
            var tentative_gScore = current.g + 1;

            //if tentative_gScore < gScore[neighbor]
            if (tentative_gScore < neighbor.g) {
                // This path to neighbor is better than any previous one. Record it!
                //cameFrom[neighbor] := current
                neighbor.previous = current;
                //gScore[neighbor] := tentative_gScore
                neighbor.g = tentative_gScore;
                //fScore[neighbor] := tentative_gScore + h(neighbor)
                neighbor.f = tentative_gScore + h(neighbor, goal);

                //if neighbor not in openSet
                //     openSet.add(neighbor)
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }

    // Open set is empty but goal was never reached
    //return failure
    // console.log(`No solution found from ${start.value} to ${goal.value}`);
}
