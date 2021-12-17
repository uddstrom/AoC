import { getData, getPath, rng, sum, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var _versions = [];
var parser = (input) => input.split('').map(hexToBin).join('');
var hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, '0');
var b2i = (bStr) => parseInt(bStr, 2);

function* streamReader(stream) {
    let bitsToRead = 0;
    let acc = 0;
    while (acc < stream.length) {
        bitsToRead = yield stream.substring(acc - bitsToRead, acc);
        acc += bitsToRead;
    }
    return stream.substring(acc - bitsToRead, stream.length);
}

function literal(reader, bitCnt, ignoreExtraBits) {
    // literal packet, read values
    let values = [];
    let last = false;
    while (!last) {
        last = reader.next(1).value === '0';
        values.push(reader.next(4).value);
        bitCnt += 5;
    }
    let xtraBits = ignoreExtraBits ? 4 - (bitCnt % 4) : 0;
    reader.next(xtraBits);
    return b2i(values.join(''));
}

function getSubPackets(reader, bitCnt, readXtra) {
    let lengthTypeId = reader.next(1).value;
    bitCnt++;
    let subPacks = [];
    if (lengthTypeId === '0') {
        // the next 15 bits are a number that represents the total
        // length in bits of the sub-packets contained by this packet
        let subPacketsTotalLength = b2i(reader.next(15).value);
        let subPacketsBits = reader.next(subPacketsTotalLength).value;
        let subReader = streamReader(subPacketsBits);
        subReader.next();
        bitCnt += 15 + subPacketsTotalLength;
        while (!subReader.next(0).done) {
            subPacks.push(readPacket(subReader, false));
        }
    }
    if (lengthTypeId === '1') {
        // the next 11 bits are a number that represents the number
        // of sub-packets immediately contained by this packet
        let noSubPacks = b2i(reader.next(11).value);
        subPacks = rng(noSubPacks).map(() => readPacket(reader, false));
        bitCnt += 11;
    }
    let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
    reader.next(xtraBits);
    return subPacks;
}

function readPacket(reader, readXtra = true) {
    _versions.push(reader.next(3).value);
    let type = b2i(reader.next(3).value);
    let bitCnt = 6;

    // literal packet?
    if (type === 4) return literal(reader, bitCnt, readXtra);

    // operator packet
    let subPacks = getSubPackets(reader, bitCnt, readXtra);
    let [s1, s2] = subPacks;
    if (type === 0) return sum(subPacks);
    if (type === 1) return product(subPacks);
    if (type === 2) return Math.min(...subPacks);
    if (type === 3) return Math.max(...subPacks);
    if (type === 5) return s1 > s2 ? 1 : 0;
    if (type === 6) return s1 < s2 ? 1 : 0;
    if (type === 7) return s1 === s2 ? 1 : 0;
}

function main() {
    let data = getData(PUZZLE_INPUT_PATH)(parser);
    let reader = streamReader(data);
    reader.next();

    let value = readPacket(reader);
    console.log('Part 1:', sum(_versions.map(b2i)));
    console.log('Part 2:', value);
}

main();
