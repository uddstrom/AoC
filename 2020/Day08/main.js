const fs = require('fs');

function Instruction(instruction) {
    return {
        operation: instruction.split(' ')[0],
        argument: Number(instruction.split(' ')[1]),
    };
}

function* Computer(instructions) {
    let program = [...instructions];
    let ip = 0;
    let accumulator = 0;
    let visited = [];
    let lastFlipped = -1;

    const nopOrJump = (instr) => instr.startsWith('nop') || instr.startsWith('jmp');

    const resetAndUpdate = () => {
        ip = 0;
        accumulator = 0;
        visited = [];
        lastFlipped += instructions.slice(lastFlipped + 1).findIndex(nopOrJump) + 1;
        program = instructions.map((i, idx) => (idx === lastFlipped ? flipOp(i) : i));
    };

    const flipOp = (instr) => {
        return instr.startsWith('nop') ? instr.replace('nop', 'jmp') : instr.replace('jmp', 'nop');
    };

    const operations = {
        acc: (arg) => {
            accumulator += arg;
            ip++;
        },
        jmp: (arg) => {
            ip += arg;
        },
        nop: () => {
            ip++;
        },
    };

    while (ip < program.length) {
        if (visited.includes(ip)) {
            yield accumulator;
            resetAndUpdate();
        } else {
            visited.push(ip);
        }

        const i = Instruction(program[ip]);
        operations[i.operation](i.argument);
    }

    return accumulator;
}

fs.readFile('Day08/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\r\n');

    const computer = Computer(puzzle_input);
    let output = computer.next();

    console.log('Part 1:', output.value);

    do {
        output = computer.next();
    } while (!output.done);

    console.log('Part 2:', output.value);
});
