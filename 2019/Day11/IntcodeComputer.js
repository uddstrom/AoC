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

class IntcodeComputer {
    constructor(program) {
        //const mem = Array(1000).fill().map((v,i) => 0);
        this.program = program; //.map(str => parseInt(str)); //.concat(mem);
        this.ip = 0; // instruction pointer
        this.rb = 0; // relative base
    }

    process(input) {
        const program = this.program;

        while (true) {
            const ip = this.ip;
            const i = new Instruction(program[ip]);

            let in1, in2, output_address;

            const setInOutParams = () => {
                /*  param modes:
                    0: position mode
                    1: immediate mode
                    2: relative mode
                */
                const pos1 =
                    i.PARAM_MODES[0] === 2
                        ? this.rb + program[ip + 1]
                        : program[ip + 1];
                const pos2 =
                    i.PARAM_MODES[1] === 2
                        ? this.rb + program[ip + 2]
                        : program[ip + 2];
                in1 = i.PARAM_MODES[0] === 1 ? program[ip + 1] : program[pos1];
                in2 = i.PARAM_MODES[1] === 1 ? program[ip + 2] : program[pos2];
                output_address = (i.PARAM_MODES[2] === 2 ? this.rb : 0) + program[ip + 3];
            };
            setInOutParams();

            switch (i.OPCODE) {
                case 1:
                    program[output_address] = in1 + in2;
                    this.ip = ip + 4;
                    break;
                case 2:
                    program[output_address] = in1 * in2;
                    this.ip = ip + 4;
                    break;
                case 3:
                    output_address = (i.PARAM_MODES[2] === 2 ? this.rb : 0) + program[ip + 1];
                    program[output_address] = input;
                    this.ip = ip + 2;
                    break;
                case 4:
                    this.ip = ip + 2;
                    return in1;
                case 5:
                    this.ip = in1 !== 0 ? in2 : ip + 3;
                    break;
                case 6:
                    this.ip = in1 === 0 ? in2 : ip + 3;
                    break;
                case 7:
                    program[output_address] = in1 < in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 8:
                    program[output_address] = in1 == in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 9:
                    this.rb += in1;
                    this.ip = ip + 2;
                    break;
                case 99:
                    return;
                default:
                    throw new Error('Unknown opCode: ', i.OPCODE);
            }
        }
    }
}

//module.exports = { IntcodeComputer };
export default IntcodeComputer;
