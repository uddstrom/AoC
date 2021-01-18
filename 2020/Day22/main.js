const fs = require('fs');

const calculateScore = (deck) => deck.reduce((acc, value, idx) => acc + (deck.length - idx) * value, 0);

function crabCombat(p1, p2) {
    while (p1.length !== 0 && p2.length !== 0) {
        const card1 = p1.shift();
        const card2 = p2.shift();

        card1 > card2
            ? p1.push(card1, card2)
            : p2.push(card2, card1)
    }
    return calculateScore(p1.length > 0 ? p1 : p2);
}

function recursiveCombat(p1, p2) {
    let roundId;
    const handsPlayed = new Set();

    while (p1.length !== 0 && p2.length !== 0) {
        roundId = `${p1.join()}:${p2.join()}`;
        const card1 = p1.shift();
        const card2 = p2.shift();

        if (handsPlayed.has(roundId)) return ['p1'];
        handsPlayed.add(roundId);

        if (card1 > p1.length || card2 > p2.length) {
            card1 > card2
                ? p1.push(card1, card2)
                : p2.push(card2, card1)
        } else {
            const [winner, _] = recursiveCombat(p1.slice(0, card1), p2.slice(0, card2));
            winner === 'p1'
                ? p1.push(card1, card2)
                : p2.push(card2, card1)
        }
    }

    return p1.length > 0
        ? ['p1', calculateScore(p1)]
        : ['p2', calculateScore(p2)]
}

fs.readFile('Day22/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');

    const p1 = input.slice(1, input.indexOf('Player 2:') - 1).map(Number);
    const p2 = input.slice(input.indexOf('Player 2:') + 1).map(Number);

    console.log('Part 1:', crabCombat([...p1], [...p2]));
    console.log('Part 2:', recursiveCombat([...p1], [...p2])[1]);
});
