import { getData, getPath, range, sum, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    return input.split('').map(hexToBin).join('');
}

let hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, '0');

function* streamReader(stream) {
    let bitsToRead = 0;
    let acc = 0;
    while (true) {
        if (acc >= stream.length)
            return stream.substring(acc - bitsToRead, stream.length);
        bitsToRead = yield stream.substring(acc - bitsToRead, acc);
        acc += bitsToRead;
    }
}

let versions = [];
let b2i = (bStr) => parseInt(bStr, 2);

function readPacket(reader, readXtra = true) {
    let version = reader.next(3).value;
    versions.push(version);
    let type = b2i(reader.next(3).value);
    let bitCnt = 6;
    if (type === 4) {
        // literal packet, read values
        let values = [];
        let last = false;
        while (!last) {
            last = reader.next(1).value === '0';
            values.push(reader.next(4).value);
            bitCnt += 5;
        }
        let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
        let { value, done } = reader.next(xtraBits);
        return [b2i(values.join('')), done];
    } else {
        // operator packet,
        let [subPacks, done] = getSubPacks(reader, bitCnt, readXtra);
        let [s1, s2] = subPacks;
        switch (type) {
            case 0: // sum
                return [sum(subPacks), done];
            case 1: // product
                return [product(subPacks), done];
            case 2: // min
                return [Math.min(...subPacks), done];
            case 3: // max
                return [Math.max(...subPacks), done];
            case 5: // gtn
                return s1 > s2 ? [1, done] : [0, done];
            case 6: // ltn
                return s1 < s2 ? [1, done] : [0, done];
            case 7: // eq
                return s1 === s2 ? [1] : [0];
        }
    }
}

function getSubPacks(reader, bitCnt, readXtra) {
    let lengthTypeId = reader.next(1).value;
    bitCnt++;
    if (lengthTypeId === '0') {
        // the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet
        let subPacketsTotalLength = b2i(reader.next(15).value);
        bitCnt += 15;

        let subPacketsBits = reader.next(subPacketsTotalLength).value;
        bitCnt += subPacketsTotalLength;

        let subReader = streamReader(subPacketsBits);
        subReader.next();
        let subPacks = [];
        let more = true;
        while (more) {
            let [subPack, done] = readPacket(subReader, false);
            subPacks.push(subPack);
            more = !done;
        }

        let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
        let { value, done } = reader.next(xtraBits);
        return [subPacks, done];
    }
    if (lengthTypeId === '1') {
        // the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet
        let numberOfSubPackets = b2i(reader.next(11).value);
        bitCnt += 11;

        let subPacks = range(0, numberOfSubPackets - 1)
            .map((_) => readPacket(reader, false))
            .map(([subPack, done]) => subPack);

        let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
        let { value, done } = reader.next(xtraBits);
        return [subPacks, done];
    }
}

function main() {
    let data = getData(PUZZLE_INPUT_PATH)(parser);
    let reader = streamReader(data);
    reader.next();

    let [pack, done] = readPacket(reader);

    console.log('Part 1:', sum(versions.map(b2i)));
    console.log('Part 2:', pack);
}

main();
