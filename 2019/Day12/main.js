function* stateGenerator() {
    // puzzle data
    let moons = [
        [5, -1, 5, 0, 0, 0],
        [0, -14, 2, 0, 0, 0],
        [16, 4, 0, 0, 0, 0],
        [18, 1, 16, 0, 0, 0]
    ];

    while (true) {
        moons = moons.map((moon) => {
            const pos = moon.slice(0, 3);
            const vel = moon.slice(3);
            const newVelocity = pos.map((p, i) => {
                return (
                    vel[i] +
                    moons.reduce(
                        (acc, m) => acc + (p < m[i] ? 1 : p > m[i] ? -1 : 0),
                        0
                    )
                );
            });
            const newPosition = pos.map((p, i) => p + newVelocity[i]);
            return [...newPosition, ...newVelocity];
        });
        yield moons;
    }
}

function* findRepetingState(dimension) {
    let counter = 0;

    // puzzle input
    const initialState = [
        [5, -1, 5, 0, 0, 0],
        [0, -14, 2, 0, 0, 0],
        [16, 4, 0, 0, 0, 0],
        [18, 1, 16, 0, 0, 0]
    ];
    const initialStateId = initialState
        .map((moon) => moon[dimension])
        .join(',');

    const states = stateGenerator();
    while (true) {
        counter++;
        ({ value: state } = states.next());
        stateId = state.map((moon) => moon[dimension]).join(',');
        if (stateId === initialStateId) {
            yield counter;
        }
    }
}

const calculateTotalEnergy = () => {
    const getVecSize = (vec) => {
        return vec.reduce((acc, l) => acc + Math.abs(l), 0);
    };
    
    let states = stateGenerator();
    let state;

    for (let i = 0; i < 1000; i++) {
        ({ value: state } = states.next());
    }

    return state.reduce(
        (acc, moon) =>
            acc + getVecSize(moon.slice(0, 3)) * getVecSize(moon.slice(3)),
        0
    );
};

const calculatePeriods = () => {
    const getPeriod = (distances) => {
        const sumReducer = (accumulator, currentValue) =>
            accumulator + currentValue;
        for (let len = 1; len < distances.length; len++) {
            const sums = new Set();
            for (let k = 0; k + len < distances.length; k += len) {
                const sum = distances.slice(k, k + len).reduce(sumReducer, 0);
                sums.add(sum);
            }
            if (sums.size === 1) {
                return sums.values().next().value;
            }
        }
    };

    const periods = [0, 1, 2, 3, 4, 5].map((n) => {
        // Build distances array
        const g = findRepetingState(n);
        let distances = [];
        let curr = 0;
        let prev = 0;
        for (let j = 0; j < 10; j++) {
            curr = g.next().value;
            distances.push(curr - prev);
            prev = curr;
        }
        return getPeriod(distances);
    });
    return periods;
};

const main = async () => {
    try {
        console.log('Part I: Total energy is', calculateTotalEnergy());
        console.log('Part II: Calculate the LCM of the periods to get the answer. The periods are', calculatePeriods());
    } catch (err) {
        console.error(err);
    }
};

main();
