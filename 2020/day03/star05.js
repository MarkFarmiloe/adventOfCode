const fs = require("fs");

fs.readFile("./input.txt", 'utf8', (err, data) => {
    const lines = data.split("\n");
    const cols = lines[0].trim().length;
    const rows = lines.length;
    console.log(lines.reduce((a,l,r) => {
        return a + (l[(3 * r) % cols] === '#' ? 1: 0);
    },0));
});
