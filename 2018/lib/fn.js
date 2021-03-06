function add(x, y) {
    return x + y;
}

function compose(...fns) {
    if (fns.length === 2) return composeTwo(...fns);
    if (fns.length === 3) return composeThree(...fns);
    throw Error('Too many arguments');
}

function composeTwo(fn2, fn1) {
    return function composed(value) {
        return fn2(fn1(value));
    }
}

function composeThree(fn3, fn2, fn1) {
    return function composed(value) {
        return fn3(fn2(fn1(value)));
    }
}

function count(array) {
    return element => array.filter(el => el === element).length;
}

function eq(j) {
    return i => i === j;
}

function trampoline(fn) {
    return function trampolined(...args) {
        var result = fn(...args);
        while (typeof result == "function") {
            result = result();
        }
        return result;
    }
}


module.exports = {
    add,
    compose,
    count,
    eq,
    trampoline
};
