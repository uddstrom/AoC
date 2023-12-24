import { getData, getPath, min, max, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var [workflows, parts] = input.split("\n\n");
    var W = new Map();
    workflows.split("\n").forEach((workflow) => {
        var { name, rules } = workflow.match(/(?<name>[a-z]+){(?<rules>.*)}/).groups;
        var R = rules.split(",").map((rule) => {
            var condition = rule.split(":")[0];
            var nextWorkflow = rule.split(":")[1];
            return nextWorkflow ? { condition, nextWorkflow } : { nextWorkflow: condition };
        });
        W.set(name, R);
    });
    var P = parts.split("\n").map((part) => {
        var { x, m, a, s } = part.match(/\{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)\}/).groups;
        return { x: Number(x), m: Number(m), a: Number(a), s: Number(s) };
    });
    return [W, P];
}

function evaluate(part, condition) {
    if (condition === undefined) return true;
    var { prop, cond, value } = condition.match(/(?<prop>.+)(?<cond>\<|\>)(?<value>\d+)/).groups;
    return cond === ">" ? part[prop] > Number(value) : part[prop] < Number(value);
}

function processPart(part, workflowId) {
    if (workflowId === "R") return 0; // rejected
    if (workflowId === "A") return sum(Object.values(part)); // accepted

    var workflow = workflowId ? workflows.get(workflowId) : workflows.get("in");

    for (let { condition, nextWorkflow } of workflow) {
        if (evaluate(part, condition)) return processPart(part, nextWorkflow);
    }
}

function getNewRange(op, value, lo, hi) {
    if (op === "<") hi = min([hi, value - 1]);
    if (op === ">") lo = max([lo, value + 1]);
    return [lo, hi];
}

function getNewRanges(prop, op, value, xl, xh, ml, mh, al, ah, sl, sh) {
    if (prop === "x") {
        let [lo, hi] = getNewRange(op, value, xl, xh);
        return [lo, hi, ml, mh, al, ah, sl, sh];
    }
    if (prop === "m") {
        let [lo, hi] = getNewRange(op, value, ml, mh);
        return [xl, xh, lo, hi, al, ah, sl, sh];
    }
    if (prop === "a") {
        let [lo, hi] = getNewRange(op, value, al, ah);
        return [xl, xh, ml, mh, lo, hi, sl, sh];
    }
    if (prop === "s") {
        let [lo, hi] = getNewRange(op, value, sl, sh);
        return [xl, xh, ml, mh, al, ah, lo, hi];
    }
}

function findWorkflowPaths(wid = "in", xl = 1, xh = 4000, ml = 1, mh = 4000, al = 1, ah = 4000, sl = 1, sh = 4000) {
    if (wid === "A") return (xh - xl + 1) * (mh - ml + 1) * (ah - al + 1) * (sh - sl + 1);
    if (wid === "R") return 0;

    var workflow = workflows.get(wid);
    var acceptCnt = 0;

    for (let { condition, nextWorkflow } of workflow) {
        if (condition === undefined) {
            acceptCnt += findWorkflowPaths(nextWorkflow, xl, xh, ml, mh, al, ah, sl, sh);
        } else {
            let { prop, op, value } = condition.match(/(?<prop>.+)(?<op>\<|\>)(?<value>\d+)/).groups;
            value = Number(value);
            acceptCnt += findWorkflowPaths(
                nextWorkflow,
                ...getNewRanges(prop, op, value, xl, xh, ml, mh, al, ah, sl, sh)
            );

            if (prop === "x" && op === "<") xl = max([xl, value]);
            if (prop === "x" && op === ">") xh = min([xh, value]);
            if (prop === "m" && op === "<") ml = max([ml, value]);
            if (prop === "m" && op === ">") mh = min([mh, value]);
            if (prop === "a" && op === "<") al = max([al, value]);
            if (prop === "a" && op === ">") ah = min([ah, value]);
            if (prop === "s" && op === "<") sl = max([sl, value]);
            if (prop === "s" && op === ">") sh = min([sh, value]);
        }
    }
    return acceptCnt;
}

var [workflows, parts] = getData(PUZZLE_INPUT_PATH)(parser);

console.log("Part 1:", sum(parts.map((part) => processPart(part))));
console.log("Part 2:", findWorkflowPaths());
