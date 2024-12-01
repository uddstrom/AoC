export class PrioQ {
    constructor(compareFn, idFn) {
        this.queue = [];
        this.ids = new Set();
        this.compareFn = compareFn;
        this.getId = idFn;
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
        this.ids.delete(this.getId(state));
        return state;
    }

    empty() {
        return this.queue.length === 0;
    }
    
    size() {
        return this.queue.length;
    }
}
