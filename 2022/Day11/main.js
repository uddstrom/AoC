import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var monkeys = new Map();
    input
        .split('\n\n')
        .map(parseMonkey)
        .forEach((monkey) => {
            monkeys.set(monkey.id, monkey);
        });
    return monkeys;
}

function parseMonkey(monkeyString) {
    var grabMonkeyNumber = (monkeyRow) => Number(monkeyRow.match(/(\d+)/g)[0]);
    var monkeyRows = monkeyString.split('\n');
    var opComponents = monkeyRows[2].trim().split(' ');
    return {
        id: grabMonkeyNumber(monkeyRows[0]),
        items: monkeyRows[1].match(/(\d{2})/g).map(Number),
        op: {
            operator: opComponents[4],
            value: Number(opComponents[5]),
        },
        testValue: grabMonkeyNumber(monkeyRows[3]),
        ifTrue: grabMonkeyNumber(monkeyRows[4]),
        ifFalse: grabMonkeyNumber(monkeyRows[5]),
        inspections: 0n
    };
}

function calculateMonkeyBusinessLevel(monkeys, rounds, inspectFn) {
    var test = (item, testValue) => item % testValue === 0;
    var throwToMonkey = (item, monkeyId) => monkeys.get(monkeyId).items.push(item);
    
    for (let i = 0; i < rounds; i++) {
        for (let [_, monkey] of monkeys) {
            while (monkey.items.length > 0) {
                monkey.inspections++;
                let inspectedItem = inspectFn(monkey.items.shift(), monkey.op);
                test(inspectedItem, monkey.testValue)
                    ? throwToMonkey(inspectedItem, monkey.ifTrue)
                    : throwToMonkey(inspectedItem, monkey.ifFalse);
            }
        }
    }
    
    var [m1, m2, ..._] = Array
                            .from(monkeys, ([_, value]) => value)
                            .sort((m1, m2) => {
                                if (m1.inspections > m2.inspections) return -1;
                                if (m1.inspections < m2.inspections) return 1;
                                return 0;
                            });

    return m1.inspections * m2.inspections;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var worryFuncs = {
    '+': (item, value) => Number.isNaN(value) ? item + item : item + value,
    '*': (item, value) => Number.isNaN(value) ? item * item : item * value,
};
var p1Inspect = (item, { operator, value }) => Math.floor(worryFuncs[operator](item, value) / 3);
var p2Inspect = (item, { operator, value }) => worryFuncs[operator](item, value);

console.log('Part 1:', calculateMonkeyBusinessLevel(data, 20, p1Inspect));
console.log('Part 2:', calculateMonkeyBusinessLevel(data, 10000, p2Inspect));
