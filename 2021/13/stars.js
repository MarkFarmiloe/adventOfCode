'use strict';
const fs = require("fs");

const getData = (data) => {
    let pairs = data
        .trim().replace(/\r/g, '').split('\n\n')
        .map(l => l.trim());
    let coords = pairs[0].split('\n').map(l => l.split(',').map(d => parseInt(d)));
    let folds = pairs[1].split('\n').map(l => l.split('=').map((p, i) => {
        if (i === 1) {
            return parseInt(p);
        } else {
            return p.split(' ')[2];
        }
    }));
    return [coords, folds];    
};

const exists = ([a, b], [c, d]) => a === c && b === d;

const fold = (coords, [direction, line]) => {
return coords.reduce((a, [x, y]) => {
    if (direction === 'x') {
        if (x < line) {
            if (a.findIndex(e => exists(e, [x, y])) < 0) a.push([x, y]);
        } else if (x > line) {
            let newCoord = [2 * line - x, y];
            if (a.findIndex(e => exists(e, newCoord)) < 0) a.push(newCoord);
        }
    } else {
        if (y < line) {
            if (a.findIndex(e => exists(e, [x, y])) < 0) a.push([x, y]);
        } else if (y > line) {
            let newCoord = [x, 2 * line - y];
            if (a.findIndex(e => exists(e, newCoord)) < 0) a.push(newCoord);
        }
    }
    return a;
    }
    , []);
}

const process = (err, data) => {
    if (err) throw err;
    let [coords, folds] = getData(data);
    let firstFold = folds.shift();
    let folded = fold(coords, firstFold);
    folded.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    console.log(folded.length);
    let fullyFolded = folds.reduce((a, f) => {
        return fold(a, f);
    }, folded);
    fullyFolded.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    let maxes = fullyFolded.reduce(([a, b], [x, y]) => {
        a = a > x ? a : x;
        b = b > y ? b : y;
        return [a, b]; 
    }, [0, 0]);
    let rows = [];
    for (let r = 0; r <= maxes[1]; r++) {
        rows.push(" ".repeat(1 + maxes[0]));
    }
    fullyFolded.forEach(([x, y]) => rows[y] = rows[y].slice(0, x) + '#' + rows[y].slice(x + 1));
    console.log(rows);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
