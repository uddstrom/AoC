const fs = require('fs');

const getBoardingpass = (input) => {
    return input
        .split('')
        .map((c) => ['F', 'B', 'L', 'R'].indexOf(c) % 2)
        .join()
        .replaceAll(',', '');
};

const getSeatID = (boadringPass) => {
    const row = parseInt(boadringPass.substr(0, 7), 2);
    const col = parseInt(boadringPass.substr(7, 3), 2);
    return row * 8 + col;
};

const findSeat = (seatIDs) => {
    const min = Math.min(...seatIDs);
    const max = Math.max(...seatIDs);
    for (let i = min; i < max; i++) {
        if (!seatIDs.includes(i)) {
            return i;
        }
    }
};

fs.readFile('Day05/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\n');
    const seatIDs = puzzle_input.map(getBoardingpass).map(getSeatID);

    console.log('Part 1:', Math.max(...seatIDs));
    console.log('Part 2:', findSeat(seatIDs));
});
