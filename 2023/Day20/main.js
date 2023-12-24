import { getData, getPath, rng, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var modules = new Map();
    var destMap = new Map();
    var conjMods = [];
    input.split("\n").map((line) => {
        var [id, dest] = line.split(" -> ");
        var type = id[0];
        if (type === "b") {
            modules.set(id, new Module(id));
            destMap.set(id, dest);
        }
        if (type === "%") {
            modules.set(id.substring(1), new FlipFlop(id.substring(1)));
            destMap.set(id.substring(1), dest);
        }
        if (type === "&") {
            modules.set(id.substring(1), new Conjunction(id.substring(1)));
            destMap.set(id.substring(1), dest);
            conjMods.push(id.substring(1));
        }
    });

    // configure destinations
    for (let [key, value] of destMap.entries()) {
        let destIds = value.split(", ");
        let m = modules.get(key);
        destIds.forEach((id) => {
            var destMod = modules.get(id) || new Module(id);
            m.addDestination(destMod);
        });
    }

    // configure inputs
    conjMods.forEach((id) => {
        var m = modules.get(id);
        for (let [source, dest] of destMap.entries()) {
            if (dest.includes(id)) m.addInput(source);
        }
    });

    return modules;
}

var LO = 0;
var HI = 1;

class Module {
    constructor(id) {
        this.id = id;
        this.destinations = [];
        this.LOs = 0;
        this.HIs = 0;
    }

    addDestination(mod) {
        this.destinations.push(mod);
    }

    receive(received, from) {
        console.log(`${from} -${received}-> ${this.id}`);
        this.update(received);
        this.destinations.forEach((dest) => dest.receive(received, this.id));
    }

    update(received) {
        received === HI ? this.HIs++ : this.LOs++;
    }
}

class FlipFlop extends Module {
    constructor(id) {
        super(id);
        this.on = false;
    }

    receive(received, from) {
        console.log(`${from} -${received}-> ${this.id}`);
        super.update(received);
        if (received === LO) {
            this.on = !this.on;
            let puls = this.on ? HI : LO;
            this.destinations.forEach((dest) => dest.receive(puls, this.id));
        }
    }
}

class Conjunction extends Module {
    constructor(id) {
        super(id);
        this.memory = new Map();
    }

    addInput(modId) {
        this.memory.set(modId, LO);
    }

    receive(received, from) {
        console.log(`${from} -${received}-> ${this.id}`);
        super.update(received);
        this.memory.set(from, received);
        // console.log("Memory of ", this.id, this.memory);
        let p = [...this.memory.values()].every((m) => m === HI) ? LO : HI;
        this.destinations.forEach((dest) => dest.receive(p, this.id));
    }
}

var modules = getData(PUZZLE_INPUT_PATH)(parser);

var broadcaster = modules.get("broadcaster");

rng(3).forEach((n) => {
    console.log("iteration", n + 1);
    broadcaster.receive(LO);
    console.log("");
});

var lo = sum([...modules.values()].map((m) => m.LOs));
var hi = sum([...modules.values()].map((m) => m.HIs));

console.log("Part 1:", lo * hi);
console.log("Part 2:");
