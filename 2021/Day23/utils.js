function rng(length) {
    return Array(length)
        .fill()
        .map((_, idx) => idx);
}

function range(start, end) {
    if (start > end) {
        return Array(start - end + 1)
            .fill()
            .map((_, idx) => start - idx);
    }
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}
