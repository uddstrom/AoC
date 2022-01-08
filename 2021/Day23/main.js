var cols = 13;
var rows = 5;
var w = 50;
var grid = [];
var amphipods = [];
var amphipodColors = new Map([
    ['A', [255, 0, 255, 100]],
    ['B', [235, 64, 52, 100]],
    ['C', [140, 235, 52, 100]],
    ['D', [52, 235, 220, 100]],
]);

function setup() {
    createCanvas(cols * w, rows * w);
    setupTiles();
    setupAmphipods();
    console.log(grid);
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
    amphipods.push(new Amphipod(2, 5, 'A'));
    amphipods.push(new Amphipod(2, 7, 'A'));
    amphipods.push(new Amphipod(2, 9, 'D'));
    amphipods.push(new Amphipod(3, 3, 'C'));
    amphipods.push(new Amphipod(3, 5, 'C'));
    amphipods.push(new Amphipod(3, 7, 'B'));
    amphipods.push(new Amphipod(3, 9, 'B'));
}

function draw() {
    background(80);
    grid.forEach((tile) => tile.draw());
    amphipods.forEach((amphipod) => amphipod.draw());
}

function mousePressed() {
    let row = getIndex(mouseY);
    let col = getIndex(mouseX);
    let amphipod = amphipods.find((a) => a.row === row && a.col === col);
    if (amphipod) amphipod.active = true;
}

function mouseReleased() {
    amphipod = amphipods.find((a) => a.active);
    if (amphipod) {
        amphipod.active = false;
        let tile = getTile();
        if (!tile.wall && !tile.noStop) {
            amphipod.row = tile.row;
            amphipod.col = tile.col;
        }
    }
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

function isWall(row, col) {
    if (row === 0 || row === 4 || col === 0 || col === 12) return true;
    if (row > 1) {
        if (col < 3 || col > 9) return true;
        if (col === 4 || col === 6 || col === 8) return true;
    }
    return false;
}

function Tile(row, col, wall = false) {
    this.row = row;
    this.col = col;
    this.wall = wall;
    this.noStop =
        row === 1 && (col === 3 || col === 5 || col === 7 || col === 9);

    this.draw = function () {
        let x = this.col * w;
        let y = this.row * w;
        stroke(255);
        this.wall ? fill(23) : noFill();
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
        if (this.active) color[3] = 200;
        stroke(255);
        fill(...color);
        rect(x, y, w, w);
        textSize(32);
        text(this.type, x + w / 2 - 10, y + w / 2 + 10);
    };
}

// Four types of amphipods live there: Amber (A), Bronze (B), Copper (C), and Desert (D).
