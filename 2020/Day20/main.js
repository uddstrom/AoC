const fs = require('fs');
const { parseTiles } = require('./parse');
const { getPuzzleConfig } = require('./puzzleConfig');
const { printImage, printPuzzleConfig } = require('./printing');
const { matchTiles } = require('./tile');

const assembleImage = (puzzleConfig, tiles) => {
    const tileSize = 8;
    const puzzleData = puzzleConfig.map(row => row.map(tile => tiles.find(t => t.id === tile.id).removeBorders()));
    const image = [];

    puzzleData.forEach(puzzleRow => {
        for (tileRow = 0; tileRow < tileSize; tileRow++) {
            image.push(puzzleRow.map(puzzleTile => puzzleTile[tileRow]).join(''));
        }
    })

    return image;
};

fs.readFile('Day20/input', 'utf8', function (err, contents) {
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
    printPuzzleConfig(config);
    const image = assembleImage(config, tiles);
    printImage(image);

});
