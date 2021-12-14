import { numberConverter } from './main.js';

export function decodeWithDeduction({ signals, output }) {
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
