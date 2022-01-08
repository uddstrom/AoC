var cols = 13;
var rows = 7;
var w = 50;
var grid = [];
var amphipods = [];
var corridorColor = [140, 140, 140, 255];
var amphipodColors = new Map([
    ['A', [204, 153, 0, 255]], // yellowish
    ['B', [204, 51, 153, 255]], // redish
    ['C', [51, 153, 51, 255]], // greenish
    ['D', [0, 153, 153, 255]], // blueish
]);
var amphipodEnergy = new Map([
    ['A', 1],
    ['B', 10],
    ['C', 100],
    ['D', 1000],
]);
let energyConsumption = 0;

function setup() {
    createCanvas(cols * w, rows * w);
    setupTiles();
    setupAmphipods();
}

function setupTiles() {
    rng(rows).forEach((row) => {
        rng(cols).forEach((col) => {
            grid.push(new Tile(row, col, isWall(row, col)));
        });
    });
}

function setupAmphipods() {
    amphipods.push(new Amphipod(2, 3, 'D'));
    amphipods.push(new Amphipod(3, 3, 'D'));
    amphipods.push(new Amphipod(4, 3, 'D'));
    amphipods.push(new Amphipod(5, 3, 'C'));

    amphipods.push(new Amphipod(2, 5, 'A'));
    amphipods.push(new Amphipod(3, 5, 'C'));
    amphipods.push(new Amphipod(4, 5, 'B'));
    amphipods.push(new Amphipod(5, 5, 'C'));

    amphipods.push(new Amphipod(2, 7, 'A'));
    amphipods.push(new Amphipod(3, 7, 'B'));
    amphipods.push(new Amphipod(4, 7, 'A'));
    amphipods.push(new Amphipod(5, 7, 'B'));

    amphipods.push(new Amphipod(2, 9, 'D'));
    amphipods.push(new Amphipod(3, 9, 'A'));
    amphipods.push(new Amphipod(4, 9, 'C'));
    amphipods.push(new Amphipod(5, 9, 'B'));
}

function draw() {
    background(255);
    grid.forEach((tile) => tile.draw());
    amphipods.forEach((amphipod) => amphipod.draw());
    strokeWeight(0);
    fill(176, 255, 250);
    textSize(12);
    text(energyConsumption, 5, 20);
    strokeWeight(1);
}

function mouseClicked() {
    amphipod = amphipods.find((a) => a.active);
    if (amphipod) {
        amphipod.active = false;
        let tile = getTile();
        if (!tile.wall && !isNoStop(tile) && !isOccupied(tile)) {
            if (tile.room && tile.room !== amphipod.type) {
                alert('Not allowed to enter that room');
            } else {
                let d = distance(
                    { row: amphipod.row, col: amphipod.col },
                    tile
                );
                energyConsumption += d * amphipodEnergy.get(amphipod.type);
                amphipod.row = tile.row;
                amphipod.col = tile.col;
            }
        }
    } else {
        let row = getIndex(mouseY);
        let col = getIndex(mouseX);
        let amphipod = amphipods.find((a) => a.row === row && a.col === col);
        if (amphipod) amphipod.active = true;
    }
}

function distance(from, to) {
    if (from.row > 1) {
        return Math.abs(from.row - 1) + distance({ row: 1, col: from.col }, to);
    }
    return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

function getTile() {
    let row = getIndex(mouseY);
    let col = getIndex(mouseX);
    let tile = grid.find((tile) => tile.row === row && tile.col === col);
    return tile;
}

function getIndex(coord) {
    return Math.floor(coord / w);
}

function isOccupied(tile) {
    for (let a of amphipods) {
        if (tile.row === a.row && tile.col === a.col) {
            alert("Can't go - occupied");
            return true;
        }
    }
    return false;
}

function isNoStop({ row, col }) {
    let isNoStopTile =
        row === 1 && (col === 3 || col === 5 || col === 7 || col === 9);
    if (isNoStopTile) alert('Not allowed');
    return isNoStopTile;
}

function isWall(row, col) {
    if (row === 0 || row === 6 || col === 0 || col === 12) return true;
    if (row > 1) {
        if (col < 3 || col > 9) return true;
        if (col === 4 || col === 6 || col === 8) return true;
    }
    return false;
}

function isRoom(row, col) {
    if (row < 2 || row === rows - 1) return false;
    if (col === 3) return 'A';
    if (col === 5) return 'B';
    if (col === 7) return 'C';
    if (col === 9) return 'D';
}

function Tile(row, col, wall = false) {
    this.row = row;
    this.col = col;
    this.wall = wall;
    this.room = isRoom(row, col);

    this.draw = function () {
        let x = this.col * w;
        let y = this.row * w;
        let color = amphipodColors.get(this.room);
        if (color === undefined) {
            // corridor
            color = corridorColor;
        } else {
            color = [...color];
            color[3] = 100;
        }

        stroke(255);
        if (this.wall) fill(30);
        else fill(...color);

        rect(x, y, w, w);
    };
}

function Amphipod(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.active = false;

    this.draw = function () {
        let color = amphipodColors.get(this.type).slice();
        let x = this.col * w;
        let y = this.row * w;
        colorMode(RGB, 255);
        if (this.active) fill(...color.map((v) => v + 80));
        else fill(...color);
        rect(x, y, w, w);
        noStroke();
        fill(255, 255, 255, 200);
        textSize(32);
        text(this.type, x + w / 2 - 10, y + w / 2 + 10);
        stroke(255);
    };
}

// Four types of amphipods live there: Amber (A), Bronze (B), Copper (C), and Desert (D).
