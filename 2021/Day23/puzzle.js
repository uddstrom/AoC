var OPTIMIZED_ENERGY_CONSUMPTION;
var COLS = 13;
var ROWS = 7;
var W = 50;
var grid = [];
var amphipods = [];
var energyConsumption = 0;
var amphipodEnergy = new Map([
    ['A', 1],
    ['B', 10],
    ['C', 100],
    ['D', 1000],
]);

function setup() {
    createCanvas(COLS * W, ROWS * W);
    setupTiles();
    setupAmphipods();
}

function draw() {
    background(255);
    grid.forEach((tile) => tile.draw());
    amphipods.forEach((amphipod) => amphipod.draw());
    printEnergyConsumption();
}

function mouseClicked() {
    let clickedTile = getClickedTile();
    if (!clickedTile) return;
    let activePod = amphipods.find((a) => a.active);
    if (activePod) makeMove(activePod, clickedTile);
    else activatePod(clickedTile);
}

function setupTiles() {
    rng(ROWS).forEach((row) => {
        rng(COLS).forEach((col) => {
            grid.push(new Tile(row, col));
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

    OPTIMIZED_ENERGY_CONSUMPTION = calculateOptimizedEnergyConsumption(
        amphipods
    );
}

function calculateOptimizedEnergyConsumption(amphipods) {
    // Todo: code solution algorithm
    return 48759;
}

function printEnergyConsumption() {
    strokeWeight(0);
    fill(176, 255, 250);
    textSize(12);
    text(energyConsumption, 5, 20);
    strokeWeight(1);
}

function activatePod(clickedTile) {
    let amphipod = amphipods.find(
        (a) => a.row === clickedTile.row && a.col === clickedTile.col
    );
    if (amphipod) amphipod.active = true;
}

function makeMove(amphipod, destination) {
    amphipod.active = false;
    if (!destination.wall) {
        if (
            destination.row === amphipod.row &&
            destination.col === amphipod.col
        )
            return;
        if (checkPath(amphipod, destination))
            return alert('Other amphipod(s) blocking path.');
        if (amphipod.row === 1 && destination.row === 1)
            return alert('Not allowed to move in corridor.');
        if (isRoomEntry(destination)) return alert('Cannot stop outside room.');
        if (destination.roomType && destination.roomType !== amphipod.type)
            return alert('Not allowed to enter that room.');
        if (destination.roomType && isDirtyRoom(destination))
            return alert('Room must only contain one amphipod type.');

        energyConsumption +=
            distance(amphipod, destination) * amphipodEnergy.get(amphipod.type);
        amphipod.row = destination.row;
        amphipod.col = destination.col;
        evalState();
    }
}

function evalState() {
    function inCorrectRoom({ row, col, type }) {
        return (
            grid.find((tile) => tile.col === col && tile.row === row)
                .roomType === type
        );
    }

    if (amphipods.every(inCorrectRoom)) {
        if (energyConsumption > OPTIMIZED_ENERGY_CONSUMPTION)
            alert('Great job! But you can do better!');
        else alert('Perfect! Optimal solution found.');
    }
}

function checkPath(from, to) {
    return buildPath(from, to).some(({ row, col }) =>
        amphipods.some((a) => a.row === row && a.col === col)
    );
}

function buildPath(from, to) {
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
    return pathTiles;
}

function distance(from, to) {
    if (from.row > 1) {
        return Math.abs(from.row - 1) + distance({ row: 1, col: from.col }, to);
    }
    return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

function getClickedTile() {
    let row = Math.floor(mouseY / W);
    let col = Math.floor(mouseX / W);
    return grid.find((tile) => tile.row === row && tile.col === col);
}

function isDirtyRoom({ col, roomType }) {
    return amphipods.some((a) => a.col === col && a.type !== roomType);
}
