'use strict';
const fs = require("fs");


const MODULO = 20201227;
const SUBJECT_NUMBER = 7;
const findLoopSize = (target) => {
    let key = 1;
    let loopCount = 0;
    while (key !== target) {
        loopCount++;
        key = (key * SUBJECT_NUMBER) % MODULO;
    }
    return loopCount;
}

const process = (err, data) => {
    if (err) throw err;
    const keys = data.replace(/\r/g, '').split('\n').map(l => Number.parseInt(l.trim()));
    console.log(keys);
    const loopSizes = keys.map(k => findLoopSize(k));
    console.log(loopSizes);    
    let key = keys[0];
    for (let i = 1; i < loopSizes[1]; i++) {
        key = (key * keys[0]) % MODULO;
    }
    console.log(key);
    key = keys[1];
    for (let i = 1; i < loopSizes[0]; i++) {
        key = (key * keys[1]) % MODULO;
    }
    console.log(key);
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
