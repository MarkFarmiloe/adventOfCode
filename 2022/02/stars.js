'use strict';
const fs = require("fs");

const codeA = 'A'.charCodeAt(0); 
const codeX = 'X'.charCodeAt(0); 

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(' ').map(c => {
        const code = c.charCodeAt(0);
        return code >= codeX ? code - codeX : code - codeA;
    }));
} 

const gameScore = (o, m) => {
    if (o === m) return 3;
    if ((o + 1) % 3 === m) return 6;
    return 0;
}

const gameChoice = (o, m) => {
    return (2 + o + m) % 3;
}

const process = (err, data) => {
    if (err) throw err;
    const gameLines = getData(data);
    console.log(gameLines.reduce((a, [o, m]) => a + 1 + m + gameScore(o, m), 0));
    console.log(gameLines.reduce((a, [o, m]) => {
        const gc = gameChoice(o, m);
        return a + 1 + gc + 3 * m;
    }, 0));
}

fs.readFile("./input.txt", 'utf8', process);
