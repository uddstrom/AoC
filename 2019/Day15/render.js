const TILE_SIZE = 16;

export const TILE_ID = {
    EMPTY: 0,
    VISITED: 1,
    WALL: 2,
    DROID: 3,
    OXYGEN: 4,
};

export const renderDroid = (droid, distance) => {
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    const { x, y } = droid;
    
    drawDroid(x, y, ctx);
};

export const renderMap = (map) => {
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    map.map((row, y) => {
        row.map((tileId, x) => {
            switch (tileId) {
                case TILE_ID.EMPTY:
                    drawEmpty(x, y, ctx);
                    break;
                case TILE_ID.WALL:
                    drawWall(x, y, ctx);
                    break;
                case TILE_ID.VISITED:
                    drawVisited(x, y, ctx);
                    break;
                case TILE_ID.OXYGEN:
                    drawOxygen(x, y, ctx);
                    break;
                default:
                    break;
            }
        });
    });
    drawStart(25, 25, ctx);
};

const drawEmpty = (x, y, ctx) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawStart = (x, y, ctx) => {
    ctx.fillStyle = 'darkmagenta';
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawWall = (x, y, ctx) => {
    ctx.fillStyle = 'cyan';
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawVisited = (x, y, ctx) => {
    //const colors = ['#cc66cc', '#ff3399', '#cc99cc'];
    const colors = ['#ff3399'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawDroid = (x, y, ctx) => {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2,
        0,
        Math.PI * 2,
        true,
    );
    ctx.fill();
    drawCoordsAndDist(x, y, ctx);
};

const drawOxygen = (x, y, ctx) => {
    const colors = ['#58D68D', '#45B39D', '#21618C'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawCoordsAndDist = (x, y, ctx) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(TILE_SIZE * 25, 0, 128, 16);
    ctx.fillStyle = 'cyan';
    ctx.font = '20px monospace';
    ctx.fillText(`X=${x}, Y=${y}`, TILE_SIZE * 25 + 10, 16);
};
