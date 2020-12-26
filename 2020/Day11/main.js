const fs = require('fs');

function* SeatLayout(layout) {
    let map = layout.join('');
    const w = layout[0].length;
    const l = map.length;

    const leftmost = (i) => i % w === 0;
    const rightmost = (i) => i % w === w - 1;
    const pos = (i) => map.charAt(i);

    const adjacents = {
        UL: (i) => (i - w - 1 < 0 || rightmost(i - w - 1) ? 'L' : pos(i - w - 1)),
        U: (i) => (i - w < 0 ? 'L' : pos(i - w)),
        UR: (i) => (i - w + 1 < 0 || leftmost(i - w + 1) ? 'L' : pos(i - w + 1)),
        L: (i) => (i - 1 < 0 || rightmost(i - 1) ? 'L' : pos(i - 1)),
        R: (i) => (i + 1 >= l || leftmost(i + 1) ? 'L' : pos(i + 1)),
        DL: (i) => (i + w - 1 >= l || rightmost(i + w - 1) ? 'L' : pos(i + w - 1)),
        D: (i) => (i + w >= l ? 'L' : pos(i + w)),
        DR: (i) => (i + w + 1 >= l || leftmost(i + w + 1) ? 'L' : pos(i + w + 1)),
    };

    // number of occupied seats adjacents to i.
    const occupied = (i) =>
        Object.values(adjacents).reduce((cnt, adj) => (adj(i) === '#' ? cnt + 1 : cnt), 0);

    const getNext = () => {
        return Array.from(map)
            .map((p, idx) => {
                if (p === '.') return p;
                if (p === 'L') return occupied(idx) === 0 ? '#' : 'L';
                if (p === '#') return occupied(idx) >= 4 ? 'L' : '#';
            })
            .join('');
    };

    while (true) {
        const next = getNext();
        if (map === next) return map;
        map = next;
        yield map;
    }
}

function* SeatLayout2(layout) {
    let map = layout.join('');
    const w = layout[0].length;
    const l = map.length;

    const leftmost = (i) => i % w === 0;
    const rightmost = (i) => i % w === w - 1;
    const pos = (i) => map.charAt(i);

    const adjacents = {
        UL: (i) =>
            i - w - 1 < 0 || rightmost(i - w - 1)
                ? 'L'
                : pos(i - w - 1) === '.'
                ? adjacents['UL'](i - w - 1)
                : pos(i - w - 1),
        U: (i) => (i - w < 0 ? 'L' : pos(i - w) === '.' ? adjacents['U'](i - w) : pos(i - w)),
        UR: (i) =>
            i - w + 1 < 0 || leftmost(i - w + 1)
                ? 'L'
                : pos(i - w + 1) === '.'
                ? adjacents['UR'](i - w + 1)
                : pos(i - w + 1),
        L: (i) =>
            i - 1 < 0 || rightmost(i - 1)
                ? 'L'
                : pos(i - 1) === '.'
                ? adjacents['L'](i - 1)
                : pos(i - 1),
        R: (i) =>
            i + 1 >= l || leftmost(i + 1)
                ? 'L'
                : pos(i + 1) === '.'
                ? adjacents['R'](i + 1)
                : pos(i + 1),
        DL: (i) =>
            i + w - 1 >= l || rightmost(i + w - 1)
                ? 'L'
                : pos(i + w - 1) === '.'
                ? adjacents['DL'](i + w - 1)
                : pos(i + w - 1),
        D: (i) => (i + w >= l ? 'L' : pos(i + w) === '.' ? adjacents['D'](i + w) : pos(i + w)),
        DR: (i) =>
            i + w + 1 >= l || leftmost(i + w + 1)
                ? 'L'
                : pos(i + w + 1) === '.'
                ? adjacents['DR'](i + w + 1)
                : pos(i + w + 1),
    };

    // number of occupied seats adjacents to i.
    const occupied = (i) =>
        Object.values(adjacents).reduce((cnt, adj) => (adj(i) === '#' ? cnt + 1 : cnt), 0);

    const getNext = () => {
        return Array.from(map)
            .map((p, idx) => {
                if (p === '.') return p;
                if (p === 'L') return occupied(idx) === 0 ? '#' : 'L';
                if (p === '#') return occupied(idx) >= 5 ? 'L' : '#';
            })
            .join('');
    };

    while (true) {
        const next = getNext();
        if (map === next) return map;
        map = next;
        yield map;
    }
}

fs.readFile('Day11/puzzle_input', 'utf8', function (err, contents) {
    const map = contents.split('\n');

    let occupied = 0;
    for (const state of SeatLayout(map)) {
        occupied = (state.match(/#/g) || []).length;
    }
    console.log('Part 1:', occupied);

    for (const state of SeatLayout2(map)) {
        occupied = (state.match(/#/g) || []).length;
    }
    console.log('Part 2:', occupied);
});
