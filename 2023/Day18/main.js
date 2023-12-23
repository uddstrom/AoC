import { getData, getPath, count, matrix, rng, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var DIRS = ["R", "D", "L", "U"];

function parser(input) {
    return input.split("\n").map((line) => {
        var { dir, steps, color } = line.match(/(?<dir>[UDLR])\s(?<steps>\d+)\s\((?<color>.*)\)/).groups;
        var p2Steps = Number("0x" + color.substring(1, 6));
        var p2Dir = Number(color.substring(color.length - 1));
        return { p1Dir: DIRS.indexOf(dir), p1Steps: Number(steps), p2Dir, p2Steps };
    });
}

// function print(M) {
//     M.forEach((row) => console.log(row.join("")));
// }

var data = getData(PUZZLE_INPUT_PATH)(parser);

function getRowsAndCols(p2) {
    var dirs = p2 ? data.map(({ p2Dir }) => p2Dir) : data.map(({ p1Dir }) => p1Dir);
    var steps = p2 ? data.map(({ p2Steps }) => p2Steps) : data.map(({ p1Steps }) => p1Steps);

    var rows_down = sum(dirs.map((d, i) => (d === DIRS.indexOf("D") ? steps[i] + 1 : 0)));
    var rows_up = sum(dirs.map((d, i) => (d === DIRS.indexOf("U") ? steps[i] + 1 : 0)));
    var rows = rows_down + rows_up;

    var cols_right = sum(dirs.map((d, i) => (d === DIRS.indexOf("R") ? steps[i] + 1 : 0)));
    var cols_left = sum(dirs.map((d, i) => (d === DIRS.indexOf("L") ? steps[i] + 1 : 0)));
    var cols = cols_left + cols_right;

    return [rows, rows_up, cols, cols_left];
}

var [rows, rows_up, cols, cols_left] = getRowsAndCols(false);

console.log(rows, cols);

var M = matrix(rows, cols, " ");

console.log("M init");

var r = rows_up,
    c = cols_left;

data.forEach(({ p1Dir, p1Steps, p2Dir, p2Steps }) => {
    // console.log(`- ${DIRS[dir]} ${steps} ----------------`);
    var dirs = [
        [0, 1], // R
        [1, 0], // D
        [0, -1], // L
        [-1, 0], // U
    ];

    var [dr, dc] = dirs[p1Dir];
    rng(p1Steps).forEach((i) => {
        r += dr;
        c += dc;
        M[r][c] = "#";
    });
});

M = M.filter((row) => row.includes("#"));

/*

#          #    #  #
####    ####    ####    ####
   #    #               #  #

*/

console.log("M done, calc area");

var area = sum(
    M.map((row, r) => {
        if (r === 0 || r === M.length - 1) return count("#", row);
        var inside = false;
        var area = 0;
        var last = " ";
        for (let i = 0; i < row.length; i++) {
            if (row[i] === "#") {
                if (last === " ") {
                    // find out if inside changes.
                    if (row[i + 1] === " ") inside = !inside;
                    if (row[i + 1] === "#") {
                        // more complicated
                        // check above
                        let rowAbove = M[r - 1];
                        let commingFrom = rowAbove[i] === "#" ? -1 : 1;
                        let indexOfLastDash = row.indexOf(" ", i) - 1;
                        let goingTo = rowAbove[indexOfLastDash] === "#" ? -1 : 1;

                        inside = commingFrom !== goingTo ? !inside : inside;
                    }
                }
                area++;
            }
            if (row[i] === " " && inside) area++;
            last = row[i];
        }

        return area;
    })
);

console.log("Part 1:", area);
console.log("Part 2:");

// 70026 Correct!
