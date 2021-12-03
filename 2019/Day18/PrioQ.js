export class PrioQ {
    constructor() {
        this.queue = new Map();
    }

    getId(state) {
        var pos = Object.values(state.pos).join(''); // the positions of the robots
        return `${state.node},${state.keys},${pos}`;
    }

    includes(state) {
        return this.queue.has(this.getId(state));
    }

    push(state) {
        this.queue.set(this.getId(state), state);
    }

    pop() {
        // remove the state with lowest g
        var candiate = { g: Number.MAX_SAFE_INTEGER };
        var cKey;
        this.queue.forEach((s, key) => {
            if (s.g < candiate.g) {
                candiate = s;
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
