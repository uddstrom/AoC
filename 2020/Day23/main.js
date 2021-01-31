class LinkedList {
    constructor(head) {
        this.nodes = new Map();
        this.head = head;
        this.nodes.set(head, { label: head, prev: head, next: head }); // circular list, head pointing back at itself
    }

    get(node) {
        return this.nodes.get(node);
    }

    insert(element, after) {
        const { prev, next } = this.nodes.get(after);

        this.nodes.size === 1
            ? this.nodes.set(after, { label: after, prev: element, next: element })
            : this.nodes.set(after, { label: after, prev, next: element });

        this.nodes.set(element, { label: element, prev: after, next })
        this.nodes.set(next, Object.assign(this.nodes.get(next), { prev: element }));
    }

    delete(element) {
        const { prev, next } = this.nodes.get(element);
        this.nodes.set(prev, Object.assign(this.nodes.get(prev), { next }));
        this.nodes.set(next, Object.assign(this.nodes.get(next), { prev }));
        this.nodes.delete(element);
    }
}

const getDestination = (current, max, pickUp) => {
    const destination = (current - 1 < 1) ? max : current - 1;
    return pickUp.includes(destination) ? getDestination(destination, max, pickUp) : destination;
};

function* move(cups) {
    let next = cups.head;
    const max = cups.nodes.size;
    while (true) {
        const current = cups.get(next);

        const pickup1 = cups.get(current.next);
        const pickup2 = cups.get(pickup1.next);
        const pickup3 = cups.get(pickup2.next);

        cups.delete(pickup1.label);
        cups.delete(pickup2.label);
        cups.delete(pickup3.label);

        const destination = getDestination(current.label, max, [pickup1.label, pickup2.label, pickup3.label]);

        cups.insert(pickup1.label, destination);
        cups.insert(pickup2.label, pickup1.label);
        cups.insert(pickup3.label, pickup2.label);

        next = pickup3.next;

        yield cups;
    }
}

const CrabCups = (cups, rounds) => {
    const moveGen = move(cups);
    let result;
    for (let i = 1; i <= rounds; i++) {
        result = moveGen.next().value;
    }
    return result;
};

const setup = (input) => {
    const circle = new LinkedList(input[0]);
    input.slice(1).map((n, idx, arr) => circle.insert(n, idx === 0 ? input[0] : arr[idx - 1]));
    return circle;
}

const partOne = (cups) => {
    let current = cups.get(cups.get(1).next);
    const final = [];
    while (current.label !== 1) {
        final.push(current.label);
        current = cups.get(current.next);
    }
    return final.join('');
}

const partTwo = (cups) => {
    const first = cups.get(cups.get(1).next);
    const second = cups.get(first.next);
    return first.label * second.label;
}

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);

const input = Array.from('739862541').map(Number);

console.log('Part 1:', partOne(CrabCups(setup(input), 100)));

const t0 = Date.now();
const answerPartTwo = partTwo(CrabCups(setup([...input, ...range(10, 1000000)]), 10000000));
const t1 = Date.now();
console.log(`Part 2: ${answerPartTwo} (${t1 - t0} ms)`);
