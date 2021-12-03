export function parser(input) {
    return input.split('\n').map((row) => row.split(''));
}

export function printMaze(maze) {
    maze.forEach((row) => console.log(row.join('')));
}

export function printPath(path) {
    var strP = '';
    for (var i = 0; i < path.length; i++) {
        if (i === 0) strP += `(${path[i].node})`;
        else strP += `--${path[i].g}--(${path[i].node})`;
    }
    console.log(strP);
}

export function isWall(value) {
    return value === '#';
}

export function isRobot(value) {
    return '&£$€'.includes(value);
}

export function isDoor(value) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(value);
}

export function isKey(value) {
    return 'abcdefghijklmnopqrstuvwxyz'.includes(value);
}
