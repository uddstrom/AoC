import { ascending, getData, getPath, max, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    function parse(output, tree = []) {
        if (output.length <= 0) return tree;

        var line = output.shift();

        if (line === '$ cd /') return [parse(output)];
        if (line === '$ cd ..') return tree;
        if (line.startsWith('$ cd ')) tree.push(parse(output));
        else {
            var file = parseInt(line);
            if (!isNaN(file)) tree.push(file);
        }

        return parse(output, tree);
    }

    return parse(input.split('\n'));
}

function calcDirSizes(fileSystem) {
    var dir_sizes = [];
    function calcSize(dir) {
        var sum = 0;
        dir.forEach((file) => {
            sum += typeof file === 'object' ? calcSize(file) : file;
        });
        dir_sizes.push(sum);
        return sum;
    }
    calcSize(fileSystem);
    return dir_sizes;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var dirSizes = calcDirSizes(data);
var minToDelete = 30000000 - (70000000 - max(dirSizes));

var p1 = sum(dirSizes.filter((d) => d < 100000));
var p2 = dirSizes.filter((d) => d > minToDelete).sort(ascending)[0];

console.log('Part 1:', p1);
console.log('Part 2:', p2);
