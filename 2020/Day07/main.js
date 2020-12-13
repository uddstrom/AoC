const fs = require('fs');

class TreeNode {
    constructor(value, qty = 1) {
        this.value = value;
        this.qty = Number(qty);
        this.children = [];
    }

    contains(value) {
        for (const child of this.children) {
            if (child.value === value || child.contains(value)) {
                return true;
            }
        }
    }

    print(level = 0) {
        const spaces = ''.padStart(level * 2, '-');
        console.log(`${spaces}${this.qty} ${this.value}`);
        this.children.forEach((child) => child.print(level + 1));
    }
}

const getLineFromChild = (childLine, input) => {
    // 2 muted yellow bags.
    const [qty, color1, color2, ...rest] = childLine.split(' ');
    const line = input.find((line) => line.startsWith(`${color1} ${color2}`));
    return line;
};

const createBag = (line, qty, input) => {
    // eg. line = light red bags contain 1 bright white bag, 2 muted yellow bags.
    const type = line.substring(0, line.indexOf('bags') - 1);
    const treeNode = new TreeNode(type, qty);

    const content = line.substring(line.indexOf('contain') + 8, line.length).split(', ');
    if (content[0] !== 'no other bags.') {
        treeNode.children = content.map((childLine) => {
            const [qty, ...rest] = childLine.split(' ');
            return createBag(getLineFromChild(childLine, input), qty, input);
        });
    }

    return treeNode;
};

const processInput = (input) => {
    const root = new TreeNode('root');
    root.children = input.map((line) => createBag(line, 1, input));
    return root;
};

const countBags = (bag) => {
    if (bag.children.length === 0) {
        return 0;
    }
    return bag.children.reduce((acc, child) => acc + child.qty + child.qty * countBags(child), 0);
};

fs.readFile('Day07/puzzle_input', 'utf8', function (err, contents) {
    const puzzle_input = contents.split('\r\n');
    const treeOfBags = processInput(puzzle_input);

    const count = treeOfBags.children.reduce(
        (acc, curr) => (curr.contains('shiny gold') ? acc + 1 : acc),
        0,
    );
    console.log('Part 1:', count);

    const shinyGold = treeOfBags.children.find((child) => child.value === 'shiny gold');
    console.log('Part 2:', countBags(shinyGold));
});
