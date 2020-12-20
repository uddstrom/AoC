const fs = require('fs');

const getUnionCount = (group) => {
    return [...new Set(group.flat())].length;
};

const getIntersectCount = (group) => {
    const intersect = (a, b) => a.filter((el) => b.includes(el));
    return group.reduce((acc, curr) => intersect(acc, curr)).length;
};

const getGroups = (input) => {
    const groups = [];
    let group = [];
    input.forEach((line) => {
        if (line === '') {
            groups.push(group);
            group = [];
        } else {
            group.push(line.split(''));
        }
    });
    return groups;
};

fs.readFile('Day06/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = [...contents.split('\n'), ''];

    const unionSum = getGroups(puzzle_input)
        .map(getUnionCount)
        .reduce((acc, curr) => acc + curr, 0);

    const intersectSum = getGroups(puzzle_input)
        .map(getIntersectCount)
        .reduce((acc, curr) => acc + curr, 0);

    console.log('Part 1:', unionSum);
    console.log('Part 2:', intersectSum);
});
