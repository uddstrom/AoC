const fs = require('fs');

const countTrees = (map, slope) => {
    let row = 0,
        col = 0,
        trees = 0;
    while (row < map.length) {
        if (map[row].charAt(col) === '#') trees++;
        col = (col + slope.right) % map[row].length;
        row += slope.down;
    }

    return trees;
};

const checkSlopes = (map) => {
    return [
        { right: 1, down: 1 },
        { right: 3, down: 1 },
        { right: 5, down: 1 },
        { right: 7, down: 1 },
        { right: 1, down: 2 },
    ].reduce((acc, current) => countTrees(map, current) * acc, 1);
};

fs.readFile('Day03/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\n');

    console.log('Part 1:', countTrees(puzzle_input, { right: 3, down: 1 }));
    console.log('Part 2:', checkSlopes(puzzle_input));
});
