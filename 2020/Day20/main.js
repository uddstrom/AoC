const fs = require('fs');

const Tile = (id) => ({
    id,
    data: [],
});

const setEdgeValues = (tile) => {
    const toDecimals = (binaryString) => [
        parseInt(binaryString, 2),
        parseInt(binaryString.split('').reverse().join(''), 2),
    ];

    const [top, topFlipped] = toDecimals(tile.data[0]);
    const [bottomFlipped, bottom] = toDecimals(tile.data[9]);
    const [leftFlipped, left] = toDecimals(tile.data.map(d => d.charAt(0)).join(''));
    const [right, rightFlipped] = toDecimals(tile.data.map(d => d.charAt(9)).join(''));
    tile.edges = [top, bottom, left, right];
    tile.edgesFlipped = [topFlipped, bottomFlipped, leftFlipped, rightFlipped];
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
    tiles.forEach(tile => setEdgeValues(tile));
    return tiles;
};

const findCorners = (tiles) => {
    return tiles.filter(tile => {
        const findMatchingTile = (edge) => {
            return tiles
                .filter(t => t.id !== tile.id)
                .find(t => t.edges.includes(edge) || t.edgesFlipped.includes(edge));
        };
        const matches = tile.edges.map((edge) => findMatchingTile(edge)).filter(m => m !== undefined);
        const matchesFlipped = tile.edgesFlipped.map((edge) => findMatchingTile(edge)).filter(m => m !== undefined);
        return matches.length < 3 && matchesFlipped.length < 3;
    }).map(tile => tile.id);
};

fs.readFile('Day20/puzzle_input', 'utf8', function (err, contents) {
    const tiles = getTiles(contents);
    console.log('Part 1:', findCorners(tiles).reduce((acc, id) => acc * id));
});
