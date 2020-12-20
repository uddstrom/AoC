const fs = require('fs');

const createPassportObject = (passportString) => {
    let pObj = {};
    passportString.split(' ').forEach((field) => {
        const key = field.split(':')[0];
        const value = field.split(':')[1];
        pObj[key] = value;
    });
    return pObj;
};

const parse = (puzzle_input) => {
    const passports = [];
    let passport = '';
    while (puzzle_input.length > 0) {
        const nextLine = puzzle_input.shift();
        if (nextLine.length > 0) {
            passport += ` ${nextLine}`;
        } else {
            passports.push(passport.trim());
            passport = '';
        }
    }
    passports.push(passport.trim());

    return passports.map(createPassportObject);
};

const validators = {
    byr: (value) => Number(value) >= 1920 && Number(value) <= 2002,
    iyr: (value) => Number(value) >= 2010 && Number(value) <= 2020,
    eyr: (value) => Number(value) >= 2020 && Number(value) <= 2030,
    hgt: (value) => {
        try {
            const h = Number(value.replace('cm', '').replace('in', ''));
            if (value.endsWith('cm')) return h >= 150 && h <= 193;
            if (value.endsWith('in')) return h >= 59 && h <= 76;
            return false;
        } catch {
            return false;
        }
    },
    hcl: (value) => /#[0-9a-f]{6}/.test(value),
    ecl: (value) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(value),
    pid: (value) => /^\d{9}$/.test(value),
};

const validate = (passport) => {
    let isValid = true;
    Object.keys(validators).forEach((field) => {
        if (validators[field](passport[field]) === false) isValid = false;
    });
    return isValid;
};

fs.readFile('Day04/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\n');
    const passports = parse(puzzle_input);
    const validPassports = passports.reduce((acc, p) => (validate(p) ? acc + 1 : acc), 0);
    console.log('Valid passports:', validPassports);
});
