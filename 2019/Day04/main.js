//372304-847060

function neverDecrease(digits) {
    return (
        digits[0] <= digits[1] &&
        digits[1] <= digits[2] &&
        digits[2] <= digits[3] &&
        digits[3] <= digits[4] &&
        digits[4] <= digits[5]
    );
}

function twoAdjacent(digits) {
    return (
        digits[0] === digits[1] ||
        digits[1] === digits[2] ||
        digits[2] === digits[3] ||
        digits[3] === digits[4] ||
        digits[4] === digits[5]
    );
}

function twoAdjacentNoGroup(d) {
    return (
        (d[0] === d[1] && d[1] !== d[2]) ||
        (d[1] === d[2] && d[1] !== d[0] && d[2] !== d[3]) ||
        (d[2] === d[3] && d[2] !== d[1] && d[3] !== d[4]) ||
        (d[3] === d[4] && d[3] !== d[2] && d[4] !== d[5]) ||
        (d[4] === d[5] && d[4] !== d[3])
    );
}

var valid1 = [];
var valid2 = [];
for (var i = 372304; i < 847060; i++) {
    var digits = i.toString().split('').map(Number);
    if (neverDecrease(digits) && twoAdjacent(digits)) {
        valid1.push(i);
        if (twoAdjacentNoGroup(digits)) valid2.push(i);
    }
}

console.log('Part 1:', valid1.length);
console.log('Part 1:', valid2.length);
