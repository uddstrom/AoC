import { getData, getPath, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split(",");
}

function hash(str) {
    return str.split("").reduce((acc, curr) => {
        acc += curr.charCodeAt(0);
        acc *= 17;
        acc = acc % 256;
        return acc;
    }, 0);
}

function hashmap(steps) {
    var boxes = Array(256)
        .fill()
        .map((_) => []);
    console.log(boxes);

    function add(boxNo, lbl, f) {
        var box = boxes[boxNo];
        var idx = box.findIndex(({ label }) => label === lbl);
        if (idx >= 0) box[idx] = { label: lbl, f };
        else box.push({ label: lbl, f });
    }

    function remove(boxNo, lbl) {
        var box = boxes[boxNo];
        box = box.filter(({ label }) => label !== lbl);
        boxes[boxNo] = box;
    }

    steps.forEach((step) => {
        var { label, op, f } = step.match(/(?<label>[a-z]+)(?<op>=|-)(?<f>\d*)/).groups;
        var boxNo = hash(label);
        op === "=" ? add(boxNo, label, f) : remove(boxNo, label);
    });

    return boxes;
}

function focusingPower(boxes) {
    return sum(
        boxes.flatMap((box, i) => {
            return box.map(({ f }, j) => (i + 1) * (j + 1) * f);
        })
    );
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var boxes = hashmap(data);

console.log("Part 1:", sum(data.map(hash)));
console.log("Part 2:", focusingPower(boxes));
