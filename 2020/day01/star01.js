const fs = require("fs");

fs.readFile("./input.txt", 'utf8', (err, data) => {
    const numbers = data.split("\n").map(s => Number.parseInt(s));
    const n = numbers.filter(n => {
        const m = numbers.filter(m => m + n === 2020);
        return m.length > 0;
    });
    console.log (n,  n[0] * n[1]);
});
