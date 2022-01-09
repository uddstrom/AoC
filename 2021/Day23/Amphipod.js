var amphipodColors = new Map([
    ['A', [204, 153, 0, 255]], // yellowish
    ['B', [204, 51, 153, 255]], // redish
    ['C', [51, 153, 51, 255]], // greenish
    ['D', [0, 153, 153, 255]], // blueish
]);

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
