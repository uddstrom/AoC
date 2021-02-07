class Tile {
    constructor(id, data) {
        this.id = id;
        this.data = [];
        this.bordersA = []; // edge values unflipped
        this.bordersB = []; // edge values flipped along Y axis
    }

    calculateBorderValues() {
        const toDecimals = (binaryString) => [
            parseInt(binaryString, 2),
            parseInt(binaryString.split('').reverse().join(''), 2),
        ];

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
    }

    rotate() {
        // 90 degrees clockwise
        // https://medium.com/front-end-weekly/matrix-rotation-%EF%B8%8F-6550397f16ab
        const reversed = this.data.map(row => row.split('')).reverse();
        const rotated = reversed[0].map((_, idx) => reversed.map(row => row[idx]).join(''));
        this.data = rotated;
    }

    // isTopLeft() {
    //     return this.topA === undefined
    //         && this.topB === undefined
    //         && this.leftA === undefined
    //         && this.rightB === undefined;
    // }

}

module.exports = { Tile };
