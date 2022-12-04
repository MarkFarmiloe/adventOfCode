'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(',').map(s => s.split('-').map(n => Number.parseInt(n))));
} 

const oneInOther = ([[l1, h1], [l2, h2]]) => {
    if (l1 < l2) return h1 >= h2;
    if (l1 > l2) return h1 <= h2;
    return true;
}

const overlap = ([[l1, h1], [l2, h2]]) => {
    if (l1 < l2) return h1 >= l2;
    if (l1 > l2) return h2 >= l1;
    return true;
}


const process = (err, data) => {
    if (err) throw err;
    const pairs = getData(data);
    // console.log(pairs);
    console.log(pairs.filter(oneInOther).length);
    console.log(pairs.filter(overlap).length);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
