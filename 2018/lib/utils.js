const fs = require('fs');

function getData(path) {
    // Eager loading, only want to do it once.
    const contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    }
}

module.exports = { getData }