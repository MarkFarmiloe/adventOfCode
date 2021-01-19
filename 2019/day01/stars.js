'use strict';
const fs = require("fs");

const fuel = (mass) => {
    let total = 0;
    let f = mass;
    while (f > 0){
        f = Math.floor(f / 3) - 2;
        if (f < 0) f = 0;
        total += f;
    }
    return total;
}

const process = (err, data) => {
    if (err) throw err;
    const masses = data.replace(/\r/g, '').split("\n").map(l => Number.parseInt(l));
    console.log(masses.reduce((a, m) => a + Math.floor(m / 3) - 2, 0));
    console.log(masses.reduce((a, m) => a + fuel(m), 0));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
