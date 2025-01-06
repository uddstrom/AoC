import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv['2'] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(line => line.split(''));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var one = new Map([['1', ['']], ['2', ['>']], ['3', ['>>']], ['4', ['^']], ['5', ['^>', '>^']], ['6', ['^>>', '>^>', '>>^']], ['7', ['^^']], ['8', ['^^>', '>^^']], ['9', ['^^>>', '>>^^']], ['0', ['>v']], ['A', ['>>v']]]);
var two = new Map([['1', ['<']], ['2', ['']], ['3', ['>']], ['4', ['<^', '^<']], ['5', ['^']], ['6', ['^>', '>^']], ['7', ['<^^', '^^<']], ['8', ['^^']], ['9', ['^^>', '>^^']], ['0', ['v']], ['A', ['>v', 'v>']]]);
var three = new Map([['1', ['<<']], ['2', ['<']], ['3', ['']], ['4', ['<<^', '^<<']], ['5', ['<^', '^<']], ['6', ['^']], ['7', ['<<^^', '^^<<']], ['8', ['<^^', '^^<']], ['9', ['^^']], ['0', ['<v', 'v<']], ['A', ['v']]]);
var four = new Map([['1', ['v']], ['2', ['v>', '>v']], ['3', ['v>>', '>>v']], ['4', ['']], ['5', ['>']], ['6', ['>>']], ['7', ['^']], ['8', ['^>', '>^']], ['9', ['^>>', '>>^']], ['0', ['>vv', 'vv>']], ['A', ['>>vv', 'vv>>']]]);
var five = new Map([['1', ['<v', 'v<']], ['2', ['v']], ['3', ['v>', '>v']], ['4', ['<']], ['5', ['']], ['6', ['>']], ['7', ['<^', '^<']], ['8', ['^']], ['9', ['^>', '>^']], ['0', ['vv']], ['A', ['>vv', 'vv>']]]);
var six = new Map([['1', ['<<v', 'v<<']], ['2', ['<v', 'v<']], ['3', ['v']], ['4', ['<<']], ['5', ['<']], ['6', ['']], ['7', ['<<^', '^<<']], ['8', ['<^']], ['9', ['^']], ['0', ['<vv', 'vv<']], ['A', ['vv']]]);
var seven = new Map([['1', ['vv']], ['2', ['vv>', '>vv']], ['3', ['vv>>', '>>vv']], ['4', ['v']], ['5', ['v>', '>v']], ['6', ['v>>', '>>v']], ['7', ['']], ['8', ['^>', '>^']], ['9', ['>>']], ['0', ['>vvv', 'vvv>']], ['A', ['>>vvv']]]);
var eight = new Map([['1', ['<vv', 'vv<']], ['2', ['vv']], ['3', ['vv>', '>vv']], ['4', ['<v', 'v<']], ['5', ['v']], ['6', ['v>', '>v']], ['7', ['<']], ['8', ['']], ['9', ['>']], ['0', ['vvv']], ['A', ['>vvv', 'vvv>']]]);
var nine = new Map([['1', ['<<vv', 'vv<<']], ['2', ['<vv', 'vv<']], ['3', ['vv']], ['4', ['<<v', 'v<<']], ['5', ['<v', 'v<']], ['6', ['v']], ['7', ['<<']], ['8', ['<']], ['9', ['']], ['0', ['<vvv', 'vvv<']], ['A', ['vvv']]]);
var zero = new Map([['1', ['^<']], ['2', ['^']], ['3', ['^>', '>^']], ['4', ['^^<']], ['5', ['^^']], ['6', ['^^>', '>^^']], ['7', ['^^^<']], ['8', ['^^^']], ['9', ['^^^>', '>^^^']], ['0', ['']], ['A', ['>']]]);
var A = new Map([['1', ['^<<']], ['2', ['<^', '^<']], ['3', ['^']], ['4', ['^^<<']], ['5', ['<^^', '^^<']], ['6', ['^^']], ['7', ['^^^<<']], ['8', ['<^^^', '^^^<']], ['9', ['^^^']], ['0', ['<']], ['A', ['']]]);
var numPadMap = new Map([['1', one], ['2', two], ['3', three], ['4', four], ['5', five], ['6', six], ['7', seven], ['8', eight], ['9', nine], ['0', zero], ['A', A],]);

var left = new Map([['<', ['']], ['>', ['>>']], ['^', ['>^']], ['v', ['>']], ['A', ['>>^']]]);
var right = new Map([['<', ['<<']], ['>', ['']], ['^', ['<^', '^<']], ['v', ['<']], ['A', ['^']]]);
var up = new Map([['<', ['v<']], ['>', ['v>', '>v']], ['^', ['']], ['v', ['v']], ['A', ['>']]]);
var down = new Map([['<', ['<']], ['>', ['>']], ['^', ['^']], ['v', ['']], ['A', ['>^', '^>']]]);
var a = new Map([['<', ['v<<']], ['>', ['v']], ['^', ['<']], ['v', ['<v', 'v<']], ['A', ['']]]);
var dirPadMap = new Map([['<', left], ['>', right], ['^', up], ['v', down], ['A', a]]);

var byLength = (str1, str2) => str1.length - str2.length;

var DP = new Map();

function getSubSequence(seq, depth = 0) {
    if (DP.has(`${depth},${seq}`)) return DP.get(`${depth},${seq}`);
    if (depth === 26) return seq.join('');
    var map = depth === 0 ? numPadMap : dirPadMap;
    var from = 'A';
    var sub = seq.flatMap(to => {
        var paths = map.get(from).get(to);
        var S = paths.map(seq => getSubSequence([...seq.split(''), 'A'], depth + 1));
        from = to;
        return S.sort(byLength)[0];
    });

    console.log(sub);
    DP.set(`${depth},${seq}`, sub.join(''));
    return sub.join('');
}

function complexity(code, seq) {
    var c = Number(code.join('').substring(0, 3)) * seq.length;
    return c;
}

var p1 = sum(data.map(code => complexity(code, getSubSequence(code))));

console.log('Part 1:', p1);
console.log('Part 2:');

