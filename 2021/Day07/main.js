// import { getData, getPath } from '../lib/utils.js';

// var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

// function parser(input) {
//     return input
//         .split(',')
//         .map(Number);
// }

// function main() {
//     var data = getData(PUZZLE_INPUT_PATH)(parser);

//     console.log('Part 1:', data);
//     console.log('Part 2:', );
// }

// main();

// https://adventofcode.com/2021/day/7/input

import * as https from 'https';

// const https = require('https');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const options = {
    hostname: 'adventofcode.com',
    port: 443,
    path: '/2021/day/7/input',
    method: 'GET',
    headers: {
        'Set-Cookie':
            '',
        'Content-Type': 'text/plain',
    },
};

const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
