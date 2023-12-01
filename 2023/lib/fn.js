export function add(x, y) {
    return x + y;
}

export function compose(...fns) {
    if (fns.length === 2) return composeTwo(...fns);
    if (fns.length === 3) return composeThree(...fns);
    throw Error('Too many arguments');
}

export function composeTwo(fn2, fn1) {
    return function composed(value) {
        return fn2(fn1(value));
    };
}

export function composeThree(fn3, fn2, fn1) {
    return function composed(value) {
        return fn3(fn2(fn1(value)));
    };
}

export function count(array) {
    return (element) => array.filter((el) => el === element).length;
}

export function eq(j) {
    return (i) => i === j;
}

export function not(fn) {
    return function inverted(...args) {
        return !fn(...args);
    };
}

export function flip(fn) {
    return function flipped(arg1, arg2, ...args) {
        return fn(arg2, arg1, ...args);
    };
}

export function trampoline(fn) {
    return function trampolined(...args) {
        var result = fn(...args);
        while (typeof result == 'function') {
            result = result();
        }
        return result;
    };
}
