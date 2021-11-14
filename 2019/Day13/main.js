import IntcodeComputer from './IntcodeComputer.js';
import Timer from './Timer.js';

const readPuzzleInput = (file) => {
    return new Promise((resolve, reject) => {
        fetch(file)
            .then((response) => response.text())
            .then((contents) => {
                contents
                    ? resolve(contents.split(',').map(Number))
                    : reject('Error reading file');
            });
    });
};

const FRAME_RATE = 1 / 25;
const TILE_SIZE = 16;
const TILE_ID = {
    EMPTY: 0,
    WALL: 1,
    BLOCK: 2,
    HORIZONTAL_PADLE: 3,
    BALL: 4,
};

const game = (code) => {
    code[0] = 2; // Play for free!
    const computer = IntcodeComputer(code);
    let x, y, tileId, done;
    let blockCount = 0;
    let score = 0;
    let joystick = 0;
    let ball = { x: 0, y: 0 };
    let paddleX = 0;
    const gameEvents = [];
    computer.next();
    while (true) {
        ({ value: x } = computer.next(joystick));
        ({ value: y } = computer.next(joystick));
        ({ value: tileId, done } = computer.next(joystick));
        if (done) {
            break;
        }
        gameEvents.push({ x, y, tileId });
        score = x === -1 && y === 0 ? tileId : score;
        ball.x = tileId === TILE_ID.BALL ? x : ball.x;
        ball.y = tileId === TILE_ID.BALL ? y : ball.y;
        paddleX = tileId === TILE_ID.HORIZONTAL_PADLE ? x : paddleX;
        joystick = ball.x < paddleX ? -1 : ball.x > paddleX ? 1 : 0;
        blockCount += tileId === TILE_ID.BLOCK ? 1 : 0;
    }
    console.log('BLOCKS:', blockCount);
    console.log('SCORE:', score);
    return gameEvents;
};

const updateState = (events) => {
    if (events && events.length > 0) {
        let e;
        do {
            e = events.shift();
            if (e.x === -1 && e.y === 0) {
                score = e.tileId;
            } else {
                state[e.y][e.x] = e.tileId;
            }
        } while (e.tileId !== TILE_ID.BALL && events.length > 0);
    }
};

const renderGameState = (state) => {
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    state.map((row, y) => {
        row.map((tileId, x) => {
            switch (tileId) {
                case TILE_ID.EMPTY:
                    drawEmpty(x, y, ctx);
                    break;
                case TILE_ID.WALL:
                    drawWall(x, y, ctx);
                    break;
                case TILE_ID.BLOCK:
                    drawBlock(x, y, ctx);
                    break;
                case TILE_ID.BALL:
                    drawBall(x, y, ctx);
                    break;
                case TILE_ID.HORIZONTAL_PADLE:
                    drawPaddle(x, y, ctx);
                    break;
                default:
                    break;
            }
        });
    });
    drawScore(score, ctx);
};

const drawEmpty = (x, y, ctx) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawWall = (x, y, ctx) => {
    ctx.fillStyle = 'cyan';
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawBlock = (x, y, ctx) => {
    const colors = ['#cc66cc', '#ff3399', '#cc99cc'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawBall = (x, y, ctx) => {
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.arc(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2,
        0,
        Math.PI * 2,
        true
    );
    ctx.fill();
};

const drawPaddle = (x, y, ctx) => {
    ctx.fillStyle = '#00ff99';
    ctx.fillRect(x * TILE_SIZE - TILE_SIZE / 2, y * TILE_SIZE, TILE_SIZE * 2, 2);
};

const drawScore = (score, ctx) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(TILE_SIZE * 38, 0, 96, 16);
    ctx.fillStyle = 'cyan';
    ctx.font = '20px monospace';
    ctx.fillText(score.toString().padStart(7, '0'), TILE_SIZE * 38 + 10, 16);
};

const getInitialState = (r, c) => [...Array(r)].map((e) => Array(c).fill(0));

let state = getInitialState(26, 46);
let score = 0;

const main = async () => {
    const file = '/puzzle_input';
    try {
        const puzzle_input = await readPuzzleInput(file);
        const events = game(puzzle_input);
        let eventsCopy = [];
        
        const timer = new Timer(1 / 30);
        timer.update = (deltaTime) => {
            if (eventsCopy.length === 0) {
                // restart
                state = getInitialState(26, 46);
                eventsCopy = [...events];
            }
            updateState(eventsCopy);
            renderGameState(state);
        };
        timer.start();
    } catch (err) {
        console.error(err);
    }
};

main();
