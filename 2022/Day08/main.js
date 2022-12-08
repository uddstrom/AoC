import { getData, getPath, max, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((row) => row.split('').map(Number));
}

function getTreesInEachDirection(map, x, y) {
    function getTrees(x, y, [dx, dy], trees = []) {
        var inMap = (x, y) =>
            y >= 0 && y < map.length ? x >= 0 && x < map[y].length : false;
        if (!inMap(x + dx, y + dy)) return trees;
        trees.push(map[y + dy][x + dx]);
        return getTrees(x + dx, y + dy, [dx, dy], trees);
    }
    return [
        [0, -1], // North
        [1, 0], // East
        [0, 1], // South
        [-1, 0], // West
    ].map((dir) => getTrees(x, y, dir));
}

function countVisible(map) {
    function isVisible(x, y) {
        var isSmaller = (t) => t < map[y][x];
        return getTreesInEachDirection(map, x, y).some(
            (T) => T.length === 0 || T.every(isSmaller)
        );
    }
    var visibleCount = 0;
    map.forEach((row, y) => {
        row.forEach((_, x) => {
            if (isVisible(x, y)) visibleCount++;
        });
    });
    return visibleCount;
}

function getHighestScenicScore(map) {
    function scenicScore(x, y) {
        var trees = getTreesInEachDirection(map, x, y);
        var isTaller = (tree) => tree >= map[y][x];
        var toScore = (T) => {
            var viewingDistance = T.findIndex(isTaller);
            return viewingDistance === -1 ? T.length : viewingDistance + 1;
        };
        return product(trees.map(toScore));
    }
    return max(map.flatMap((row, y) => row.map((_, x) => scenicScore(x, y))));
}

var data = getData(PUZZLE_INPUT_PATH)(parser); // [[1,2,3], [4,5,6], [7,8,9]]
console.log('Part 1:', countVisible(data));
console.log('Part 2:', getHighestScenicScore(data));
