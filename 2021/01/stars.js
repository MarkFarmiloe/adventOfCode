'use strict';
const fs = require("fs");

const getDepths = (data) => {
    return data
        .trim()
        .split('\n')
        .map(l => Number.parseInt(l.trim()));
};

const process = (err, data) => {
    if (err) throw err;
    const depths = getDepths(data);
    let count = 0;
    for (let i = 0, j = 1; j < depths.length; i++, j++) {
        count += depths[j] > depths[i] ? 1 : 0;
    }
    console.log(count);
// next star
    count = 0;
    let sum3 = depths[0] + depths[1] + depths[2];
    for (let i = 0, j = 3; j < depths.length; i++, j++) {
        const newSum = sum3 - depths[i] + depths[j];
        count += newSum > sum3 ? 1 : 0;
        sum3 = newSum;
    }
    console.log(count);
}

fs.readFile("./input.txt", 'utf8', process);
