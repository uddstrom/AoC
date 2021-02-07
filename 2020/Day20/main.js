const fs = require('fs');
const { parseTiles } = require('./parse');

const findCorners = (tiles) => {
    return tiles.filter(tile => {
        const findMatchingTile = (border) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.bordersA.includes(border) || t.bordersB.includes(border));
        };
        const matchesA = tile.bordersA.map((border) => findMatchingTile(border)).filter(m => m !== undefined);
        const matchesB = tile.bordersB.map((border) => findMatchingTile(border)).filter(m => m !== undefined);
        return matchesA.length < 3 && matchesB.length < 3;
    }).map(tile => tile.id);
};

const matchTile = (tile, tiles) => {
    const findMatchingTile = (border) => {
        return tiles
            .filter(t => t.id !== tile.id)
            .find(t => t.bordersA.includes(border) || t.bordersB.includes(border))?.id;
    };

    tile.matchesA = [
        findMatchingTile(tile.bordersA[0]),
        findMatchingTile(tile.bordersA[1]),
        findMatchingTile(tile.bordersA[2]),
        findMatchingTile(tile.bordersA[3]),
    ];

    tile.matchesB = [
        findMatchingTile(tile.bordersB[0]),
        findMatchingTile(tile.bordersB[1]),
        findMatchingTile(tile.bordersB[2]),
        findMatchingTile(tile.bordersB[3]),
    ];

    tile.matches = [...tile.matchesA];

    return tile;
};

const matchTiles = (tiles) => {
    tiles.forEach(tile => matchTile(tile, tiles));
};

const printPuzzle = (puzzle) => {
    puzzle.forEach(row => console.log(row.map(tile => tile?.id)));
    // puzzle.forEach(row => console.log(row));
}

const mirror = (n) => {
    const binaryString = n.toString(2).padStart(10, '0');
    const mirrorNum = parseInt(binaryString.split('').reverse().join(''), 2);
    return mirrorNum;
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
    matchTiles(tiles);
    // console.log(tiles);
    // console.log(tiles.find(t => t.id === 3079));
    // console.log(tiles.find(t => t.id === 2729).isEdge());

    const findMatchingTile = (border, excludes) => {
        return tiles
            .filter(t => !excludes.includes(t.id))
            .find(t => t.bordersA.includes(border) || t.bordersB.includes(border));
    };

    const puzzleSize = Math.sqrt(tiles.length);
    const puzzle = Array(puzzleSize).fill().map(() => Array(puzzleSize).fill(undefined));
    const tilesInUse = []

    const matchLeft = (r, c) => {
        // console.log('match left', r, c);
        // match with right edge of tile to the left
        const borderToMatch = mirror(puzzle[r][c - 1].borders[1]);
        // console.log('Looking for match to border', borderToMatch);
        const matchingTile = findMatchingTile(borderToMatch, tilesInUse.map(p => p.id));
        // rotate/flip matching tile so matching border is to the left
        let rotates = 0;
        while (matchingTile.borders[3] !== mirror(borderToMatch)) {
            if (rotates > 8) {
                throw Error("Tiles not matching");
            }
            if (rotates === 4) {
                // back at start, need to flip
                matchingTile.flip();
            } else {
                matchingTile.rotate();
            }
            rotates++;
        }
        // console.log('Match found', matchingTile);
        puzzle[r][c] = matchingTile;
    }

    const matchUp = (r, c) => {
        // console.log('match up', r, c);
        // match with bottom edge of tile above
        const borderToMatch = puzzle[r - 1][c].borders[2];
        // console.log('Looking for match to border', borderToMatch);
        const matchingTile = findMatchingTile(borderToMatch, tilesInUse.map(p => p.id));
        // rotate/flip matching tile so matching border is to the left
        let rotates = 0;
        while (matchingTile.borders[0] !== mirror(borderToMatch)) {
            if (rotates > 8) {
                throw Error("Tiles not matching");
            }
            if (rotates === 4) {
                // back at start, need to flip
                matchingTile.flip();
            } else {
                matchingTile.rotate();
            }
            rotates++;
        }
        // console.log('Match found', matchingTile);
        puzzle[r][c] = matchingTile;
    }

    puzzle.map((row, r) => row.map((tile, c) => {
        if (r === 0) {
            // first row
            if (c === 0) {
                // first corner
                let corner = tiles.find(t => t.isCorner());
                let rotates = 0;
                while (corner.matches[1] === undefined || corner.matches[2] === undefined) {
                    if (rotates > 8) {
                        throw Error("Tiles not matching");
                    }
                    if (rotates === 4) {
                        // back at start, need to flip
                        corner.flip();
                    } else {
                        corner.rotate();
                    }
                    rotates++;
                }
                // console.log('First corner', corner);
                puzzle[r][c] = corner;
            }

            if (c > 0) {
                // top edge
                matchLeft(r, c);
            }
        }

        if (r > 0) {
            // second to last row
            if (c === 0) {
                // left edge, match up
                matchUp(r, c);
            }

            if (c > 0) {
                // top edge
                matchLeft(r, c);
            }
        }

        tilesInUse.push(puzzle[r][c]);
    }));

    printPuzzle(puzzle);

});



