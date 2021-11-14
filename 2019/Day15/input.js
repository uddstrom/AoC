import Keyboard from './KeyboardState.js';

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

export function setupKeyboard(droid) {
    const input = new Keyboard();

    input.addMapping('ArrowRight', (keyState) => {
        if (keyState) droid.move(EAST);
    });

    input.addMapping('ArrowLeft', (keyState) => {
        if (keyState) droid.move(WEST);
    });

    input.addMapping('ArrowUp', (keyState) => {
        if (keyState) droid.move(NORTH);
    });

    input.addMapping('ArrowDown', (keyState) => {
        if (keyState) droid.move(SOUTH);
    });

    return input;
}
