import {
    generatePermutations,
    getData,
    getPath,
    intersect,
    matrix,
    rng,
} from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    let scanners = [];
    let beacons = [];

    input.split('\n').forEach((line) => {
        if (line === '') {
            // end of scanner report
            scanners.push(beacons);
        } else if (line.startsWith('---')) {
            // new scanner
            beacons = [];
        } else {
            // add beacon
            beacons.push(line.split(',').map(Number));
        }
    });
    scanners.push(beacons);

    return scanners;
};

function generateRotations(pos) {
    let dirs = [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
    ];
    let perms = generatePermutations(pos);
    return [...perms]
        .map((p) => p.split(',').map(Number))
        .flatMap(([cx, cy, cz]) =>
            dirs.map(([dx, dy, dz]) => [cx * dx, cy * dy, cz * dz])
        );
}

function getOrientations(scanner) {
    let orientations = matrix(48, 0, []);
    scanner.forEach((b) => {
        let rotations = generateRotations(b);
        rotations.forEach((val, idx) => orientations[idx].push(val));
    });
    return orientations;
}

function findCommon(S1, S2) {
    for (let b1 of S1) {
        for (let b2 of S2) {
            let dx = b1[0] - b2[0];
            let dy = b1[1] - b2[1];
            let dz = b1[2] - b2[2];

            let commonCounter = 0;
            for (let [x1, y1, z1] of S1) {
                for (let [x2, y2, z2] of S2) {
                    if (x1 === x2 + dx && y1 === y2 + dy && z1 === z2 + dz) {
                        commonCounter++;
                        if (commonCounter >= 12) return [dx, dy, dz];
                    }
                }
            }
        }
    }
}

function addOrientedBeacons(scanner, oriented, dx = 0, dy = 0, dz = 0) {
    let S = structuredClone(oriented);
    scanner.forEach(([x, y, z]) => S.add(`${x + dx}, ${y + dy}, ${z + dz}`));
    return S;
}

function getDistances(S) {
    let D = [];
    for (let i = 0; i < S.length; i++) {
        for (let j = i; j < S.length; j++) {
            D.push(getDistance(S[i], S[j]));
        }
    }
    return D;
}

function sharedDistances(S1, S2) {
    let D1 = getDistances(S1);
    let D2 = getDistances(S2);
    return intersect(D1, D2).length;
}

function getDistance([x1, y1, z1], [x2, y2, z2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

function sync(scanners) {
    let NOS = scanners.length; // number of scanners
    let checkedScanners = new Array(NOS);
    let scannerPositions = new Map();

    // Add beacons of scanner 0, these will be relative reference orientation
    let orientedBeacons = addOrientedBeacons(scanners[0], new Set());
    scannerPositions.set(0, [0, 0, 0]);
    checkedScanners[0] = scanners[0];
    scanners[0] = null;

    while (scanners.some((s) => s !== null)) {
        rng(NOS).forEach((j) => {
            if (scanners[j] === null) return;
            let scanner_j = getOrientations(scanners[j]);
            rng(NOS).forEach((i) => {
                if (i === j || !checkedScanners[i] || !scanners[j]) return;
                if (sharedDistances(checkedScanners[i], scanners[j]) < 66)
                    return;

                for (let orientation of rng(48)) {
                    let j_to_i = findCommon(
                        checkedScanners[i],
                        scanner_j[orientation]
                    ); // returns deltas if 12 or more common beacons
                    if (j_to_i) {
                        checkedScanners[j] = scanner_j[orientation];
                        scanners[j] = null;
                        let i_to_0 = scannerPositions.get(i);
                        let j_to_0 = j_to_i.map((d, idx) => i_to_0[idx] + d);
                        scannerPositions.set(j, j_to_0);
                        orientedBeacons = addOrientedBeacons(
                            scanner_j[orientation],
                            orientedBeacons,
                            ...j_to_0
                        );
                        break;
                    }
                }
            });
        });
    }

    return [scannerPositions, orientedBeacons];
}

function getMaxDistance(scannersPositions) {
    let spos = Array.from(scannersPositions, ([key, value]) => value);
    let max = 0;
    for (let i = 0; i < spos.length; i++) {
        for (let j = i; j < spos.length; j++) {
            let d = getDistance(spos[i], spos[j]);
            if (d > max) max = d;
        }
    }
    return max;
}

function main() {
    let scanners = getData(PUZZLE_INPUT_PATH)(parser);

    let start = Date.now();
    let [scannerPositions, orientedBeacons] = sync(scanners);

    console.log(`Part 1: ${orientedBeacons.size} [${Date.now() - start} ms]`);
    console.log('Part 2:', getMaxDistance(scannerPositions));
}

main();
