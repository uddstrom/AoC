const fs = require('fs');
const { Point, Vec } = require('./math');
const { AsteroidMap } = require('./AsteroidMap');

const readPuzzleInput = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function(err, contents) {
            contents
                ? resolve(contents.split('\r\n').map(row => row.split('')))
                : reject('Error reading file');
        });
    });
};

const main = async () => {
    const file = process.argv[2] || '2019/Day10/puzzle_input';
    const separator = '\r\n';
    try {
        const puzzle_input = await readPuzzleInput(file, separator);
        const map = new AsteroidMap(puzzle_input);
        const bestAsteroid = map.getBestMonitoringLocation();
        console.log(`Part I: Best location is asteroid at (${bestAsteroid.location.x}, ${bestAsteroid.location.y}) detecting ${bestAsteroid.visibleNeighbors} asteroids.`);
        map.startVaporizationFrom(bestAsteroid);
    } catch (err) {
        console.error(err);
    }
};

main();
