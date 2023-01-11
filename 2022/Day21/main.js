import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var monkeyMap = new Map();
    input.split('\n')
        .forEach(line => {
            let words = line.split(' ');
            if (words.length === 2) {
                // number-yelling monkey
                monkeyMap.set(words[0].replace(':', ''), [Number(words[1])]);
            } else {
                // math operation monkey
                // cczh: sllz + lgvd
                monkeyMap.set(words[0].replace(':', ''), [words[1], words[2], words[3]]);
            }
        });
    return monkeyMap;
}

var OPS = {
    '+': (m1, m2) => m1 + m2,
    '-': (m1, m2) => m1 - m2,
    '*': (m1, m2) => m1 * m2,
    '/': (m1, m2) => m1 / m2,
};

function monkeyMath(monkey, monkeys) {
    // number-yelling monkey, yell number!
    if (monkey.length === 1) return monkey[0];

    var [m1, op, m2] = monkey;
    
    return OPS[op](
        monkeyMath(monkeys.get(m1), monkeys),
        monkeyMath(monkeys.get(m2), monkeys)
    );
}

function findMonkeyNumber(root, monkeys) {

    var [m1, _, m2] = root;

    var n1 = monkeyMath2(monkeys.get(m1), monkeys);
    var n2 = monkeyMath2(monkeys.get(m2), monkeys);

    console.log(n1, n2);

    function monkeyMath2(monkey, monkeys, answer) {
        if (monkey.length === 1) return monkey[0];

        var InvOPS = {
            '+': (m, ans) => ans - m,
            '-': (m, ans) => ans + m,
            '*': (m, ans) => ans / m,
            '/': (m, ans) => ans * m,
        };

        var [m1, op, m2] = monkey;
        if (m1 === 'humn') {
            let m = monkeyMath2(monkeys.get(m2), monkeys);
            let humn = InvOPS[op](m, answer);
            console.log('you should yell', humn);
            return undefined;
        }
        
        if (m2 === 'humn') {
            // Se upp med minus och division!
            let m = monkeyMath2(monkeys.get(m2), monkeys);
            let humn = InvOPS[op](m, answer);
            console.log('you should yell', humn);
            return undefined;
        }

        return OPS[op](
            monkeyMath2(monkeys.get(m1), monkeys),
            monkeyMath2(monkeys.get(m2), monkeys)
        );
    }
}

var monkeys = getData(PUZZLE_INPUT_PATH)(parser);

var root = monkeys.get('root');
console.log('Part 1:', monkeyMath(root, monkeys));

//findMonkeyNumber(root, monkeys);
//console.log('Part 2:', );
