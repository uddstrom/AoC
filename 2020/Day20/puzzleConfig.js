const getPuzzleConfig = (tiles) => {

    const puzzleSize = Math.sqrt(tiles.length);
    const tileSize = 8;
    const puzzleConfig = Array(puzzleSize).fill().map(() => Array(puzzleSize).fill(undefined));
    const tilesInUse = [];

    const mirror = (n) => {
        const binaryString = n.toString(2).padStart(10, '0');
        const mirrorNum = parseInt(binaryString.split('').reverse().join(''), 2);
        return mirrorNum;
    };

    const findMatchingTile = (border, excludes) => {
        return tiles
            .filter(t => !excludes.includes(t.id))
            .find(t => t.bordersA.includes(border) || t.bordersB.includes(border));
    };

    const matchLeft = (r, c) => {
        // console.log('match left', r, c);
        // match with right edge of tile to the left
        const borderToMatch = mirror(puzzleConfig[r][c - 1].borders[1]);
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
        puzzleConfig[r][c] = matchingTile;
    }

    const matchUp = (r, c) => {
        // console.log('match up', r, c);
        // match with bottom edge of tile above
        const borderToMatch = puzzleConfig[r - 1][c].borders[2];
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
        puzzleConfig[r][c] = matchingTile;
    }

    puzzleConfig.map((row, r) => row.map((tile, c) => {
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
                puzzleConfig[r][c] = corner;
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

        tilesInUse.push(puzzleConfig[r][c]);
    }));

    return puzzleConfig;
}

module.exports = { getPuzzleConfig };
