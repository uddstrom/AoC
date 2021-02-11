const assembleImage = (puzzleConfig, tiles) => {
    const tileSize = 8;
    const puzzleData = puzzleConfig.map(row => row.map(tile => tiles.find(t => t.id === tile.id).removeBorders()));
    const image = [];

    puzzleData.forEach(puzzleRow => {
        for (tileRow = 0; tileRow < tileSize; tileRow++) {
            image.push(puzzleRow.map(puzzleTile => puzzleTile[tileRow]).join(''));
        }
    })

    return new Image(image.map(row => row.split('').map(col => Number(col))));
};

class Image {
    constructor(data) {
        this.data = data;
        this.side = 'A';
        this.rotation = 0;
    }

    flip() {
        // along Y-axis -> reverse each row in data.
        this.data = this.data.map(row => row.reverse());
        this.side = this.side === 'A' ? 'B' : 'A';
    }

    rotate() {
        // 90 degrees clockwise
        // https://medium.com/front-end-weekly/matrix-rotation-%EF%B8%8F-6550397f16ab
        const reversed = this.data.reverse();
        const rotated = reversed[0].map((_, idx) => reversed.map(row => row[idx]));
        this.data = rotated;
        this.rotation = (this.rotation + 90) % 360;
    }

    print(monsterParts) {
        const bits = [...this.data.map(row => [...row])];
        monsterParts.forEach(mp => {
            const r = Number(mp.split(',')[0]);
            const c = Number(mp.split(',')[1]);
            bits[r][c] = 'O';
        });
        console.log(`Side: ${this.side}, Rotation: ${this.rotation}`);
        bits.forEach(row => console.log(row.join('').replaceAll('0', '.').replaceAll('1', '#')));
    }

    waterRoughness(monsterParts) {
        const bits = [...this.data.map(row => [...row])];
        monsterParts.forEach(mp => {
            const r = Number(mp.split(',')[0]);
            const c = Number(mp.split(',')[1]);
            bits[r][c] = 'O';
        });
        return bits.reduce((total, row) => total + row.reduce((acc, col) => col === 1 ? acc + 1 : acc, 0), 0);
    }
}

module.exports = { assembleImage, Image };
