const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;
const { getData, range } = require('../lib/utils');

function rowToClaim(row) {
    // row: #1271 @ 591,628: 21x14
    var parts = row.split(' ');
    return {
        id: Number(parts[0].substring(1)),
        x: Number(parts[2].split(',')[0]),
        y: Number(parts[2].split(',')[1].replace(':', '')),
        w: Number(parts[3].split('x')[0]),
        h: Number(parts[3].split('x')[1]),
    };
}

function claimsParser(input) {
    var claimRows = input.split('\n');
    return claimRows.map(rowToClaim);
}

function getCoordList({ x, y, w, h }) {
    var Xcoords = range(x, x + w - 1);
    var Ycoords = range(y, y + h - 1);
    return Ycoords.map(y => Xcoords.map(x => ({ x, y }))).flat();
}

function setupFabric(claims) {
    var fabric = new Map();
    function pinFabric(id) {
        return ({ x, y }) => {
            const key = `${x},${y}`;
            var ids = fabric.get(key) || new Set();
            fabric.set(key, ids.add(id));
        };
    }

    claims.forEach(function processClaim(claim) {
        var coordList = getCoordList(claim);
        coordList.forEach(pinFabric(claim.id));
    });

    return fabric;
};

function findClaimWithoutOverlap() {
    var claimIds = new Set(claims.map(claim => claim.id));
    fabric.forEach(function deleteOverlappingClaims(ids, key) {
        if (ids.size > 1) {
            ids.forEach(id => claimIds.delete(id));
        }
    });
    return [...claimIds][0];
}

var claims = getData(PUZZLE_INPUT_PATH)(claimsParser);
var fabric = setupFabric(claims);

const inchesOfFabicWithOverlaps = [...fabric].filter(([_, ids]) => ids.size > 1).length;

console.log('Part 1:', inchesOfFabicWithOverlaps);
console.log('Part 2:', findClaimWithoutOverlap());
