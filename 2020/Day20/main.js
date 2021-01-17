const fs = require('fs');

const Tile = (id) => ({
    id,
    data: [],
});

const setBoarderValues = (tile) => {
    const toDecimals = (binaryString) => [
        parseInt(binaryString, 2),
        parseInt(binaryString.split('').reverse().join(''), 2),
    ];

    const [top, topFlipped] = toDecimals(tile.data[0]);
    const [bottomFlipped, bottom] = toDecimals(tile.data[9]);
    const [leftFlipped, left] = toDecimals(tile.data.map(d => d.charAt(0)).join(''));
    const [right, rightFlipped] = toDecimals(tile.data.map(d => d.charAt(9)).join(''));
    tile.borders = [top, bottom, left, right];
    tile.bordersFlipped = [topFlipped, bottomFlipped, leftFlipped, rightFlipped];
};

const getTiles = (data) => {
    const tiles = [];
    let tile, counter = 0;
    data.split('\n').forEach(line => {
        if (line.startsWith('Tile')) {
            tile = Tile(+line.substring(line.indexOf(' '), line.indexOf(':')));
            counter = 0;
        } else if (counter < 10) {
            tile.data.push(line.replaceAll('.', 0).replaceAll('#', 1));
            counter++;
        } else {
            tiles.push(tile);
        }
    });
    tiles.forEach(tile => setBoarderValues(tile));
    return tiles;
};

const findCorners = (tiles) => {
    return tiles.filter(tile => {
        const findMatchingTile = (boarder) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.borders.includes(boarder) || t.bordersFlipped.includes(boarder));
        };
        const matches = tile.borders.map((border) => findMatchingTile(border)).filter(m => m !== undefined);
        const matchesFlipped = tile.bordersFlipped.map((boarder) => findMatchingTile(boarder)).filter(m => m !== undefined);
        return matches.length < 3 && matchesFlipped.length < 3;
    }).map(tile => tile.id);
};

const matchTiles = (tiles) => {
    tiles.forEach(tile => {
        console.log(tile);
        const findMatchingTile = (boarder) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.borders.includes(boarder) || t.bordersFlipped.includes(boarder));
        };
        tile.top = findMatchingTile(tile.borders[0]) || findMatchingTile(tile.bordersFlipped[0]);
        tile.bottom = findMatchingTile(tile.borders[1]) || findMatchingTile(tile.bordersFlipped[1]);
        tile.left = findMatchingTile(tile.borders[2]) || findMatchingTile(tile.bordersFlipped[2]);
        tile.right = findMatchingTile(tile.borders[3]) || findMatchingTile(tile.bordersFlipped[3]);
    });
};

fs.readFile('Day20/input', 'utf8', function (err, contents) {
    const tiles = getTiles(contents);
    console.log('Part 1:', findCorners(tiles).reduce((acc, id) => acc * id));

    /*
    Find the tile order
    Remove the borders
    Search for sea monsters
    Count # not part of the sea monster
    */

    // Find the tile order
    matchTiles(tiles);


    console.log(tiles);
});
