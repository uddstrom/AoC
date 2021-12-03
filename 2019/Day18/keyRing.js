import { pow } from '../lib/utils.js';

const pow2 = pow(2);

const KEY_MAP = new Map();
'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .forEach((chr, idx) => KEY_MAP.set(chr, pow2(idx)));

export const KeyRing = {
    has: (iKeys, cKey) => (iKeys & KEY_MAP.get(cKey)) > 0,
    add: (iKeys, cKey) => iKeys | KEY_MAP.get(cKey),
    empty: () => 0,
    print: (iKeys) => 
        'abcdefghijklmnopqrstuvwxyz'
            .split('')
            .filter((chr) => KeyRing.has(iKeys, chr)),
};
