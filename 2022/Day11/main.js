import { getData, getPath, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n\n').map(parseMonkey);
}

function parseMonkey(monkeyString) {
    var grabMonkeyNumber = (monkeyRow) => BigInt(monkeyRow.match(/(\d+)/g)[0]);
    var monkeyRows = monkeyString.split('\n');
    var [val, operator, ..._] = monkeyRows[2].split(' ').reverse();
    return {
        id: grabMonkeyNumber(monkeyRows[0]),
        items: monkeyRows[1].match(/(\d{2})/g).map(BigInt),
        operation: {
            operator,
            value: val === 'old' ? null : BigInt(val),
        },
        testValue: grabMonkeyNumber(monkeyRows[3]),
        ifTrue: grabMonkeyNumber(monkeyRows[4]),
        ifFalse: grabMonkeyNumber(monkeyRows[5]),
        inspections: 0,
    };
}

function calculateMonkeyBusinessLevel(_monkeys, rounds, inspect) {
    var monkeys = structuredClone(_monkeys);
    var lcd = product(monkeys.map((m) => m.testValue));
    var test = (item, testValue) => item % testValue === 0n;
    var throwTo = (item, id) =>
        monkeys.find((m) => m.id === id).items.push(item);

    for (let i = 0; i < rounds; i++) {
        monkeys.forEach((monkey) => {
            monkey.items = monkey.items.map((i) => i % lcd);
            monkey.inspections += monkey.items.length;
            while (monkey.items.length > 0) {
                let inspectedItem = inspect(
                    monkey.items.shift(),
                    monkey.operation
                );
                test(inspectedItem, monkey.testValue)
                    ? throwTo(inspectedItem, monkey.ifTrue)
                    : throwTo(inspectedItem, monkey.ifFalse);
            }
        });
    }

    var [m1, m2, ..._] = monkeys.sort((a, b) => b.inspections - a.inspections);
    return m1.inspections * m2.inspections;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var worryFuncs = {
    '+': (item, value) => (value === null ? item + item : item + value),
    '*': (item, value) => (value === null ? item * item : item * value),
};
var p1Inspect = (item, { operator, value }) =>
    worryFuncs[operator](item, value) / 3n;
var p2Inspect = (item, { operator, value }) =>
    worryFuncs[operator](item, value);

console.log('Part 1:', calculateMonkeyBusinessLevel(data, 20, p1Inspect));
console.log('Part 2:', calculateMonkeyBusinessLevel(data, 10000, p2Inspect));
