export function makeGrid(r, c, initVal = 0) {
    return Array(r).fill().map(() => Array(c).fill(initVal));
}

export function getNeighbors(M) {
    return function({ r, c }) {
        let neighbors = [];
        if (r > 0) neighbors.push(M[r - 1][c]); // top
        if (c + 1 < M[0].length) neighbors.push(M[r][c + 1]); // right
        if (r + 1 < M.length) neighbors.push(M[r + 1][c]); // bottom
        if (c > 0) neighbors.push(M[r][c - 1]); // left
        return neighbors;
    };
}

export function printGrid(G) {
    G.forEach(row => console.log(row.join('')));
}
