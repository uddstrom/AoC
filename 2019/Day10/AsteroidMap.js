const { Point, Vec } = require('./math');

const ASTEROID = '#';

class Asteroid {
    constructor(location) {
        this.location = location;   // Point
        this.neighbors = [];        // Vectors
        this.visibleNeighbors = 0;
    }

    addNeighbor(neighbor) {
        this.neighbors.push(neighbor);
    }
}

class AsteroidMap {
    // puzzle_input should be a matrix.
    /*
    [
        [ '.', '#', '.', '.', '#' ],
        [ '.', '.', '.', '.', '.' ],
        [ '#', '#', '#', '#', '#' ],
        [ '.', '.', '.', '.', '#' ],
        [ '.', '.', '.', '#', '#' ]
      ]
    */
    constructor(puzzle_input) {
        this.map = puzzle_input;
        this.asteroids = this.getAsteroids();
        this.detectAsteroids();
    }

    getAsteroids() {
        const asteroids = []; // array of point with astroid locations.
        this.map.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col === ASTEROID) {
                    asteroids.push(new Asteroid(new Point(x, this.map.length - y - 1)));
                }
            });
        });
        return asteroids;
    }

    detectAsteroids() {
        this.asteroids.map(asteroid => {
            this.getNeighbors(asteroid)
            asteroid.visibleNeighbors = this.countVisibleNeighbors(asteroid.neighbors);
        });
    }
    
    getNeighbors(asteroid) {
        this.asteroids.forEach(neighbor => {
            if (asteroid.location.x !== neighbor.location.x ||
                asteroid.location.y !== neighbor.location.y) {
                asteroid.addNeighbor(new Vec(asteroid.location, neighbor.location));
            }
        });
    }

    countVisibleNeighbors(neighbors) {
        const isVisible = (n) => {
            return !neighbors.some(n2 => n2.dir === n.dir && n2.size < n.size);
        }
        return neighbors.filter(n => isVisible(n)).length;
    }

    getBestMonitoringLocation() {
        const bestAsteroid = this.asteroids.reduce((acc, curr) => curr.visibleNeighbors > acc.visibleNeighbors ? curr : acc);
        return bestAsteroid;
    }

    startVaporizationFrom(asteroid) {
        const compare = (a, b) => {
            if (a.dir === b.dir) {
                // sort on vector size
                if (a.size > b.size) {
                    a.dir += 2 * Math.PI;
                } else {
                    b.dir += 2 * Math.PI;
                }
            }
            return a.dir - b.dir;
        };

        asteroid.neighbors.forEach(n1 => {
            const sameDir = asteroid.neighbors.filter(n2 => n1.dir === n2.dir);
            sameDir.sort((a, b) => a.size - b.size);
            sameDir.forEach((a, i) => a.dir = a.dir + 2 * Math.PI * i);
        });

        // Sort the neighboring
        asteroid.neighbors.sort(compare);

        asteroid.neighbors.forEach((a, i) => {
            const x = asteroid.location.x + a.x;
            const y = asteroid.location.y + a.y;
            const yInv = (this.map.length - 1) - y;
            if (i === 199) {
                console.log(`Part II: The 200th asteroid to be vaporized is at (${x}, ${(yInv)}), giving the answer ${x*100+yInv}`);
            }
        });
        
    }
}

module.exports = { AsteroidMap };