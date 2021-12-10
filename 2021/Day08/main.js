import { generatePermutations, getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input
        .split('\n')
        .map((line) => line.split(' | '))
        .map((line) => ({
            signals: line[0].split(' '),
            output: line[1].split(' '),
        }));
}

let _wireConfigurations = generatePermutations(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
let _segmentsMap = new Map([
    ['012456', 0],
    ['25', 1], //       0000
    ['02346', 2], //   1    2
    ['02356', 3], //   1    2
    ['1235', 4], //     3333
    ['01356', 5], //   4    5
    ['013456', 6], //  4    5
    ['025', 7], //      6666
    ['0123456', 8],
    ['012356', 9],
]);

function numberConverter(config) {
    // the config param represents the signal wires to segments configuration
    // config: eg 'deafgbc'
    return function (signal) {
        // signal: eg 'cdfbe'
        // cdfbe = [60351] => sort => [01356] = 5
        let segmentCombination = signal
            .split('')
            .map((chr) => config.indexOf(chr))
            .sort()
            .join('');
        return _segmentsMap.get(segmentCombination);
    };
}

function decode({ signals, output }) {
    let isValid = (n) => n !== undefined;
    for (let config of _wireConfigurations) {
        let toNumber = numberConverter(config);
        let signalValues = signals.map(toNumber);
        if (signalValues.every(isValid)) {
            return Number(output.map(toNumber).join(''));
        }
    }
}

function decodeWithDeduction({ signals, output }) {
    // returns the signals that contains n letters.
    let get = (n) => signals.filter((s) => s.length === n);
    // returns the letters in signalA that is missing in signalB
    let diff = (signalA, signalB) => {
        let diff = [];
        signalA.split('').forEach((chr) => {
            if (!signalB.includes(chr)) diff.push(chr);
        });
        return diff.join('');
    };

    /* 
    Exempel: cgaed gcdbfa gcfaed gfcde gadfceb cdbfeg acg eacf eabgd ca | agc efcgbd cag eacf
   
    #n  - mängden signaler med n segment.
    [n] - syftar på segment n.
    (n) - syftar på siffran n.

    #2 (1)
    -------
    ca
    2.1 => [5] :: #2 och 6.2 ger [5].

    #3 (7)
    -------
    acg
    3.1 => [0] :: Differensen (7)\(1) ger [0].
    
    #4 (4)
    -------
    eacf
    4.1 Differesen (4)\(1) ger [1,3].
    4.2 => [1] :: 4.1 och 6.1 ger [1].
    
    #5 (2, 3, 5)
    -------------
    cgaed
    gfcde
    eabgd

    #6 (0, 6, 9)
    -------------
    gcdbfa
    gcfaed
    cdbfeg
    6.1 => [3] :: Den signal i #6 som inte har både [1,3], ges av 4.1, är (0). Det segment som saknas i (0) är [3].
    6.2 => [2] :: Ta bort (0) från #6 och kombinera med (1). Det segment i (1) som saknas är [2].
                  Den som har båda segmenten i #2 är (9).
                  Den som inte har båda segmenten i #2 är (6).
    6.3 => [4] :: Differensen (8)\(9) är [4].
    
    # 7 (8)
    -------
    gadfceb
    7.1 => [6] :: Differensen N[8]\alla andra lösta segment ger [6].
    
    Deduktionsordning:
    3.1, 6.1, 4.2, 6.2, 6.3, 2.1, 7.1
    [0], [3], [1], [2], [4], [5], [6]
    
    */

    let config = new Array(7);
    let N = new Array(7);
    N[1] = get(2)[0];
    N[4] = get(4)[0];
    N[7] = get(3)[0];
    N[8] = get(7)[0];

    config[0] = diff(N[7], N[1]); // 3.1
    let segment13 = diff(N[4], N[1]); // 4.1

    N[0] = get(6).filter((signal) => diff(segment13, signal).length === 1)[0];
    config[3] = diff(N[8], N[0]); // 6.1
    config[1] = diff(segment13, config[3]); // 4.2

    N[6] = get(6)
        .filter((signal) => signal !== N[0])
        .filter((signal) => diff(N[1], signal).length === 1)[0];
    N[9] = get(6)
        .filter((signal) => signal !== N[0])
        .filter((signal) => diff(N[1], signal).length === 0)[0];

    config[2] = diff(N[1], N[6]); // 6.2
    config[4] = diff(N[8], N[9]); // 6.3
    config[5] = diff(get(2)[0], config[2]); // 2.1
    config[6] = diff(N[8], config.join('')); // 7.1

    let toNumber = numberConverter(config);
    return Number(output.map(toNumber).join(''));
}

function main() {
    let entries = getData(PUZZLE_INPUT_PATH)(parser);

    let numberToCount = (str) => [2, 3, 4, 7].includes(str.length);
    let countNumbers = ({ output }) => output.filter(numberToCount).length;

    console.log('Part 1:', sum(entries.map(countNumbers)));
    let start = Date.now();
    console.log(`Part 2: ${sum(entries.map(decode))} (using brute force in ${Date.now() - start} ms)`);
    start = Date.now();
    console.log(`Part 2: ${sum(entries.map(decodeWithDeduction))} (using deduction in ${Date.now() - start} ms)`);
}

main();
