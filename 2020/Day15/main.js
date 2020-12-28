const input = [2, 0, 1, 7, 4, 14, 18];

function memory(nth) {
    let currentIndex = input.length - 1;
    let currentValue = input[currentIndex];
    const visited = new Map();
    input.forEach((n, idx) => visited.set(n, idx));

    while (currentIndex < nth - 1) {
        const lastIndex = visited.get(currentValue);
        visited.set(currentValue, currentIndex);
        currentValue = lastIndex === undefined ? 0 : currentIndex - lastIndex;
        currentIndex++;
    }
    return currentValue;
}

console.log('Part 1:', memory(2020));
console.log('Part 2:', memory(30000000));
