var corridorColor = [140, 140, 140, 255];
var roomEntryColor = [100, 100, 100, 255];

function Tile(row, col) {
    this.row = row;
    this.col = col;
    this.wall = isWall(row, col);
    this.roomType = getRoomType(row, col);

    this.draw = function () {
        let x = this.col * W;
        let y = this.row * W;
        let color = amphipodColors.get(this.roomType);
        if (color === undefined) {
            if (isRoomEntry(this)) color = roomEntryColor;
            else color = corridorColor;
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

function isWall(row, col) {
    if (row === 0 || row === 6 || col === 0 || col === 12) return true;
    if (row > 1) {
        if (col < 3 || col > 9) return true;
        if (col === 4 || col === 6 || col === 8) return true;
    }
    return false;
}

function getRoomType(row, col) {
    if (row < 2 || row === ROWS - 1) return false;
    if (col === 3) return 'A';
    if (col === 5) return 'B';
    if (col === 7) return 'C';
    if (col === 9) return 'D';
}

function isRoomEntry({ row, col }) {
    return row === 1 && (col === 3 || col === 5 || col === 7 || col === 9);
}
