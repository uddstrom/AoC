const fs = require('fs');

const countValidPasswords = (passwords) => {
    return passwords.reduce((validCount, password) => {
        const { min, max, char, pwd } = password;
        const cnt = (pwd.match(new RegExp(char, 'g')) || []).length;
        const isValid = min <= cnt && cnt <= max;
        return isValid ? validCount + 1 : validCount;
    }, 0);
};

const countValidPasswords2 = (passwords) => {
    return passwords.reduce((validCount, password) => {
        const { min: pos1, max: pos2, char, pwd } = password;
        const isValid = (pwd[pos1 - 1] === char) ^ (pwd[pos2 - 1] === char);
        return isValid ? validCount + 1 : validCount;
    }, 0);
};

fs.readFile('Day02/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\r\n').map((row) => {
        return {
            min: Number(row.split(' ')[0].split('-')[0]),
            max: Number(row.split(' ')[0].split('-')[1]),
            char: row.split(' ')[1].replace(':', ''),
            pwd: row.split(' ')[2],
        };
    });
    console.log('Part 1:', countValidPasswords(puzzle_input));
    console.log('Part 2:', countValidPasswords2(puzzle_input));
});
