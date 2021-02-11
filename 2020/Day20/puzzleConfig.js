const getPuzzleConfig = (tiles) => {

    const puzzleSize = Math.sqrt(tiles.length);
    const puzzleConfig = Array(puzzleSize).fill().map(() => Array(puzzleSize).fill(undefined));
    const tilesInUse = [];

    const mirror = (n) => {
        const binaryString = n.toString(2).padStart(10, '0');
        return parseInt(binaryString.split('').reverse().join(''), 2);
    };

    const findMatchingTile = (border, excludes) => {
        return tiles
            .filter(t => !excludes.includes(t.id))
            .find(t => t.bordersA.includes(border) || t.bordersB.includes(border));
    };

    const findAndRotateFirstCorner = () => {
        const corner = tiles.find(t => t.isCorner());
        let rotates = 0;
        while (rotates < 8) {
            if (corner.matches[1] !== undefined && corner.matches[2] !== undefined) break;
            if (rotates === 4) corner.flip();
            else corner.rotate();
            rotates++;
        }
        return corner;
    }

    const matchLeft = (r, c) => {
        // match with right edge of tile to the left
        const borderToMatch = mirror(puzzleConfig[r][c - 1].borders[1]);
        const matchingTile = findMatchingTile(borderToMatch, tilesInUse.map(p => p.id));
        // rotate/flip matching tile so matching border is to the left
        let rotates = 0;
        while (rotates < 8) {
            if (matchingTile.borders[3] === borderToMatch) break;
            if (rotates === 3) matchingTile.flip();
            else matchingTile.rotate();
            rotates++;
        }
        puzzleConfig[r][c] = matchingTile;
    }

    const matchUp = (r, c) => {
        // match with bottom edge of tile above
        const borderToMatch = mirror(puzzleConfig[r - 1][c].borders[2]);
        const matchingTile = findMatchingTile(borderToMatch, tilesInUse.map(p => p.id));
        // rotate/flip matching tile so matching border is to the left
        let rotates = 0;
        while (rotates < 8) {
            if (matchingTile.borders[0] === borderToMatch) break;
            if (rotates === 3) matchingTile.flip();
            else matchingTile.rotate();
            rotates++;
        }
        puzzleConfig[r][c] = matchingTile;
    }

    puzzleConfig.map((row, r) => row.map((tile, c) => {
        if (r === 0) {
            if (c === 0) puzzleConfig[r][c] = findAndRotateFirstCorner();
            else matchLeft(r, c);
        } else {
            if (c === 0) matchUp(r, c);
            else matchLeft(r, c);
        }
        tilesInUse.push(puzzleConfig[r][c]);
    }));

    return puzzleConfig;
}

module.exports = { getPuzzleConfig };
