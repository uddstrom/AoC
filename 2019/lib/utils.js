import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function getData(path) {
    var contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    };
}

export function getPath(url) {
    return dirname(fileURLToPath(url));
}

export function pow(base) {
    return (exp) => Math.pow(base, exp);
}

export function sum(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}
