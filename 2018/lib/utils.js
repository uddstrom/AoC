const fs = require('fs');

function getData(path) {
    // Eager loading, only want to do it once.
    const contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    }
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

module.exports = { getData, range }