import { getData, getPath, isEven, max } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split("").map(Number);
}

var uncompress = (disk) => disk.flatMap((n, i) => Array(n).fill(isEven(i) ? i / 2 : "."));
var checksum = (disk) => disk.reduce((acc, cur, i) => (Number.isInteger(cur) ? acc + cur * i : acc), 0);

var findFreeSlot = (disk, len, maxidx) => {
    for (let i = 0; i < maxidx; i++) {
        if (disk[i] === "." && disk.slice(i, i + len).every((el) => el === ".")) return i;
    }
};

function defrag1(disk) {
    for (let src = disk.length - 1; src >= 0; src--) {
        if (disk[src] === ".") continue;
        let dest = disk.indexOf(".");
        if (dest && dest < src) {
            disk[dest] = disk[src];
            disk[src] = ".";
        }
    }
    return disk;
}

function defrag2(disk) {
    var maxFileId = max(disk.filter((el) => el !== "."));
    for (let id = maxFileId; id >= 0; id--) {
        let start = disk.indexOf(id);
        let end = disk.lastIndexOf(id);
        let len = end - start + 1;
        let destStart = findFreeSlot(disk, len, start);
        if (destStart) {
            for (let dest = destStart; dest < destStart + len; dest++) {
                disk[dest] = id;
            }
            for (let src = start; src < start + len; src++) {
                disk[src] = ".";
            }
        }
    }
    return disk;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log("Part 1:", checksum(defrag1(uncompress(data)))); // 6301895872542
console.log("Part 2:", checksum(defrag2(uncompress(data)))); // 6323761685944
