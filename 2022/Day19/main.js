import {
    getData,
    getPath,
    product,
    max,
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

function getId({ time, robots, minerals }) {
    return `${time};${robots.toString()};${minerals.toString()}`;
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

        let options = mineOptions(blueprint, current);
        options.forEach((option) => {
            let newState = {
                time: current.time - 1,
                robots: option.robots,
                minerals: option.minerals,
                previous: current,
            };

            var potential =
                newState.minerals[3] +
                newState.robots[3] * newState.time +
                triangularNumber(newState.time - 1);

            if (
                potential > maxGeode.minerals[3] &&
                !visited.has(getId(newState))
            ) {
                openSet.push(newState);
            }
        });
    }

    return maxGeode.minerals[3];
}

function mineOptions(bp, { time, robots, minerals }) {
    var options = robotFactories(bp, robots, minerals)
        .map((factory) => factory())
        .filter((option) => option !== undefined);
    options.push(collect(robots, minerals));
    return options.map((o) => optimize(bp, o, time));
}

function optimize(blueprint, { robots, minerals }, time) {
    // no need to have more minerals than we have time to spend
    var [ore, clay, obsidian, geode] = minerals;
    var [r1, r2, r3, r4] = robots;

    var maxOre = max([
        blueprint.geode_robot[0],
        blueprint.obsidian_robot[0],
        blueprint.clay_robot,
        blueprint.ore_robot,
    ]);
    if (ore > maxOre * time) ore = maxOre * time;
    if (clay > blueprint.obsidian_robot[1] * time)
        clay = blueprint.obsidian_robot[1] * time;
    if (obsidian > blueprint.geode_robot[1] * time)
        obsidian = blueprint.geode_robot[1] * time;

    // no need to have more robots than you can spend each minute
    if (r1 > maxOre) r1 = maxOre;
    if (r2 > blueprint.obsidian_robot[1]) r2 = blueprint.obsidian_robot[1];
    if (r3 > blueprint.geode_robot[1]) r3 = blueprint.geode_robot[1];

    return {
        robots: [r1, r2, r3, r4],
        minerals: [ore, clay, obsidian, geode],
    };
}

function robotFactories(bp, robots, minerals) {
    var [r1, r2, r3, r4] = robots;
    var [ore, clay, obsidian, geode] = minerals;

    function buildGeodeRobot() {
        if (ore >= bp.geode_robot[0] && obsidian >= bp.geode_robot[1]) {
            return {
                robots: [r1, r2, r3, r4 + 1],
                minerals: [
                    ore + r1 - bp.geode_robot[0],
                    clay + r2,
                    obsidian + r3 - bp.geode_robot[1],
                    geode + r4,
                ],
            };
        }
    }

    function buildObsidianRobot() {
        if (ore >= bp.obsidian_robot[0] && clay >= bp.obsidian_robot[1]) {
            return {
                robots: [r1, r2, r3 + 1, r4],
                minerals: [
                    ore + r1 - bp.obsidian_robot[0],
                    clay + r2 - bp.obsidian_robot[1],
                    obsidian + r3,
                    geode + r4,
                ],
            };
        }
    }

    function buildClayRobot() {
        if (ore >= bp.clay_robot) {
            return {
                robots: [r1, r2 + 1, r3, r4],
                minerals: [
                    ore + r1 - bp.clay_robot,
                    clay + r2,
                    obsidian + r3,
                    geode + r4,
                ],
            };
        }
    }

    function buildOreRobot() {
        if (ore >= bp.ore_robot) {
            return {
                robots: [r1 + 1, r2, r3, r4],
                minerals: [
                    ore + r1 - bp.ore_robot,
                    clay + r2,
                    obsidian + r3,
                    geode + r4,
                ],
            };
        }
    }

    return [buildGeodeRobot, buildObsidianRobot, buildClayRobot, buildOreRobot];
}

function collect(robots, minerals) {
    var [r1, r2, r3, r4] = robots;
    var [ore, clay, obsidian, geode] = minerals;

    return {
        robots,
        minerals: [ore + r1, clay + r2, obsidian + r3, geode + r4],
    };
}

console.log('This day will take some time (~ 3 min)');

var blueprints = getData(PUZZLE_INPUT_PATH)(parser);

var start = {
    time: 24,
    robots: [1, 0, 0, 0],
    minerals: [0, 0, 0, 0],
};

var p1 = sum(blueprints.map((bp) => bp.id * dfs(bp, start)));
console.log('Part 1:', p1);

start.time = 32;
var p2 = product(blueprints.slice(0, 3).map((bp) => dfs(bp, start)));
console.log('Part 2:', p2);
