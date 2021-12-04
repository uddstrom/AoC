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

var isMarked = (cell) => cell.marked;
var isComplete = (row) => row.every(isMarked);
var isWinner = (board) => board.some(isComplete);

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

function bingo(tombola) {
    var scores = [];
    return function play(boards) {
        if (boards.length === 0) return [scores.shift(), scores.pop()];

        var number = tombola.next().value;
        boards.forEach(markNumber(number));
        var [winner] = boards.filter(isWinner);

        if (winner) scores.push(calculateScore(winner, number));

        return play(boards.filter(not(isWinner)));
    };
}

function main() {
    var [numbers, boards] = getData(PUZZLE_INPUT_PATH)(parser);

    var tombola = Tombola(numbers);
    var [first, last] = bingo(tombola)(boards);

    console.log('Part 1:', first);
    console.log('Part 2:', last);
}

main();
