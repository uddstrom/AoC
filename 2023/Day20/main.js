import { getData, getPath, lcmOfArray, product, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var modules = new Map();
    var moduleList = input.split("\n");
    var destMap = new Map();
    var conjMods = [];
    moduleList.forEach((config) => {
        var [id, destinations] = config.split(" -> ");
        var type = id[0];
        if (type === "b") {
            modules.set(id, new Module(id));
            destMap.set(id, destinations);
        }
        if (type === "%") {
            modules.set(id.substring(1), new FlipFlop(id.substring(1)));
            destMap.set(id.substring(1), destinations);
        }
        if (type === "&") {
            modules.set(id.substring(1), new Conjunction(id.substring(1)));
            destMap.set(id.substring(1), destinations);
            conjMods.push(id.substring(1));
        }
    });

    // configure destinations
    for (let [src, destinations] of destMap.entries()) {
        let srcMod = modules.get(src);
        destinations.split(", ").forEach((dstId) => {
            if (modules.has(dstId)) {
                srcMod.addDestination(modules.get(dstId));
            } else {
                let destMod = new Module(dstId);
                modules.set(dstId, destMod);
                srcMod.addDestination(destMod);
            }
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
        this.sendQ = [];
    }

    addDestination(mod) {
        this.destinations.push(mod);
    }

    receive(puls) {
        this.updateHiLoCnt(puls);
        this.sendQ.push(puls);
    }

    send() {
        var puls = this.sendQ.shift();
        return this.destinations.map((dest) => {
            dest.receive(puls, this.id);
            return dest;
        });
    }

    updateHiLoCnt(received) {
        received === HI ? this.HIs++ : this.LOs++;
    }
}

class FlipFlop extends Module {
    constructor(id) {
        super(id);
        this.on = false;
        this.shouldSend = false;
    }

    receive(puls) {
        super.updateHiLoCnt(puls);
        if (puls === LO) {
            this.on = !this.on;
            this.shouldSend = true;
        }
    }

    send() {
        if (this.shouldSend) {
            this.shouldSend = false;
            return this.destinations.map((dest) => {
                dest.receive(this.on ? HI : LO, this.id);
                return dest;
            });
        } else return [];
    }
}

class Conjunction extends Module {
    constructor(id) {
        super(id);
        this.memory = new Map();
        this.cycle = 0; // how often does this module send HI puls.
    }

    addInput(modId) {
        this.memory.set(modId, LO);
    }

    receive(puls, from) {
        super.updateHiLoCnt(puls);
        this.memory.set(from, puls);
    }

    send(iteration) {
        let puls = [...this.memory.values()].every((m) => m === HI) ? LO : HI;
        if (puls === HI && this.cycle === 0) this.cycle = iteration;
        return this.destinations.map((dest) => {
            dest.receive(puls, this.id);
            return dest;
        });
    }
}

var modules = getData(PUZZLE_INPUT_PATH)(parser);
var broadcaster = modules.get("broadcaster");

function pushTheButton(iteration = 1) {
    if (["bt", "dl", "fr", "rv"].every((id) => modules.get(id).cycle > 0)) return;
    if (iteration === 1000) {
        let lo = sum([...modules.values()].map((m) => m.LOs));
        let hi = sum([...modules.values()].map((m) => m.HIs));
        console.log("Part 1:", lo * hi);
    }

    broadcaster.receive(LO);
    let sendQ = broadcaster.send();
    while (sendQ.length > 0) {
        let m = sendQ.shift();
        let next = m.send(iteration);
        sendQ = sendQ.concat(next);
    }

    pushTheButton(iteration + 1);
}

pushTheButton();
var p2 = lcmOfArray(["bt", "dl", "fr", "rv"].map((id) => modules.get(id).cycle));
console.log("Part 2:", p2);
