import { compose } from '../lib/fn.js';
import { getData, getPath, rng, count } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;
var parser = (input) => {
    let toBinary = (pixel) => (pixel === '#' ? 1 : 0);
    let [imgEnhancAlgStr, image] = input.split('\n\n');
    imgEnhancAlgStr = imgEnhancAlgStr.split('').map(toBinary);
    image = image.split('\n').map((line) => line.split('').map(toBinary));
    return [imgEnhancAlgStr, extendImage(image)];
};

function extendImage(image) {
    let line = rng(image[0].length).map(() => 0);
    image.unshift(line, line, line, line, line);
    image.push(line, line, line, line, line);
    return image.map((line) => [0, 0, 0, 0, 0, ...line, 0, 0, 0, 0, 0]);
}

function getIndex(img, r, c) {
    let DR = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
    let DC = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
    let inGrid = (rr, cc) =>
        0 <= rr && rr < img.length && 0 <= cc && cc < img[0].length;
    let bStr = rng(9)
        .map((i) => [r + DR[i], c + DC[i]])
        .map(([rr, cc]) => (inGrid(rr, cc) ? img[rr][cc] : undefined))
        .map((val) => (val === undefined ? img[0][0] : val))
        .join('');
    return parseInt(bStr, 2);
}

function createEnhancer(imageEnhancementAlgorithmString) {
    let enhance = (index) => imageEnhancementAlgorithmString[index];
    return function (image) {
        return image.map((row, r) =>
            row.map((_, c) => enhance(getIndex(image, r, c)))
        );
    };
}

function createDoubleEnhancer(imageEnhancementAlgorithmString) {
    let enhancer = createEnhancer(imageEnhancementAlgorithmString);
    return compose(extendImage, compose(enhancer, enhancer));
}

function main() {
    let [imgEnhancAlgStr, image] = getData(PUZZLE_INPUT_PATH)(parser);
    let doubleEnhancer = createDoubleEnhancer(imgEnhancAlgStr);

    let img2 = doubleEnhancer(image);
    let img50 = rng(25).reduce((acc, _) => doubleEnhancer(acc), image);

    console.log('Part 1:', count(1, img2.flat()));
    console.log('Part 2:', count(1, img50.flat()));
}

main();
