import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { not } from './fn.js';

export function getData(path) {
    var contents = fs.readFileSync(path, 'utf8').trim();
    return function parseContent(parser) {
        return parser(contents);
    };
}

export function getPath(url) {
    return dirname(fileURLToPath(url));
}

export function removeAt(array, index) {
    return array.slice(0, index).concat(array.slice(index + 1, array.length));
}

export function rng(length) {
    return Array(length)
        .fill()
        .map((_, idx) => idx);
}

// fills an array with numbers values from start to end
export function range(start, end) {
    if (start > end) {
        return Array(start - end + 1)
            .fill()
            .map((_, idx) => start - idx);
    }
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

export function matrix(r, c, initVal = 0) {
    return Array(r)
        .fill()
        .map(() => Array(c).fill(initVal));
}

export function count(el, arr) {
    return arr.filter((e) => e === el).length;
}

export function min(arr) {
    return Math.min(...arr);
}

export function max(arr) {
    return Math.max(...arr);
}

export function sum(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

export function product(arr) {
    return arr.reduce((acc, curr) => acc * curr);
}

export function isOdd(n) {
    return n % 2 === 1;
}

export var isEven = not(isOdd);

export var random = (max) => Math.floor(Math.random() * max);

// Generate all permutations of an array A,
// stores them in the set S and returns S.
export function generatePermutations(array) {
    function swap(arr, i, j) {
        var b = arr[j];
        arr[j] = arr[i];
        arr[i] = b;
    }

    function recursiveHeap(k, A, S) {
        if (k === 1) {
            S.add(A.join(','));
        } else {
            recursiveHeap(k - 1, A, S);
            for (var i = 0; i < k - 1; i++) {
                if (isEven(k)) swap(A, i, k - 1);
                else swap(A, 0, k - 1);
                recursiveHeap(k - 1, A, S);
            }
        }
    }
    let S = new Set();
    recursiveHeap(array.length, array.slice(), S);
    return S;
}

export function intersect(array1, array2) {
    return array1.filter((value) => array2.includes(value));
}

export var ascending = (a, b) => a - b;
export var descending = (a, b) => b - a;
export var triangularNumber = (n) => (n * (n + 1)) / 2;

// Greatest Common Divisor
export var gcd = (a, b) => (a == 0 ? b : gcd(b % a, a));
// Least Common Multiple
export var lcm = (a, b) => (a * b) / gcd(a, b);

// Returns LCM of array elements
export var lcmOfArray = (arr) => arr.reduce((acc, curr) => (curr * acc) / gcd(curr, acc));

// Fix for the javascript mod bug
// https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
export var mod = (x, y) => ((x % y) + y) % y;
