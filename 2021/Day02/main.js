import { getData, getPath } from '../lib/utils.js';

const PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

var parser = (input) => {
    return input
        .split('\n')
        .map((command) => command.split(' '))
        .map(([dir, val]) => [dir, Number(val)]);
};

function part1(commands) {
    var endPos = commands.reduce(({ h, v }, [dir, val]) => {
        if (dir === 'forward') return { h: h + val, v };
        if (dir === 'up') return { h, v: v - val };
        if (dir === 'down') return { h, v: v + val };
    }, { h:0, v:0 });
    return endPos.h * endPos.v;
}

function part2(commands) {
    var endPos = commands.reduce(({ h, v, aim }, [dir, val]) => {
        if (dir === 'forward') return { h: h + val, v: v + val * aim, aim };
        if (dir === 'up') return { h, v, aim: aim - val };
        if (dir === 'down') return { h, v, aim: aim + val };
    }, { h:0, v:0, aim: 0 });
    return endPos.h * endPos.v;
}

const main = async () => {
    var commands = getData(PUZZLE_INPUT_PATH)(parser);
    console.log('Part 1:', part1(commands));
    console.log('Part 2:', part2(commands));
};

main();
