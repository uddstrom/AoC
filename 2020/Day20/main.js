const fs = require('fs');
const { Tile } = require('./Tile');
const { parseTiles } = require('./parse');

const findCorners = (tiles) => {
    return tiles.filter(tile => {
        const findMatchingTile = (boarder) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.bordersA.includes(boarder) || t.bordersB.includes(boarder));
        };
        const matchesA = tile.bordersA.map((border) => findMatchingTile(border)).filter(m => m !== undefined);
        const matchesB = tile.bordersB.map((boarder) => findMatchingTile(boarder)).filter(m => m !== undefined);
        return matchesA.length < 3 && matchesB.length < 3;
    }).map(tile => tile.id);
};

// const matchTiles = (tiles) => {
//     tiles.forEach(tile => {
//         const findMatchingTile = (boarder) => {
//             return tiles
//                 .filter(t => t.id !== tile.id)
//                 .find(t => t.bordersA.includes(boarder) || t.bordersB.includes(boarder))?.id;
//         };
//         tile.topA = findMatchingTile(tile.bordersA[0]);
//         tile.topB = findMatchingTile(tile.bordersB[0]);
//         tile.rightA = findMatchingTile(tile.bordersA[1]);
//         tile.rightB = findMatchingTile(tile.bordersB[1]);
//         tile.bottomA = findMatchingTile(tile.bordersA[2]);
//         tile.bottomB = findMatchingTile(tile.bordersB[2]);
//         tile.leftA = findMatchingTile(tile.bordersA[3]);
//         tile.leftB = findMatchingTile(tile.bordersB[3]);
//     });
// };

const printPuzzle = (puzzle) => {
    // puzzle.forEach(row => console.log(row.map(tile => tile.id)));
    puzzle.forEach(row => console.log(row));
}



fs.readFile('Day20/input', 'utf8', function (err, contents) {
    const tiles = parseTiles(contents);

    console.log('Part 1:', findCorners(tiles).reduce((acc, id) => acc * id));


    /*
    Find the tile order
    Remove the borders
    Search for sea monsters
    Count # not part of the sea monster
    */

    // Find the tile order
    // matchTiles(tiles);
    // console.log(tiles.filter(t => t.id === 1951));

    // const puzzle = [[], [], []];

    // puzzle[0][0] = tiles.find(t => isTopLeft(t));
    // puzzle[0][1] = tiles.find(t => t.id === puzzle[0][0].rightA);
    // puzzle[0][2] = tiles.find(t => t.id === puzzle[0][1].rightA);

    // printPuzzle(puzzle);

});
