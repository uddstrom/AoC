import { getData, getPath, min, max, sum } from "../lib/utils.js";

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var [workflows, parts] = input.split("\n\n");
    var W = new Map();
    workflows.split("\n").forEach((workflow) => {
        var { name, rules } = workflow.match(/(?<name>[a-z]+){(?<rules>.*)}/).groups;
        var R = rules.split(",").map((rule) => {
            var condition = rule.split(":")[0];
            var next = rule.split(":")[1];
            return next ? { condition, next } : { next: condition };
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
    if (workflowId === "R") return 0;
    if (workflowId === "A") return sum(Object.values(part));

    var workflow = workflowId ? workflows.get(workflowId) : workflows.get("in");

    for (let { condition, next } of workflow) {
        if (evaluate(part, condition)) return processPart(part, next);
    }
}

function findWorkflowPaths(
    xmin = 1,
    xmax = 4000,
    mmin = 1,
    mmax = 4000,
    amin = 1,
    amax = 4000,
    smin = 1,
    smax = 4000,
    wid = "in"
) {
    if (wid === "A") return (xmax - xmin + 1) * (mmax - mmin + 1) * (amax - amin + 1) * (smax - smin + 1);
    if (wid === "R") return 0;

    var workflow = workflows.get(wid);
    var acceptCnt = 0;

    for (let { condition, next } of workflow) {
        if (condition === undefined) {
            acceptCnt += findWorkflowPaths(xmin, xmax, mmin, mmax, amin, amax, smin, smax, next);
        } else {
            let { prop, cond, value } = condition.match(/(?<prop>.+)(?<cond>\<|\>)(?<value>\d+)/).groups;
            value = Number(value);
            let xxmin = xmin;
            let xxmax = xmax;
            let mmmin = mmin;
            let mmmax = mmax;
            let aamin = amin;
            let aamax = amax;
            let ssmin = smin;
            let ssmax = smax;
            if (prop === "x") {
                if (cond === "<") {
                    xxmax = min([xmax, value - 1]);
                    xmin = max([xmin, value]);
                }
                if (cond === ">") {
                    xxmin = max([xmin, value + 1]);
                    xmax = min([xmax, value]);
                }
            }
            if (prop === "m") {
                if (cond === "<") {
                    mmmax = min([mmax, value - 1]);
                    mmin = max([mmin, value]);
                }
                if (cond === ">") {
                    mmmin = max([mmin, value + 1]);
                    mmax = min([mmax, value]);
                }
            }
            if (prop === "a") {
                if (cond === "<") {
                    aamax = min([amax, value - 1]);
                    amin = max([amin, value]);
                }
                if (cond === ">") {
                    aamin = max([amin, value + 1]);
                    amax = min([amax, value]);
                }
            }
            if (prop === "s") {
                if (cond === "<") {
                    ssmax = min([smax, value - 1]);
                    smin = max([smin, value]);
                }
                if (cond === ">") {
                    ssmin = max([smin, value + 1]);
                    smax = min([smax, value]);
                }
            }
            acceptCnt += findWorkflowPaths(xxmin, xxmax, mmmin, mmmax, aamin, aamax, ssmin, ssmax, next);
        }
    }
    return acceptCnt;
}

var [workflows, parts] = getData(PUZZLE_INPUT_PATH)(parser);

console.log("Part 1:", sum(parts.map((part) => processPart(part))));
console.log("Part 2:", findWorkflowPaths());
