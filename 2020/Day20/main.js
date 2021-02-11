const fs = require('fs');
const { parseTiles } = require('./parse');
const { getPuzzleConfig } = require('./puzzleConfig');
const { matchTiles } = require('./tile');
const { findSeaMonsters } = require('./seamonsters');
const { assembleImage, Image } = require('./image');

fs.readFile('Day20/puzzle_input', 'utf8', function (err, contents) {
    const tiles = parseTiles(contents);
    matchTiles(tiles);

    const corners = tiles.filter(tile => tile.isCorner()).map(tile => tile.id);
    console.log('Part 1:', corners.reduce((acc, id) => acc * id));

    /*
    Find the tile order (puzzleConfig)
    Put together the image
    Search for sea monsters
    Count # not part of the sea monster
    */

    const config = getPuzzleConfig(tiles);
    const image = assembleImage(config, tiles);

    let monsterParts = new Set();
    let rotates = 0;
    while (rotates < 8) {
        monsterParts = findSeaMonsters(image.data);
        if (monsterParts.size > 0) break;
        if (rotates === 3) image.flip();
        else image.rotate();
        rotates++;
    }

    image.print(monsterParts);
    console.log('Part 2:', image.waterRoughness(monsterParts));
});
