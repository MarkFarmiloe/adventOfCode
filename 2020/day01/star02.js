const fs = require("fs");

fs.readFile("./input.txt", 'utf8', (err, data) => {
    const numbers = data.split("\n").map(s => Number.parseInt(s));
    const i = numbers.filter(i => {
        const j = numbers.filter(j => {
            const k = numbers.filter(k => i + j + k === 2020);
                return k.length > 0;
        });
        return j.length > 0;
    });
    console.log (i,  i[0] * i[1] * i[2]);
});
