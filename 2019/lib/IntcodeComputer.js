class Instruction {
    constructor(instruction) {
        const digits = Array.from(instruction.toString().padStart(5, '0')).map(
            Number
        );
        this.PARAM_MODES = new Array(3);
        this.PARAM_MODES[0] = digits[2];
        this.PARAM_MODES[1] = digits[1];
        this.PARAM_MODES[2] = digits[0];
        this.OPCODE = parseInt(`${digits[3]}${digits[4]}`);
    }
}

function* IntcodeComputer(code, stack = []) {
    const program = [...code];
    const _stack = [...stack];
    let ip = 0;
    let rb = 0;

    function* getInstructions() {
        while (ip < program.length) {
            yield new Instruction(program[ip]);
        }
    }

    function execute({ OPCODE, PARAM_MODES }) {
        /*  param modes:
            0: position mode
            1: immediate mode
            2: relative mode
        */
        const pos1 =
            PARAM_MODES[0] === 2 ? rb + program[ip + 1] : program[ip + 1];
        const pos2 =
            PARAM_MODES[1] === 2 ? rb + program[ip + 2] : program[ip + 2];
        let in1 = PARAM_MODES[0] === 1 ? program[ip + 1] : program[pos1];
        let in2 = PARAM_MODES[1] === 1 ? program[ip + 2] : program[pos2];
        const output_address =
            (PARAM_MODES[2] === 2 ? rb : 0) + Number(program[ip + 3]);

        if (typeof in1 !== 'number') {
            in1 = 0;
        }
        if (typeof in2 !== 'number') {
            in2 = 0;
        }

        switch (OPCODE) {
            case 1:
                // Add
                program[output_address] = in1 + in2;
                ip += 4;
                break;
            case 2:
                // Multiply
                program[output_address] = in1 * in2;
                ip += 4;
                break;
            case 3:
                // Input
                const inputVal = _stack.shift();
                const out_address =
                    (PARAM_MODES[0] === 2 ? rb : 0) + program[ip + 1];
                program[out_address] = Number(inputVal);
                ip += 2;
                break;
            case 4:
                // Output
                ip += 2;
                return in1;
            case 5:
                // Jump-if-true
                ip = Number(in1 !== 0 ? in2 : ip + 3);
                break;
            case 6:
                // Jump-if-false
                ip = Number(in1 === 0 ? in2 : ip + 3);
                break;
            case 7:
                // Less than
                program[output_address] = in1 < in2 ? 1 : 0;
                ip += 4;
                break;
            case 8:
                // Equals
                program[output_address] = in1 === in2 ? 1 : 0;
                ip += 4;
                break;
            case 9:
                // Adjust relative base
                rb += Number(in1);
                ip += 2;
                break;
            default:
                throw new Error('Unknown opCode: ', i.OPCODE);
        }
    }

    for (const i of getInstructions()) {
        if (i.OPCODE === 99) return;
        const output = execute(i);
        if (output !== undefined) {
            const input = yield output;
            if (typeof input === 'number') _stack.push(input);
        }
    }
}

export default IntcodeComputer;
