import { getData, getPath } from '../lib/utils.js';
import { not } from '../lib/fn.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var rows = input.split('\n');
    var numbers = rows.shift().split(',').map(Number);
    var boards = rows
        .map((row) => {
            return row
                .split(' ')
                .filter((str) => str.length > 0)
                .map((number) => ({ n: Number(number), marked: false }));
        })
        .filter((arr) => arr.length > 0)
        .reduce(boardReducer, [])
        .map(addColumns);
    return [numbers, boards];
}

function boardReducer(boards, row, idx) {
    idx % 5 === 0
        ? // start new board
          boards.push([row])
        : // push row to last board
          boards[boards.length - 1].push(row);
    return boards;
}

function addColumns(board) {
    var columns = [0, 1, 2, 3, 4].map((c) =>
        [0, 1, 2, 3, 4].map((r) => board[r][c])
    );
    return [...board, ...columns];
}

var isComplete = (row) => !row.find(({ n, marked }) => !marked);
var isWinner = (board) => board.filter(isComplete).length > 0;

function markNumber(numberToMark) {
    return function (board) {
        board.forEach((row) =>
            row.forEach((number) => {
                number.marked = number.marked || number.n === numberToMark;
            })
        );
    };
}

function calculateScore(board, lastNumber) {
    var sumOfUnmarked = board
        .slice(0, 5)
        .flat()
        .reduce((acc, { n, marked }) => (marked ? acc : acc + n), 0);
    return sumOfUnmarked * lastNumber;
}

function* Tombola(numbers) {
    while (numbers.length > 0) yield numbers.shift();
}

function main() {
    var [numbers, boards] = getData(PUZZLE_INPUT_PATH)(parser);

    var tombola = Tombola(numbers);
    var firstWinner = undefined;
    var lastWinner = undefined;
    var number, first_winning_number;

    while (boards.length > 0) {
        number = tombola.next().value;
        boards.forEach(markNumber(number));

        var [winner] = boards.filter(isWinner);

        if (winner) {
            if (firstWinner === undefined) {
                firstWinner = winner;
                first_winning_number = number;
            }
            if (boards.length === 1) lastWinner = winner;
        }

        boards = boards.filter(not(isWinner));
    }

    console.log('Part 1:', calculateScore(firstWinner, first_winning_number));
    console.log('Part 2:', calculateScore(lastWinner, number));
}

main();
