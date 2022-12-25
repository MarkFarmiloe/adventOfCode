'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(' ').map((d, i) => i === 0 ? d : Number.parseInt(d)));
}

const processMoves = (moves, knotCount) => {
    const visited = new Set();
    let knots = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    const add = () => { visited.add('' + knots[knotCount - 1][0] + ':' + knots[knotCount - 1][1]); }
    add();
    const move = (delta, n) => {
        for (let i = 0; i < n; i++) {
            knots[0] = [knots[0][0] + delta[0], knots[0][1] + delta[1]];
            for (let j = 1; j < knotCount; j++) {
                if (Math.abs(knots[j][0] - knots[j - 1][0]) > 1) {
                    if (Math.abs(knots[j][1] - knots[j - 1][1]) > 1) {
                        knots[j][1] = knots[j - 1][1] + (knots[j][1] > knots[j - 1][1] ? 1 : -1);
                    }
                    else {
                        knots[j][1] = knots[j - 1][1];
                    }
                    knots[j][0] = knots[j - 1][0] + (knots[j][0] > knots[j - 1][0] ? 1 : -1);
                    if (j === knotCount - 1) add();
                }
                if (Math.abs(knots[j][1] - knots[j - 1][1]) > 1) {
                    knots[j][0] = knots[j - 1][0];
                    knots[j][1] = knots[j - 1][1] + (knots[j][1] > knots[j - 1][1] ? 1 : -1);
                    if (j === knotCount - 1) add();
                }
            }
        }
    };
    moves.forEach(([d, n]) => {
        switch (d) {
            case 'R':
                move([1, 0], n);
                break;
            case 'L':
                move([-1, 0], n);
                break;
            case 'U':
                move([0, 1], n);
                break;
            case 'D':
                move([0, -1], n);
                break;
            default:
                console.log('OOPS', d);
                break;
        }
    });
    // console.log(visited);
    return visited.size;
}

const process = (err, data) => {
    if (err) throw err;
    const moves = getData(data);
    console.log(processMoves(moves, 2));
    console.log(processMoves(moves, 10));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
