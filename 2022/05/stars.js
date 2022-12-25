'use strict';
const fs = require("fs");

const getData = (raw) => {
    const [stackData, moveData] = raw.split('\n\n');
    const stackLines = stackData.split('\n');
    const stackCount = (stackLines.pop().length + 1) / 4;
    const stacks = [];
    for (let i = 0; i < stackCount; i++) {
        stacks[i] = [];      
    }
    while (stackLines.length > 0) {
        const stackLine = stackLines.pop();
        for (let i = 0; i < stackCount; i++) {
            const c = stackLine[1 + 4 * i];
            if (c !== ' ') stacks[i].push(c);
        }
    }
    const moves = moveData.split('\n').map(l => 
        l.split(' ')
        .filter((_, i) => i % 2 === 1)
        .map((v, i) => Number.parseInt(v) - (i > 0 ? 1 : 0)));
    return [stacks, moves];
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
    let [stacks, moves] = getData(data);
    // console.log(stacks, moves);
    moves.forEach(([n,f,t]) => {
        for (let i = 0; i < n; i++) {
            stacks[t].push(stacks[f].pop());          
        }
    });
    // console.log(stacks);
    console.log(stacks.reduce((r, s) => r + s.pop(), ''));
    [stacks] = getData(data);
    moves.forEach(([n,f,t]) => { 
        const newL = stacks[f].length - n;
        // console.log(newL, stacks);
        stacks[t] = stacks[t].concat(stacks[f].slice(newL));          
        stacks[f].length = newL;
    });
    // console.log(stacks);
    console.log(stacks.reduce((r, s) => r + s.pop(), ''));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
