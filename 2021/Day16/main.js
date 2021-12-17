import { getData, getPath, range, sum, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
function parser(input) {
    return input.split('').map(hexToBin).join('');
}

let hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, '0');
let b2i = (bStr) => parseInt(bStr, 2);

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

function literal(reader, bitCnt, readXtra) {
    // literal packet, read values
    let values = [];
    let last = false;
    while (!last) {
        last = reader.next(1).value === '0';
        values.push(reader.next(4).value);
        bitCnt += 5;
    }
    let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
    let { done } = reader.next(xtraBits);
    return [b2i(values.join('')), done];
}

function getSubPacks(reader, bitCnt, readXtra) {
    let lengthTypeId = reader.next(1).value;
    bitCnt++;
    let subPacks = [];
    if (lengthTypeId === '0') {
        // the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet
        let subPacketsTotalLength = b2i(reader.next(15).value);
        bitCnt += 15;

        let subPacketsBits = reader.next(subPacketsTotalLength).value;
        bitCnt += subPacketsTotalLength;

        let subReader = streamReader(subPacketsBits);
        subReader.next();
        let more = true;
        while (more) {
            let [subPack, done] = readPacket(subReader, false);
            subPacks.push(subPack);
            more = !subReader.next(0).done;
        }
    }
    if (lengthTypeId === '1') {
        // the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet
        let numberOfSubPackets = b2i(reader.next(11).value);
        bitCnt += 11;

        subPacks = range(0, numberOfSubPackets - 1)
            .map((_) => readPacket(reader, false))
            .map(([subPack, done]) => subPack);
    }
    let xtraBits = readXtra ? 4 - (bitCnt % 4) : 0;
    let { done } = reader.next(xtraBits);
    return [subPacks, done];
}

function readPacket(reader, readXtra = true) {
    versions.push(reader.next(3).value);
    let type = b2i(reader.next(3).value);
    let bitCnt = 6;

    // literal packet?
    if (type === 4) return literal(reader, bitCnt, readXtra);

    // operator packet
    let [subPacks, done] = getSubPacks(reader, bitCnt, readXtra);
    let [s1, s2] = subPacks;
    if (type === 0) return [sum(subPacks), done];
    if (type === 1) return [product(subPacks), done];
    if (type === 2) return [Math.min(...subPacks), done];
    if (type === 3) return [Math.max(...subPacks), done];
    if (type === 5) return s1 > s2 ? [1, done] : [0, done];
    if (type === 6) return s1 < s2 ? [1, done] : [0, done];
    if (type === 7) return s1 === s2 ? [1, done] : [0, done];
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
