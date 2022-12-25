'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(' ').map((d, i) => i === 0 ? d : Number.parseInt(d)));
}

const getSignal = (moves) => {
    let x = 1;
    let ss = 0;
    let i = 1;
    const checkSS = () => {
        i++;
        if (i % 40 === 20) {
            ss += i * x;
            // console.log(i, x, i * x);
        }
    }
    moves.forEach(([c, n]) => {
        // if (i > 180) console.log(i, c, n);
        if (c === 'noop') checkSS();
        else {
            checkSS();
            x += n;
            checkSS();
        }
    })
    return ss;
}

const buildImage = (moves) => {
    let x = 1;
    let ss = 0;
    let i = 0;
    let s = '';
    const output = () => {
        if (i % 40 === 0) {
            console.log(s);
            s = '';
        }
        s += (Math.abs(x - (i % 40)) < 2 ? '#' : '.'); 
        i++;
    }
    moves.forEach(([c, n]) => {
        if (c === 'noop') output();
        else {
            output();
            output();
            x += n;
        }
    })
    console.log(s);
    return ss;
}

const process = (err, data) => {
    if (err) throw err;
    const moves = getData(data);
    // console.log(moves);
    console.log(getSignal(moves));
    buildImage(moves);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
