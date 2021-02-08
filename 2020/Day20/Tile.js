
class Tile {
    constructor(id, data) {
        this.id = id;
        this.data = [];
        this.bordersA = []; // edge values unflipped
        this.bordersB = []; // edge values flipped along Y axis
        this.matchesA = []; // matching tiles (tileIds) [top, right, bottom, left]
        this.matchesB = []; // matching tiles (tileIds) when flipped [top, right, bottom, left]

        // Changes with current flip/rotation
        this.borders = []; // edge values according to current flip/rotation setup.
        this.matches = [];

        this.flipped = false;
        this.rotation = 0;
    }

    calculateBorderValues() {
        const [topA, topB] = toDecimals(this.data[0]);
        const [bottomB, bottomA] = toDecimals(this.data[9]);
        const [leftB, leftA] = toDecimals(this.data.map(d => d.charAt(0)).join(''));
        const [rightA, rightB] = toDecimals(this.data.map(d => d.charAt(9)).join(''));
        this.bordersA = [topA, rightA, bottomA, leftA];
        this.bordersB = [topB, leftB, bottomB, rightB];
    }

    flip() {
        // along Y-axis -> reverse each row in data.
        this.data = this.data.map(row => row.split('').reverse().join(''));
        this.flipped = !this.flipped;

        switch (this.rotation) {
            case 0:
                this.matches = [this.matchesB[0], this.matchesB[1], this.matchesB[2], this.matchesB[3]];
                break;
            case 90:
                this.matches = [this.matchesB[3], this.matchesB[0], this.matchesB[1], this.matchesB[2]];
                break;
            case 180:
                this.matches = [this.matchesB[2], this.matchesB[3], this.matchesB[0], this.matchesB[1]];
                break;
            case 270:
                this.matches = [this.matchesB[1], this.matchesB[2], this.matchesB[3], this.matchesB[0]];
                break;
        }

        this.setBorders();
    }

    rotate() {
        // 90 degrees clockwise
        // https://medium.com/front-end-weekly/matrix-rotation-%EF%B8%8F-6550397f16ab
        const reversed = this.data.map(row => row.split('')).reverse();
        const rotated = reversed[0].map((_, idx) => reversed.map(row => row[idx]).join(''));
        this.data = rotated;
        this.matches = [this.matches[3], this.matches[0], this.matches[1], this.matches[2]];
        this.setBorders();

        this.rotation = (this.rotation + 90) % 360;
    }

    setBorders() {
        const [top] = toDecimals(this.data[0]);
        const [right] = toDecimals(this.data.map(d => d.charAt(9)).join(''));
        const [_b, bottom] = toDecimals(this.data[9]);
        const [_l, left] = toDecimals(this.data.map(d => d.charAt(0)).join(''));
        this.borders = [top, right, bottom, left];
    }

    setMatches(tiles) {
        const findMatchingTile = (border) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.bordersA.includes(border) || t.bordersB.includes(border))?.id;
        };

        this.tile.matches = [
            findMatchingTile(this.tile.bordersB[0]),
            findMatchingTile(this.tile.bordersB[1]),
            findMatchingTile(this.tile.bordersB[2]),
            findMatchingTile(this.tile.bordersB[3]),
        ];
    }

    isCorner() {
        return this.matchesA.filter(m => m !== undefined).length === 2
            || this.matchesB.filter(m => m !== undefined).length === 2;
    }

    isEdge() {
        return this.matchesA.filter(m => m !== undefined).length === 3
            || this.matchesB.filter(m => m !== undefined).length === 3;
    }

    isCenter() {
        return this.matchesA.filter(m => m !== undefined).length === 4
            || this.matchesB.filter(m => m !== undefined).length === 4;
    }

    noBorders() {
        const withoutBorders = [];
        for (let row = 1; row < 9; row++) {
            withoutBorders.push(this.data[row].substring(1, 9));
        }
        return withoutBorders;
    }
}

const toDecimals = (binaryString) => [
    parseInt(binaryString, 2),
    parseInt(binaryString.split('').reverse().join(''), 2),
];

module.exports = { Tile };
