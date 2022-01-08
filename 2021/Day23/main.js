var COLS = 13;
var ROWS = 7;
var W = 50;
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
    createCanvas(COLS * W, ROWS * W);
    setupTiles();
    setupAmphipods();
}

function setupTiles() {
    rng(ROWS).forEach((row) => {
        rng(COLS).forEach((col) => {
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
        let dest = getClickedTile();
        if (!dest.wall && !isNoStop(dest) && !isOccupied(dest)) {
            if (amphipod.row === 1 && dest.row === 1) {
                alert('Not allowed to move in corridor');
            } else if (dest.room && dest.room !== amphipod.type) {
                alert('Not allowed to enter that room');
            } else if (dest.room && !isCleanRoom(dest)) {
                alert('Room must only contain one type');
            } else if (checkPath(amphipod, dest)) {
                alert('Other amphipod(s) blocking path');
            } else {
                let d = distance(
                    { row: amphipod.row, col: amphipod.col },
                    dest
                );
                energyConsumption += d * amphipodEnergy.get(amphipod.type);
                amphipod.row = dest.row;
                amphipod.col = dest.col;
            }
        }
    } else {
        let row = getIndex(mouseY);
        let col = getIndex(mouseX);
        let amphipod = amphipods.find((a) => a.row === row && a.col === col);
        if (amphipod) amphipod.active = true;
    }
}

function checkPath(from, to) {
    let pathTiles = [];
    if (from.row > 1) {
        range(from.row - 1, 1).forEach((row) =>
            pathTiles.push({ row, col: from.col })
        );
    }
    if (from.col < to.col) {
        range(from.col + 1, to.col).forEach((col) =>
            pathTiles.push({ row: 1, col })
        );
    }
    if (from.col > to.col) {
        range(from.col - 1, to.col).forEach((col) =>
            pathTiles.push({ row: 1, col })
        );
    }
    if (to.row > 1) {
        range(to.row, 1).forEach((row) => pathTiles.push({ row, col: to.col }));
    }
    for (let { row, col } of pathTiles) {
        if (amphipods.some((a) => a.row === row && a.col === col)) return true;
    }
    return false;
}

function distance(from, to) {
    if (from.row > 1) {
        return Math.abs(from.row - 1) + distance({ row: 1, col: from.col }, to);
    }
    return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

function getClickedTile() {
    let row = getIndex(mouseY);
    let col = getIndex(mouseX);
    let tile = grid.find((tile) => tile.row === row && tile.col === col);
    return tile;
}

function getIndex(coord) {
    return Math.floor(coord / W);
}

function isOccupied(tile) {
    for (let a of amphipods) {
        if (tile.row === a.row && tile.col === a.col) {
            // alert("Can't go - occupied");
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
    if (row < 2 || row === ROWS - 1) return false;
    if (col === 3) return 'A';
    if (col === 5) return 'B';
    if (col === 7) return 'C';
    if (col === 9) return 'D';
}

function isCleanRoom(tile) {
    for (let a of amphipods) {
        if (a.col === tile.col && a.type !== tile.room) return false;
    }
    return true;
}

function Tile(row, col, wall = false) {
    this.row = row;
    this.col = col;
    this.wall = wall;
    this.room = isRoom(row, col);

    this.draw = function () {
        let x = this.col * W;
        let y = this.row * W;
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

        rect(x, y, W, W);
    };
}

function Amphipod(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.active = false;

    this.draw = function () {
        let color = amphipodColors.get(this.type).slice();
        let x = this.col * W;
        let y = this.row * W;
        colorMode(RGB, 255);
        if (this.active) fill(...color.map((v) => v + 80));
        else fill(...color);
        rect(x, y, W, W);
        noStroke();
        fill(255, 255, 255, 200);
        textSize(32);
        text(this.type, x + W / 2 - 10, y + W / 2 + 10);
        stroke(255);
    };
}
