const { Tile } = require('./tile');

const parseTiles = (input) => {
    const tiles = [];
    let tile, counter = 0;
    input.split('\n').forEach(line => {
        if (line.startsWith('Tile')) {
            tile = new Tile(+line.substring(line.indexOf(' '), line.indexOf(':')));
            counter = 0;
        } else if (counter < 10) {
            tile.data.push(line.replaceAll('.', 0).replaceAll('#', 1));
            counter++;
        } else {
            tiles.push(tile);
        }
    });
    tiles.forEach(tile => tile.calculateInitialBorderValues());
    return tiles;
};

module.exports = { parseTiles };
