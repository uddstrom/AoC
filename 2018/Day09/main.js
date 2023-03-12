import { max } from '../lib/utils.js';
import LinkedList from '../lib/LinkedList.js';

function play(players, lastMarble) {
    var scores = new Map();
    var nextMarble = 1;
    var circle = new LinkedList();
    var currentPlayer;

    while (nextMarble <= lastMarble) {
        currentPlayer =
            nextMarble % players === 0 ? players : nextMarble % players;
        if (nextMarble % 23 === 0) {
            // Collect score
            let score = scores.get(currentPlayer) || 0;
            let nodeToRemove = circle.head.prev.prev.prev.prev.prev.prev.prev;
            circle.remove(nodeToRemove);
            score = score + nextMarble + nodeToRemove.value;
            scores.set(currentPlayer, score);
        } else {
            circle.insert(nextMarble, circle.head.next);
        }
        nextMarble++;
    }
    return max([...scores.values()]);
}

// 400 players; last marble is worth 71864 points
console.log('Part 1:', play(400, 71864));
console.log('Part 2:', play(400, 71864 * 100));