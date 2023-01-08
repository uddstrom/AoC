import {
    getData,
    getPath,
    product,
    sum,
    triangularNumber,
} from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    var blueprints = [];
    input.split('\n').forEach((line) => {
        let { id, ore, clay, obs_ore, obs_clay, geode_ore, geode_obs } =
            line.match(
                /Blueprint (?<id>\d+): Each ore robot costs (?<ore>\d+) ore. Each clay robot costs (?<clay>\d+) ore. Each obsidian robot costs (?<obs_ore>\d+) ore and (?<obs_clay>\d+) clay. Each geode robot costs (?<geode_ore>\d+) ore and (?<geode_obs>\d+) obsidian./
            ).groups;
        blueprints.push({
            id: Number(id),
            ore_robot: Number(ore),
            clay_robot: Number(clay),
            obsidian_robot: [Number(obs_ore), Number(obs_clay)],
            geode_robot: [Number(geode_ore), Number(geode_obs)],
        });
    });
    return blueprints;
}

function getId(state) {
    return `${
        state.time
    };${state.robots.toString()};${state.minerals.toString()}`;
}

function dfs(blueprint, start) {
    var visited = new Set();
    var openSet = [];
    var maxGeode = { minerals: [0, 0, 0, 0] };

    openSet.push(start);

    while (openSet.length > 0) {
        let current = openSet.pop();
        visited.add(getId(current));

        if (current.time === 0) {
            if (current.minerals[3] > maxGeode.minerals[3]) {
                maxGeode = current;
            }
            continue;
        }

        // construct new states

        let options = mineOptions(blueprint, current);
        options.forEach((option) => {
            let newState = {
                time: current.time - 1,
                robots: option.robots,
                minerals: option.minerals,
                previous: current,
            };

            // can this state outperforme current best?
            if (
                newState.minerals[3] +
                    newState.robots[3] * newState.time +
                    triangularNumber(newState.time - 1) >
                maxGeode.minerals[3]
            ) {
                // ignore new state if visited already
                if (!visited.has(getId(newState))) {
                    openSet.push(newState);
                }
            }
        });
    }

    return maxGeode.minerals[3];
}

function mineOptions(bp, { robots, minerals }) {
    var options = build(bp, robots, minerals)
        .map((fn) => fn())
        .filter((state) => state !== undefined);
    options.push(collect(robots, minerals));
    return options;
}

function build(blueprint, robots, minerals) {
    var [ore_robots, clay_robots, obsidian_robots, geode_robots] = robots;
    var [ore, clay, obsidian, geode] = minerals;

    // Try build geode robot
    function geodeRobot() {
        if (
            ore >= blueprint.geode_robot[0] &&
            obsidian >= blueprint.geode_robot[1]
        ) {
            // Can build geode robot
            return {
                robots: [
                    ore_robots,
                    clay_robots,
                    obsidian_robots,
                    geode_robots + 1,
                ],
                minerals: [
                    ore + ore_robots - blueprint.geode_robot[0],
                    clay + clay_robots,
                    obsidian + obsidian_robots - blueprint.geode_robot[1],
                    geode + geode_robots,
                ],
            };
        }
    }

    function obsidianRobot() {
        // Try build obsidian robot
        if (
            ore >= blueprint.obsidian_robot[0] &&
            clay >= blueprint.obsidian_robot[1]
        ) {
            // Can build obsidian robot
            return {
                robots: [
                    ore_robots,
                    clay_robots,
                    obsidian_robots + 1,
                    geode_robots,
                ],
                minerals: [
                    ore + ore_robots - blueprint.obsidian_robot[0],
                    clay + clay_robots - blueprint.obsidian_robot[1],
                    obsidian + obsidian_robots,
                    geode + geode_robots,
                ],
            };
        }
    }

    function clayRobot() {
        // Try build clay robot
        if (ore >= blueprint.clay_robot) {
            // Can build clay robot
            return {
                robots: [
                    ore_robots,
                    clay_robots + 1,
                    obsidian_robots,
                    geode_robots,
                ],
                minerals: [
                    ore + ore_robots - blueprint.clay_robot,
                    clay + clay_robots,
                    obsidian + obsidian_robots,
                    geode + geode_robots,
                ],
            };
        }
    }

    function oreRobot() {
        // Try build ore robot
        if (ore >= blueprint.ore_robot) {
            // Can build ore robot
            return {
                robots: [
                    ore_robots + 1,
                    clay_robots,
                    obsidian_robots,
                    geode_robots,
                ],
                minerals: [
                    ore + ore_robots - blueprint.ore_robot,
                    clay + clay_robots,
                    obsidian + obsidian_robots,
                    geode + geode_robots,
                ],
            };
        }
    }

    return [geodeRobot, obsidianRobot, clayRobot, oreRobot];
}

function collect(robots, minerals) {
    var [ore_robots, clay_robots, obsidian_robots, geode_robots] = robots;
    var [ore, clay, obsidian, geode] = minerals;

    return {
        robots,
        minerals: [
            ore + ore_robots,
            clay + clay_robots,
            obsidian + obsidian_robots,
            geode + geode_robots,
        ],
    };
}

// function printPath(path) {
//     if (path.previous) printPath(path.previous);
//     console.log(
//         `${
//             24 - path.time
//         }: ${path.robots.toString()}; ${path.minerals.toString()}`
//     );
// }

var blueprints = getData(PUZZLE_INPUT_PATH)(parser);

var startTime = Date.now();

var start = {
    time: 24,
    robots: [1, 0, 0, 0],
    minerals: [0, 0, 0, 0],
};

// var p1 = sum(
//     blueprints.map((blueprint) => {
//         console.log(`Processing blueprint ${blueprint.id}`);
//         return blueprint.id * dfs(blueprint, start)
//     }));

// console.log('Part 1:', p1, Date.now() - startTime);

start.time = 32;

var p2 = product(
    blueprints.slice(0, 3).map((blueprint) => {
        console.log(`Processing blueprint ${blueprint.id}`);
        return blueprint.id * dfs(blueprint, start);
    })
);

console.log('Part 2:', p2);
