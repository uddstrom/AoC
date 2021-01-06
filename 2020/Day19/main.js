const fs = require('fs');

const Node = (value) => ({
    value: value,
    left: null,
    right: null,
});

function leafs(tree) {
    function getLeafs(t) {
        if (t.left === null) {
            return t.value;
        } else {
            const left = getLeafs(t.left);
            const right = t.right !== null ? getLeafs(t.right) : null;
            return right ? [left, right] : [left];
        }
    }
    return getLeafs(tree).flat(Infinity);
}

function countValidMessages(messages, rules) {
    const developRule = (rule, developed) => {
        const root = Node(developed ? developed + rule : rule);
        const [head, ...tail] = rule.split(' ');
        const subrules = rules.get(head)?.split('|').map(r => r.trim());
        if (subrules) {
            root.left = developRule(`${subrules[0]} ${tail.join(' ')}`.trim(), developed);
            root.right = subrules[1] ? developRule(`${subrules[1]} ${tail.join(' ')}`.trim(), developed) : null;
        } else if (tail.length > 0) {
            root.left = developRule(tail.join(' '), developed ? developed + head : head);
        }
        return root;
    }

    const tree42 = developRule('42');
    const tree31 = developRule('31');
    const valid42 = leafs(tree42);
    const valid31 = leafs(tree31);

    function validateMessage(message) {
        let rest31 = false;
        const bytes = message.match(/.{8}/g);
        const n = bytes.length - Math.ceil(bytes.length / 2 - 1);
        for (const [idx, byte] of bytes.entries()) {
            const in31 = valid31.includes(byte);
            const in42 = valid42.includes(byte);
            // First n bytes must be valid in 42
            if (idx < n && !in42) return false;
            // Last byte must be valid in 31
            if (idx === bytes.length - 1 && !in31) return false;
            if (idx >= n && in31) {
                rest31 = true; // The rest of the bytes must now be valid in 31
            }
            else if (!in42 || rest31) return false;
        }
        return true;
    }

    return messages.reduce((cnt, mess) => validateMessage(mess) ? cnt + 1 : cnt, 0);
}

function parseInput(input) {
    const rules = new Map();
    input.slice(0, input.indexOf('')).forEach(r => {
        const key = r.substring(0, r.indexOf(':'));
        const value = r.substring(r.indexOf(':') + 2).replaceAll('"', '');
        rules.set(key, value);
    });
    const messages = input.slice(input.indexOf('') + 1);
    return [rules, messages];
}

fs.readFile('Day19/puzzle_input', 'utf8', function (err, contents) {
    const [rules, messages] = parseInput(contents.split('\n'));
    console.log('Part 1:', countValidMessages(messages.filter(m => m.length === 24), rules));
    console.log('Part 2:', countValidMessages(messages, rules));
});
