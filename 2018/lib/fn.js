function add(x, y) {
    return x + y;
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


module.exports = { add, trampoline };
