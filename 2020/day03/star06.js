const fs = require("fs");

const countTrees = (lines, right, down = 1) => {
    const cols = lines[0].trim().length;
    return lines.reduce((a,l,r) => {
        if (r % down !== 0) return a;
        return a + (l[(right * r / down) % cols] === '#' ? 1: 0);
    },0);
}

const process = (err, data) => {
    const lines = data.split("\n");
    const a = countTrees(lines, 1);
    const b = countTrees(lines, 3);
    const c = countTrees(lines, 5);
    const d = countTrees(lines, 7);
    const e = countTrees(lines, 1, 2);
    console.log(a, b, c, d, e, (a * b * c * d * e));
};

fs.readFile("./input.txt", 'utf8', process);
