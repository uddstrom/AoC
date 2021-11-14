import { renderDroid, renderMap } from './render.js';

import { Droid } from './Droid.js';
import { Map } from './map.js';
import Timer from './Timer.js';
import { setupKeyboard } from './input.js';

// north (1), south (2), west (3), and east (4)
const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

export const game = (code) => {
    const startTile = {
        x: 25,
        y: 25
    };

    const droid = new Droid(startTile.x, startTile.y, code);
    const map = new Map(50, 50);
    map.update(startTile.x, startTile.y, 1);

    const input = setupKeyboard(droid);
    input.listenTo(window);

    const timer = new Timer(1 / 30);
    timer.update = (deltaTime) => {
        renderMap(map.map);
        renderDroid(droid);
    };
    timer.start();

    let oxFound = false;
    let max = 0;
    const explore = (lastStep, steps) => {
        [NORTH, EAST, SOUTH, WEST].forEach((dir) => {
            if (dir !== getOpposit(lastStep)) {
                const feedback = droid.move(dir);
                map.update(feedback.x, feedback.y, feedback.status);
                if (feedback.status === 2) {
                    console.log('Part I: Steps to oxygen', steps + 1);
                    oxFound = true;
                }
                if (feedback.status > 0) {
                    explore(dir, (steps || 0) + 1);
                }
            }
        });
        max = steps > max ? steps : max;
        // all dirs explored go back
        if (lastStep && !oxFound) {
            droid.move(getOpposit(lastStep));
        }
    };

    const getOpposit = (dir) => {
        switch (dir) {
            case NORTH:
                return SOUTH;
            case SOUTH:
                return NORTH;
            case EAST:
                return WEST;
            case WEST:
                return EAST;
        }
    };

    explore();
    oxFound = false;
    max = 0;
    explore();
    console.log('Part II: ', max);
};
