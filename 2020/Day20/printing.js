const printPuzzleConfig = (config) => {
    console.log('-- Puzzle config -----------------------------');
    config.forEach(row => console.log(row.map(tile => tile?.id)));
    console.log('----------------------------------------------');
};

const printImage = (image) => {
    console.log('-- Image -------------------------------------');
    image.forEach(row => console.log(row));
    console.log('----------------------------------------------');
};

module.exports = { printPuzzleConfig, printImage };
