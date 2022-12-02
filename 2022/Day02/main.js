import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((rows) => rows.split(' '));
}

function getScorePart1(round) {
    // A for Rock, B for Paper, and C for Scissors
    // X for Rock, Y for Paper, and Z for Scissors
    // 1 for Rock, 2 for Paper, and 3 for Scissors
    var [opponent, me] = round;
    var score = me === 'X' ? 1 : me === 'Y' ? 2 : 3;
    if (me === 'X' && opponent === 'A') score += 3;
    if (me === 'X' && opponent === 'C') score += 6;
    if (me === 'Y' && opponent === 'B') score += 3;
    if (me === 'Y' && opponent === 'A') score += 6;
    if (me === 'Z' && opponent === 'C') score += 3;
    if (me === 'Z' && opponent === 'B') score += 6;

    return score;
}

function getShape(opponent, result) {
    var rock = 'A';
    var paper = 'B';
    var scissors = 'C';
    var lose = 'X';
    var draw = 'Y';
    var win = 'Z';

    if (opponent === rock && result === lose) return scissors;
    if (opponent === rock && result === draw) return rock;
    if (opponent === rock && result === win) return paper;
    if (opponent === paper && result === lose) return rock;
    if (opponent === paper && result === draw) return paper;
    if (opponent === paper && result === win) return scissors;
    if (opponent === scissors && result === lose) return paper;
    if (opponent === scissors && result === draw) return scissors;
    if (opponent === scissors && result === win) return rock;
}

function getScorePart2(round) {
    var [opponent, result] = round;
    var scores = {
        A: 1, // rock
        B: 2, // paper
        C: 3, // scissors
        X: 0, // lose
        Y: 3, // draw
        Z: 6, // win
    };
    var shape = getShape(opponent, result);
    return scores[shape] + scores[result];
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [['A','X'], ['B','Y'], ...]
console.log('Part 1:', sum(data.map(getScorePart1)));
console.log('Part 2:', sum(data.map(getScorePart2)));
