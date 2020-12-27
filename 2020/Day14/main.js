const fs = require('fs');

const applyMaskV1 = (mask, val) => {
    const bits = Array.from(val.toString(2).padStart(36, '0'));
    const masked = bits.map((bit, idx) => mask.charAt(idx) === 'X' ? bit : mask.charAt(idx)).join('');
    return parseInt(masked, 2);
};

const applyMaskV2 = (mask, val) => {
    const bits = Array.from(val.toString(2).padStart(36, '0'));
    const masked = bits.map((bit, idx) => mask.charAt(idx) === 'X' ? 'X' : bit | mask.charAt(idx)).join('');
    return developFloating([masked]).map(bVal => parseInt(bVal, 2));
};

const developFloating = (val) => {
    if (val.join('').indexOf('X') === -1) return val;
    return val.map(v => developFloating([v.replace('X', '0'), v.replace('X', '1')])).flat(Infinity);
};

const ComputerV1 = (instr) => {
    const mem = new Map();
    let mask = '';
    const operations = {
        mask: (i) => mask = i.value,
        mem: (i) => mem.set(i.addr, applyMaskV1(mask, i.value)),
    }
    instr.forEach(i => operations[i.op](i));
    return Array.from(mem, ([_, val]) => val).reduce((acc, curr) => acc + curr, 0);
};

const ComputerV2 = (instr) => {
    const mem = new Map();
    let mask = '';
    const operations = {
        mask: (i) => mask = i.value,
        mem: (i) => applyMaskV2(mask, i.addr).forEach(address => mem.set(address, i.value)),
    }
    instr.forEach(i => operations[i.op](i));
    return Array.from(mem, ([_, val]) => val).reduce((acc, curr) => acc + curr, 0);
};

const parseProgram = (input) => {
    return input.map(line => line.startsWith('mask')
        ? { op: 'mask', value: line.substring(7) }
        : {
            op: line.substring(0, line.indexOf('[')),
            addr: Number(line.substring(line.indexOf('[') + 1, line.indexOf(']'))),
            value: Number(line.substring(line.indexOf('=') + 2)),
        });
};

fs.readFile('Day14/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');
    const instructions = parseProgram(input);

    console.log('Part 1:', ComputerV1(instructions));
    console.log('Part 2:', ComputerV2(instructions));
});
