const fs = require('fs');

function eval(z, y, x, map) {
    return map.get(`${z},${y},${x}`) || '.';
}

function cycleCube(z, y, x, map) {
    let activeCounter = 0;
    for (let dz = z - 1; dz <= z + 1; dz++) {
        for (let dy = y - 1; dy <= y + 1; dy++) {
            for (let dx = x - 1; dx <= x + 1; dx++) {
                if (!(dz === z && dy === y && dx === x) && eval(dz, dy, dx, map) === '#') activeCounter++;
            }
        }
    }
    const cubeState = eval(z, y, x, map);
    if (cubeState === '#' && (activeCounter === 2 || activeCounter === 3)) return '#';
    if (cubeState === '.' && activeCounter === 3) return '#';
    return '.';
}

function cycle(map, min, max) {
    const newMap = new Map();
    for (let z = min; z <= max; z++) {
        for (let y = min; y <= max; y++) {
            for (let x = min; x <= max; x++) {
                if (cycleCube(z, y, x, map) === '#') newMap.set(`${z},${y},${x}`, '#');
            }
        }
    }
    return newMap;
}

function eval2(z, y, x, w, map) {
    return map.get(`${z},${y},${x},${w}`) || '.';
}

function cycleCube2(z, y, x, w, map) {
    let activeCounter = 0;
    for (let dz = z - 1; dz <= z + 1; dz++) {
        for (let dy = y - 1; dy <= y + 1; dy++) {
            for (let dx = x - 1; dx <= x + 1; dx++) {
                for (let dw = w - 1; dw <= w + 1; dw++) {
                    if (!(dz === z && dy === y && dx === x && dw === w) && eval2(dz, dy, dx, dw, map) === '#') activeCounter++;
                }
            }
        }
    }
    const cubeState = eval2(z, y, x, w, map);
    if (cubeState === '#' && (activeCounter === 2 || activeCounter === 3)) return '#';
    if (cubeState === '.' && activeCounter === 3) return '#';
    return '.';
}

function cycle2(map, min, max) {
    const newMap = new Map();
    for (let z = min; z <= max; z++) {
        for (let y = min; y <= max; y++) {
            for (let x = min; x <= max; x++) {
                for (let w = min; w <= max; w++) {
                    if (cycleCube2(z, y, x, w, map) === '#') newMap.set(`${z},${y},${x},${w}`, '#');
                }
            }
        }
    }
    return newMap;
}

fs.readFile('Day17/puzzle_input', 'utf8', function (err, contents) {
    const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);

    // Setup
    const input = contents.split('\n').map(line => line.split(''));

    // Part 1
    let map = new Map();
    input.forEach((ydim, y) => ydim.forEach((xdim, x) => { if (xdim === '#') map.set(`${0},${y},${x}`, '#') }));
    range(0, 5).forEach(i => map = cycle(map, -1 - i, input.length + i));
    console.log('Part 1:', map.size);

    // Part 2
    let map2 = new Map();
    input.forEach((ydim, y) => ydim.forEach((xdim, x) => { if (xdim === '#') map2.set(`${0},${y},${x},${0}`, '#') }));
    range(0, 5).forEach(i => map2 = cycle2(map2, -1 - i, input.length + i));

    console.log('Part 2:', map2.size);
});
