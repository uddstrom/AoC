import { getData, getPath, max, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => {
        var { game } = line.match(/Game \d*: (?<game>.*)/).groups;
        return game.split('; ').map((set) => {
            return set.split(', ').map((subset) => {
                var [n, color] = subset.split(' ');
                return { n: Number(n), color };
            });
        });
    });
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var power = 0;
var possibleGames = data.map((game, i) => {
    var maxRed = max(game.map((set) => set.find(({ color }) => color === 'red')?.n || 0));
    var maxGreen = max(game.map((set) => set.find(({ color }) => color === 'green')?.n || 0));
    var maxBlue = max(game.map((set) => set.find(({ color }) => color === 'blue')?.n || 0));
    power += maxRed * maxGreen * maxBlue;
    return maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14 ? i + 1 : 0;
});

console.log('Part 1:', sum(possibleGames));
console.log('Part 2:', power);
