class Point {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vec {
    constructor(initial, terminal) {
        this.x = terminal.x - initial.x;
        this.y = terminal.y - initial.y;
        this.size = 1;
        this.dir = this.angle();
    }

    angle() {
        if (this.x === 0 && this.y > 0) {
            // Straight up
            return 0;
        }
        if (this.y === 0 && this.x > 0) {
            // Straight right
            return Math.PI / 2;
        }
        if (this.x === 0 && this.y < 0) {
            // Straight down
            return Math.PI;
        }
        if (this.y === 0 && this.x < 0) {
            // Straight left
            return 3 * Math.PI / 2;
        }
        const O = Math.atan(this.x / this.y);
        if (this.x < 0 && this.y > 0) {
            return O + 2 * Math.PI;
        }
        if (this.y < 0) {
            return O + Math.PI;
        }
        return O;
    }
}

module.exports = { Point, Vec };
