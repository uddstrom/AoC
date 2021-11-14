class Instruction
{
    constructor(instruction) {
        const digits = Array.from(instruction.toString().padStart(5, '0')).map(Number);
        this.PARAM_MODES = new Array(3);
        this.PARAM_MODES[0] = digits[2];
        this.PARAM_MODES[1] = digits[1];
        this.PARAM_MODES[2] = digits[0];
        this.OPCODE = parseInt(`${digits[3]}${digits[4]}`);
    }
}

const state = {
    IDLE: 'idle',
    PROCESSING: 'processing',
    PAUSED: 'paused',
    WAITING: 'waiting',
    TERMINATED: 'terminated'
}

class IntcodeComputer {
    constructor(program, comupterName) {
        this.program = program.map(str => parseInt(str));
        this.comupterName = comupterName;
        this.state = state.IDLE; // instruction pointer
        this.ip = 0;
    }

    process(input) {
        const program = this.program;
        let last_in;
        do {
            const ip = this.ip;
            const i = new Instruction(program[ip]);
            this.state = state.PROCESSING;

            let in1, in2, output_address;

            switch (i.OPCODE)
            {
                case 1:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    output_address = i.PARAM_MODES[2] == 1 ? ip + 3: program[ip + 3];
                    program[output_address] = in1 + in2;
                    this.ip = ip + 4;
                    break;
                case 2:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    output_address = i.PARAM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                    program[output_address] = in1 * in2;
                    this.ip = ip + 4;
                    break;
                case 3:
                    if (input.length > 0) {
                        output_address = program[ip + 1];
                        last_in = input.shift();
                        console.log(`${this.comupterName} processing input`, last_in);
                        program[output_address] = last_in;
                        this.ip = ip + 2;
                    } else {
                        this.state = state.HALT_WAITING;
                        console.log(`${this.comupterName} WAITING`);
                    }
                    break;
                case 4:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    program[0] = in1;
                    console.log(`Output from ${this.comupterName}: `, program[0]);
                    this.ip = ip + 2;
                    this.state = state.PAUSED;
                    return program[0];
                case 5:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    this.ip = in1 != 0 ? in2 : ip + 3;
                    break;
                case 6:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    this.ip = in1 == 0 ? in2 : ip + 3;
                    break;
                case 7:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    output_address = i.PARAM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                    program[output_address] = in1 < in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 8:
                    in1 = i.PARAM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                    in2 = i.PARAM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                    output_address = i.PARAM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                    program[output_address] = in1 == in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 99:
                    this.state = state.TERMINATED;
                    return program[0];
                default:
                    throw new Error('Unknown opCode: ', i.OPCODE);
            }
        } while (this.state === state.PROCESSING && this.ip < program.length);


        return program[0];
    }
}

module.exports = { IntcodeComputer, state };
