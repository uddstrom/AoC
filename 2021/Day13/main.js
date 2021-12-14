import { count, getData, getPath, matrix } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    var [coords, folds] = input.split('\n\n');
    coords = coords.split('\n').map((coord, r) => {
        let [x, y] = coord.split(',').map(Number);
        return { x, y };
    });
    folds = folds
        .split('\n')
        .map((f) => f.replace('fold along ', ''))
        .map((f) => f.split('='))
        .map((f) => {
            let [dir, pos] = f;
            return { dir, fpos: Number(pos) };
        });
    return [coords, folds];
}

function executeFold(paper, { dir, fpos }, idx) {
    let ROWS = paper.length;
    let COLS = paper[0].length;

    if (idx === 1) console.log('Part 1:', count(1, paper.flat()));
    if (dir === 'x') return verticalFold();
    if (dir === 'y') return horisontalFold();

    function horisontalFold() {
        let top_size = fpos;
        let bottom_size = ROWS - fpos - 1;
        let newRowSize = Math.max(top_size, bottom_size);

        function hMerge(r, c) {
            if (top_size === bottom_size) {
                return paper[r][c] || paper[ROWS - r - 1][c];
            }
            let offset = Math.abs(bottom_size - top_size);
            if (top_size < bottom_size) {
                if (r < offset) return paper[ROWS - r - 1][c];
                return paper[r - offset][c] || paper[ROWS - r - 1][c];
            }
            if (top_size > bottom_size) {
                if (r < offset) return paper[r][c];
                return paper[r][c] || paper[ROWS - (r - offset) - 1][c];
            }
        }

        let foldedPaper = matrix(newRowSize, COLS);
        for (let r = 0; r < newRowSize; r++) {
            for (let c = 0; c < COLS; c++) {
                foldedPaper[r][c] = hMerge(r, c);
            }
        }
        return foldedPaper;
    }

    function verticalFold() {
        let left_size = fpos;
        let right_size = COLS - fpos - 1;
        let newColSize = Math.max(left_size, right_size);

        function vMerge(r, c) {
            if (left_size === right_size) {
                return paper[r][c] || paper[r][COLS - c - 1];
            }
            let offset = Math.abs(right_size - left_size);
            if (left_size < right_size) {
                if (c < offset) return paper[r][COLS - c - 1];
                return paper[r][c - offset] || paper[r][COLS - c - 1];
            }
            if (left_size > right_size) {
                if (c < offset) return paper[r][c];
                return paper[r][c] || paper[r][COLS - (c - offset) - 1];
            }
        }

        let foldedPaper = matrix(ROWS, newColSize);
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < newColSize; c++) {
                foldedPaper[r][c] = vMerge(r, c);
            }
        }
        return foldedPaper;
    }
}

function print(paper) {
    paper.forEach((row) =>
        console.log(row.join('').replaceAll('0', ' ').replaceAll('1', '#'))
    );
}

function preparePaper(coords) {
    let COLS = Math.max(...coords.map((coord) => coord.x)) + 1;
    let ROWS = Math.max(...coords.map((coord) => coord.y)) + 1;
    let paper = matrix(ROWS, COLS);
    coords.forEach(({ x, y }) => (paper[y][x] = 1));
    return paper;
}

function main() {
    let [coords, foldInstr] = getData(PUZZLE_INPUT_PATH)(parser);
    let foldedPaper = foldInstr.reduce(executeFold, preparePaper(coords));
    console.log('Part 2:');
    print(foldedPaper);
}

main();
