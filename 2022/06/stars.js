'use strict';
const fs = require("fs");

const findKey = (data, len) => {
    let pos = 0;
    for (let i = 1; i < data.length; i++) {
        const c = data[i];
        for (let j = Math.min(pos + len - 2, i - 1); j >= pos; j--) {
            if (c === data[j]) {
                pos = j + 1;
                break;
            }
        }
        if (i - pos === len - 1) return i + 1;
    }
    return 0;
}

const process = (err, data) => {
    if (err) throw err;
    console.log(findKey(data, 4));
    console.log(findKey(data, 14));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
