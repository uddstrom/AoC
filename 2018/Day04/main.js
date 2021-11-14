const PUZZLE_INPUT_PATH = `${__dirname}/puzzle_input`;
const {
    getData,
    getMostFrequentElement,
    range,
    toDate,
} = require('../lib/utils');

function toEventObject(str) {
    return {
        time: toDate(/\[(.+)\]/.exec(str)[1]),
        event: str.substring(19),
    };
}

var parser = (input) => {
    return input.split('\n').sort().map(toEventObject);
};

var eventProcessor = (events) => {
    const guards = new Map(); // key: guard id, value: array of minutes asleep
    let guardOnDuty = 0; // guard id
    let timeOfLastEvent = 0;

    function process({ event, time }) {
        if (event.startsWith('Guard')) {
            const id = event.split(' ')[1].replace('#', '');
            guardOnDuty = id;
            if (guards.get(id) === undefined) {
                guards.set(id, []);
            }
        }
        if (event === 'wakes up') {
            guards.set(guardOnDuty, [
                ...guards.get(guardOnDuty),
                ...getMinutesSinceLastEvent(time),
            ]);
        }
        timeOfLastEvent = time;
    }

    function getMinutesSinceLastEvent(time) {
        // return a number array with minutes asleep,
        // eg. falls asleep: 05, wakes up: 15, returns [5,6,7,8,9,10,11,12,13,14]
        const startMin = timeOfLastEvent.getUTCMinutes();
        const endMin = time.getUTCMinutes() - 1;
        const minutesAsleepArray =
            startMin < endMin
                ? range(startMin, endMin)
                : [...range(startMin, 59), ...range(0, endMin)];
        return minutesAsleepArray;
    }

    events.forEach(process);

    return guards;
};

(function main() {
    var events = getData(PUZZLE_INPUT_PATH)(parser);
    const guardStat = eventProcessor(events);

    // Part 1: Find the guard that has the most minutes asleep.
    const guard1 = [...guardStat]
        .map((g) => ({ id: g[0], cnt: g[1].length }))
        .reduce((acc, guard) => {
            return acc.cnt > guard.cnt ? acc : guard;
        });

    // Get the minute when the guard sleeps the most
    const minute = getMostFrequentElement(guardStat.get(guard1.id));

    console.log('Part 1:', guard1.id * minute);

    // Part 2: Of all guards, which guard is most frequently asleep on the same minute?
    var guard2 = [...guardStat]
        .map((g) => {
            var mostFreq = getMostFrequentElement(g[1]);
            return {
                id: g[0],
                stat: {
                    mostFreq,
                    freq: g[1].filter((el) => el === mostFreq).length,
                },
            };
        })
        .sort((a, b) => a.stat.freq - b.stat.freq)
        .pop();

    console.log('Part 2:', guard2.id * guard2.stat.mostFreq);
})();
