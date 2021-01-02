const fs = require('fs');

// computes expressions without brackets, with left-to-right operator precedence.
const computeSimple = (exp) => {
    return exp.split(/\b /).reduce((acc, curr) =>
        curr[0] === '*'
            ? acc * curr.slice(2)
            : +acc + +curr.slice(2));
}

// computes expressions without brackets, evaluating addition before multiplication.
const computeAdvanced = (exp) => {
    const serachExpr = /(\d+) \+ (\d+)/g;
    while (exp.includes('+')) {
        exp = exp.replace(serachExpr, (match, p1, p2) => +p1 + +p2);
    }
    return +exp.split(/\b /).reduce((acc, curr) => acc * curr.slice(2));
}

const compute = (exp, computeFunction) => {
    if (!exp.includes('(')) return computeFunction(exp);
    const serachExpr = /\(([^\(\)]+)\)/g;
    return compute(exp.replace(serachExpr, (_, pExp) => computeFunction(pExp)), computeFunction);
}

fs.readFile('Day18/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');
    console.log('Part 1:', input.reduce((acc, curr) => acc + compute(curr, computeSimple), 0));
    console.log('Part 2:', input.reduce((acc, curr) => acc + compute(curr, computeAdvanced), 0));
});
