export class PrioQ {
    constructor() {
        this.queue = new Map();
    }

    getId(state) {
        return `${state.location.id},${state.location.isOpen},${state.flowRate},${state.totalRelease}`;
    }

    includes(state) {
        return this.queue.has(this.getId(state));
    }

    push(state) {
        this.queue.set(this.getId(state), state);
    }

    pop() {
        // remove the state with highest total release
        var candiate = { totalRelease: -1 };
        var cKey;
        this.queue.forEach((state, key) => {
            if (state.totalRelease > candiate.totalRelease) {
                candiate = state;
                cKey = key;
            }
        });
        this.queue.delete(cKey);
        return candiate;
    }

    get(state) {
        return this.queue.get(this.getId(state));
    }

    empty() {
        return this.queue.size === 0;
    }
}
