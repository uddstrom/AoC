function rng(length) {
    return Array(length)
        .fill()
        .map((_, idx) => idx);
}