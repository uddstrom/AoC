export class PrioQ {
    constructor(compareFn) {
        this.queue = [];
        this.ids = new Set();
        this.compareFn = compareFn;
    }

    getId(state) {
        var blizzards = [...state.blizzards].map((b) => `${b.r},${b.c},${b.dir}`).toString();
        return `${state.r};${state.c};${blizzards}`;
    }

    includes(state) {
        return this.ids.has(this.getId(state));
    }

    push(state) {
        this.ids.add(this.getId(state));
        this.queue.push(state);
        this.queue.sort(this.compareFn);
    }

    pop() {
        var state = this.queue.shift();
        // this.ids.delete(this.getId(state));
        return state;
    }

    empty() {
        return this.queue.size === 0;
    }
}
