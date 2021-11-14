const IS_NODE_ENV = typeof window === 'undefined';

const readPuzzleInput = (file, split) => {
    return new Promise((resolve, reject) => {
        if (IS_NODE_ENV) {
            const fs = require("fs");
            fs.readFile(file, "utf8", function(err, contents) {
                contents
                    ? resolve(contents.split(split).map(str => parseInt(str)))
                    : reject('Error reading file');
            });
        } else {
            fetch(file)
            .then(response => response.text())
            .then(contents => {
                contents
                ? resolve(contents.split(split).map(str => parseInt(str)))
                : reject('Error reading file');
            });
        }
    });
};

const processPuzzleInput = (input, width, height) => {
    if(!width || !height) {
        throw new Error('Error processing input. Width and/or height missing.');
    }
    
    const rows = [];
    while (input.length > 0) {
        rows.push(input.splice(0, width));
    }
    
    const image = []; // Array of layers
    while (rows.length > 0) {
        const layer = rows.splice(0, height);
        image.push(layer);
    }
    
    return image;
};

const printImage = (image) => {
    image.forEach((layer, i) => {
        console.log(`Layer ${i}:`);
        printLayer(layer);
    });
}

const printLayer = (layer) => {
    layer.forEach(row => console.log(row.toString()));
}

const verifyImage = (image) => {
    const imageCopy = [...image];
    let layerWithFewestZeros = 0, minZeros = Number.MAX_VALUE;
    imageCopy.forEach((layer, i) => {
        const zeroCnt = layer.flat().filter(pixel => pixel === 0).length;
        // console.log(`Zeros in layer ${i}: ${zeroCnt}`);
        if (zeroCnt < minZeros) {
            layerWithFewestZeros = i;
            minZeros = zeroCnt;
        }
    });
    // console.log('Layer with fewest zeros: ', layerWithFewestZeros);
    // printLayer(image[layerWithFewestZeros]);
    return getControlNumber(image[layerWithFewestZeros]);
}

const getControlNumber = (layer) => {
    const numberOfOnes = layer.flat().filter(pixel => pixel === 1).length;
    const numberOfTwos = layer.flat().filter(pixel => pixel === 2).length;
    // console.log('Ones: ', numberOfOnes);
    // console.log('Twos: ', numberOfTwos);
    return numberOfOnes * numberOfTwos;
}

const renderImage = (image, ctx) => {
    let layer;
    do {
        layer = image.pop();
        renderLayer(layer, ctx);
    }
    while (layer)
}

const renderLayer = (layer, ctx) => {
    if (layer) {
        layer.forEach((row, r) => {
            row.forEach((pixel, c) => {
                if (pixel !== 2) {
                    ctx.fillStyle = pixel ? 'white' : 'black';
                    ctx.fillRect(c, r, 1, 1);
                }
            })
        });
    }
}


const main = async () => {
    const file = IS_NODE_ENV && (process.argv[2] || 'puzzle_input') || '/puzzle_input';
    const separator = IS_NODE_ENV && process.argv[3] || '';
    try {
        const puzzle_input = await readPuzzleInput(file, separator);
        //console.log('Puzzle input', puzzle_input);
        const image = processPuzzleInput(puzzle_input, 25, 6);
        console.log('Part I: ', verifyImage(image));
      
        if (IS_NODE_ENV) {
            console.log('Part II: Requires a browser to render the image. ');
        } else {
            console.log('Part II: The canvas contains the answer.');
            const canvas = document.getElementById("screen");
            const context = canvas.getContext("2d");
            renderImage(image, context);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
