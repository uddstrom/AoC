const fs = require('fs');

function range(str) {
    const [start, end] = [Number(str.split('-')[0]), Number(str.split('-')[1])];
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
}

function parseFields(input) {
    return input
        .slice(0, input.indexOf('your ticket:') - 1)
        .map(line => {
            const data = line.split(':');
            return {
                name: data[0],
                values: [...new Set([
                    ...range(data[1].split(' ')[1]),
                    ...range(data[1].split(' ')[3])
                ])],
            };
        });
}

function parseYourTicket(input) {
    return input
        .slice(input.indexOf('your ticket:') + 1, input.indexOf('your ticket:') + 2)
        .map(ticket => ticket.split(',').map(Number))
        .flat();
}

function parseNearbyTickets(input) {
    return input
        .slice(input.indexOf('nearby tickets:') + 1)
        .map(ticket => ticket.split(',').map(Number));
}

function isValid(ticket, validValues) {
    return ticket.reduce((valid, number) => valid & validValues.includes(number), true);
}

function findMatchingField(el, fields) {
    const candidateFields = [...fields].filter(field =>
        el.reduce((acc, curr) => acc & field.values.includes(curr), true));

    if (candidateFields.length === 1) {
        fields.delete(candidateFields[0]);
        return candidateFields[0].name;
    }
}

function getFieldIndexes(ticketElements, fields) {
    let fieldsSet = new Set(fields);
    const fieldIndexes = new Map();
    while (ticketElements.find(el => el !== null) !== undefined) {
        ticketElements.forEach((el, index) => {
            if (el !== null) {
                const match = findMatchingField(el, fieldsSet);
                if (match) {
                    fieldIndexes.set(match, index);
                    ticketElements[index] = null;
                }
            }
        });
    }
    return fieldIndexes;
}

fs.readFile('Day16/puzzle_input', 'utf8', function (err, contents) {
    const input = contents.split('\n');

    const fields = parseFields(input);
    const yourTicket = parseYourTicket(input);
    const nearbyTickets = parseNearbyTickets(input);
    const validValues = [...new Set(fields.map(f => f.values).flat())].sort((a, b) => a - b);

    const ticketScanningErrorRate = nearbyTickets
        .map(ticket => ticket.filter(val => !validValues.includes(val)))
        .flat().reduce((acc, curr) => acc + curr, 0);

    const validTickets = [yourTicket, ...nearbyTickets.filter(ticket => isValid(ticket, validValues))];

    // grouping together the first number of every ticket in one array, 
    // second number in another, and so on.
    const ticketElements = [];
    for (let i = 0; i < yourTicket.length; i++) {
        const ticketElement = [];
        validTickets.forEach(ticket => ticketElement.push(ticket[i]));
        ticketElements.push(ticketElement);
    }

    const fieldIndexes = getFieldIndexes(ticketElements, fields);
    const departureKeys = Array.from(fieldIndexes.keys()).filter(key => key.startsWith('departure'));
    const departureKeysFactor = departureKeys.reduce((acc, key) => acc * yourTicket[fieldIndexes.get(key)], 1);

    console.log('Part 1:', ticketScanningErrorRate);
    console.log('Part 2:', departureKeysFactor);
});
