import { TILE_ID } from './render.js';

export class Map {
    constructor(rows, cols) {
        this.map = Array(rows);
        for (var r = 0; r < rows; r++) {
            this.map[r] = Array(cols);
            for (var c = 0; c < cols; c++) {
                this.map[r][c] = 0;
            }
        }
    }

    update(x, y, status) {
        if (this.map[y][x] === TILE_ID.OXYGEN) {
            return;
        }
        this.map[y][x] = status === 0 ? TILE_ID.WALL : status === 1 ? TILE_ID.VISITED : TILE_ID.OXYGEN;
    }
}
