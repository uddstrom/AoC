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
        this.state = state.IDLE;
        this.ip = 0;    // instruction pointer
        this.rbo = 0;   // relative base offset
    }

    process(input) {
        const mem = Array(1000).fill().map((v,i) => 0);
        const program = this.program.concat(mem);
        this.ip = 0;    // instruction pointer
        this.rbo = 0;   // relative base offset
        let last_in;
        do {
            const ip = this.ip;
            const i = new Instruction(program[ip]);
            this.state = state.PROCESSING;

            let in1, in2, output_address;
            
            const setInOutParams = () => {
                /*  param modes:
                    0: position mode
                    1: immediate mode
                    2: relative mode
                */
                const pos1 = i.PARAM_MODES[0] === 2 ? this.rbo + program[ip + 1] : program[ip + 1];
                const pos2 = i.PARAM_MODES[1] === 2 ? this.rbo + program[ip + 2] : program[ip + 2];
                in1 = i.PARAM_MODES[0] === 1 ? program[ip + 1] : program[pos1];
                in2 = i.PARAM_MODES[1] === 1 ? program[ip + 2] : program[pos2];
                output_address = i.PARAM_MODES[2] === 1 ? ip + 3 : i.PARAM_MODES[2] === 0 ? program[ip + 3] : this.rbo + program[ip + 3];
            }
            
            switch (i.OPCODE)
            {
                case 1:
                    setInOutParams();
                    program[output_address] = in1 + in2;
                    this.ip = ip + 4;
                    break;
                case 2:
                    setInOutParams();
                    program[output_address] = in1 * in2;
                    this.ip = ip + 4;
                    break;
                case 3:
                    if (input.length > 0) {
                        setInOutParams();
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
                    setInOutParams();
                    //program[0] = in1;
                    console.log(`Output from ${this.comupterName}: `, in1);
                    this.ip = ip + 2;
                    break;
                    // this.state = state.PAUSED;
                    // return program[0];
                case 5:
                    setInOutParams();
                    this.ip = in1 != 0 ? in2 : ip + 3;
                    break;
                case 6:
                    setInOutParams();
                    this.ip = in1 == 0 ? in2 : ip + 3;
                    break;
                case 7:
                    setInOutParams();
                    program[output_address] = in1 < in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 8:
                    setInOutParams();
                    program[output_address] = in1 == in2 ? 1 : 0;
                    this.ip = ip + 4;
                    break;
                case 9:
                    // Adjust the relative base offset
                    setInOutParams();
                    this.rbo += in1;
                    this.ip = ip + 2;
                    break;
                case 99:
                    this.state = state.TERMINATED;
                    return program[0];
                default:
                    throw new Error('Unknown opCode: ', i.OPCODE);
            }
        } while (this.state === state.PROCESSING);


        return program[0];
    }
}

module.exports = { IntcodeComputer, state };
