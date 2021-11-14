const fs = require('fs');

const readPuzzleInput = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function(err, contents) {
            contents ? resolve(contents.split('\r\n')) : reject('Error reading file');
        });
    });
};

const component = (quantity, chemical, distanceFromORE) => {
    return { quantity, chemical, distanceFromORE };
};

class Reaction {
    constructor(formula) {
        const input = formula
            .split('=>')[0]
            .trim()
            .split(',')
            .map((s) => s.trim());
        const out = formula
            .split('=>')[1]
            .trim()
            .split(' ');
        this.id = out[1];
        this.output = component(out[0], out[1]);
        this.input = input.map((i) => component(Number(i.split(' ')[0]), i.split(' ')[1]));
    }
    setDistaceFromORE(d) {
        this.distance = d;
    }
}

const nanofactory = new Map();
const inventory = new Map();

const calcDistance = (id) => {
    if (id === 'ORE') {
        return 0;
    }
    const { input } = nanofactory.get(id);
    return (
        1 +
        input
            .map(({ chemical }) => calcDistance(chemical))
            .reduce((acc, curr) => (acc > curr ? acc : curr))
    );
};

const calculateDistanceFromORE = () => {
    for (let [id, r] of nanofactory) {
        r.setDistaceFromORE(calcDistance(id));
    }
    for (let [id, r] of nanofactory) {
        // set distance on input components
        r.input.forEach((component) => {
            component.distanceFromORE = component.chemical === 'ORE' ? 0 : getDistance(component.chemical);
        });
        // sort the reactions input components according to distance
        r.input.sort((a, b) => b.distanceFromORE - a.distanceFromORE);
    }
};

const setupNanoFactory = (formulas) => {
    formulas.map((f) => {
        const r = new Reaction(f);
        nanofactory.set(r.id, r);
    });
    calculateDistanceFromORE();
};

const mergeArray = (arr) => {
    return arr
        .map((el) => {
            return {
                quantity: arr.reduce((acc, curr) => acc + (curr.chemical === el.chemical ? curr.quantity : 0), 0),
                chemical: el.chemical,
                distanceFromORE: el.distanceFromORE,
            };
        })
        .filter((el, index, self) => index === self.findIndex((e) => e.chemical === el.chemical))
        .sort((a, b) => b.distanceFromORE - a.distanceFromORE);
};

const getDistance = (chemical) => {
    if (chemical === 'ORE') {
        return 0;
    }
    return nanofactory.get(chemical).distance;
};

const develop = (component) => {
    const reaction = nanofactory.get(component.chemical); // reaction to develop component
    const inv = inventory.get(component.chemical) || 0;
    const runs = Math.ceil((component.quantity - inv) / reaction.output.quantity);
    const leftOver = reaction.output.quantity * runs - (component.quantity - inv);
    inventory.set(component.chemical, leftOver);
    return reaction.input.map(c => Object.assign({}, c, { quantity: c.quantity * runs}));
}

const produce = (chemical) => {
    const reaction = nanofactory.get(chemical);

    while (reaction.input.length > 1) {
        const newInput = develop(reaction.input[0]);
        reaction.input = mergeArray([...newInput, ...reaction.input.slice(1)]);
    }

    return reaction.input[0].quantity;
};

const main = async () => {
    try {
        const file = process.argv[2] || '2019/Day14/puzzle_input';
        const puzzle_input = await readPuzzleInput(file);

        // setupNanoFactory(puzzle_input);
        // console.log('Part I: OREs required to produce 1 FUEL is', produce('FUEL'));

        let OREsLeft = 1e12;
        let fuel = 0;
        let ores = 0;
        while (true) {
            setupNanoFactory(puzzle_input);
            ores = produce('FUEL');
            if (OREsLeft >= ores) {
                OREsLeft -= ores;
                fuel++;
                // if (fuel < 10) {
                //     console.log('Inventory', inventory);
                //     console.log('Ores consumed', ores);
                // }
            } else {
                break;
            }
        }
        console.log('Part II: Fuels produced', fuel);
        console.log('inventory', inventory);
    } catch (err) {
        console.error(err);
    }
};

main();
