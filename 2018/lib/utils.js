const fs = require('fs');

function getData(path) {
    // Eager loading, only want to do it once.
    const contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    };
}

function getMostFrequentElement(array) {
    return array
        .slice(0)
        .sort(
            (a, b) =>
                array.filter((val) => val === a).length -
                array.filter((val) => val === b).length
        )
        .pop();
}

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

function toDate(str) {
    // 1518-07-07 00:50
    var [dateStr, timeStr] = str.split(' ');
    var [YYYY, MM, dd] = dateStr.split('-').map(Number);
    var [hh, mm] = timeStr.split(':').map(Number);
    return new Date(Date.UTC(YYYY, MM - 1, dd, hh, mm));
}

module.exports = { getData, getMostFrequentElement, range, toDate };
