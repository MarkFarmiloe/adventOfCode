'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(/(-?\d+)/).reduce((a, v, i) => {
        if (i % 2 === 1) a.push(parseInt(v, 10));
        return a;
    }, []));
}

const part1 = (info) => {
    const covered = new Set(info.reduce((a, l) => {
        const width = l.M - Math.abs(row - l.S[1]);
        if (width >= 0) {
            for (let i = l.S[0] - width; i <= l.S[0] + width; i++) {
                a.push(i);
            }
        }
        return a;
    }, []));
    info.forEach(l => {
        if (l.B[1] === row) covered.delete(l.B[0]);
    });
    return covered.size;
};

const part2 = (info) => {
    info = info.map(l => {
        l.T = [l.S[0], l.S[1] - l.M];
        l.B = [l.S[0], l.S[1] + l.M]; // don't need beacons anymore.
        l.L = [l.S[0] - l.M, l.S[1]];
        l.R = [l.S[0] + l.M, l.S[1]];
        return l;
    });
    info.sort((a, b) => {
        return (a.T[1] === b.T[1]) ? a.T[0] - b.T[0]: a.T[1] - b.T[1];
    });
    for (let r = 0; r <= maxIndex; r++) {
        let cols = [[0, maxIndex]];
        for (const l of info) {
            if (l.T[1] <= r && l.B[1] >= r) {
                const width = l.M - Math.abs(r - l.S[1]);
                const min = Math.max(0, l.S[0] - width);
                const max = Math.min(maxIndex, l.S[0] + width);
                for (let i = cols.length - 1; i >= 0 ; i--) {
                    const col = cols[i];
                    if (col[1] < min) break;
                    if (col[0] > max) continue;
                    if (col[0] < min && col[1] > max) { 
                        const newCol = [max + 1, col[1]];
                        col[1] = min - 1;
                        cols.splice(i + 1, 0, newCol); 
                        break;
                    }
                    if (col[0] >= min && col[1] <= max) { 
                        cols.splice(i, 1); 
                        continue; 
                    }
                    if (col[1] <= max) col[1] = min - 1;
                    else col[0] = max + 1;
                }
                if (cols.length === 0) break;
            }
        }
        if (cols.length > 0) {
            console.log(cols[0][0], r);
            return BigInt(cols[0][0]) * BigInt(4000000) + BigInt(r);
        }
    }
    return 'OOPS';
};

const process = (err, data) => {
    if (err) throw err;
    const info = getData(data).map(([a, b, x, y]) => {
        return { S: [a, b], B: [x, y], M: Math.abs(a - x) + Math.abs(b - y) };
    });
    // console.log(info);
    console.log(part1(info));
    console.log(part2(info));
}

const run = 1;
const filename = run === 0 ? "./test.txt": "./input.txt";
const row = run === 0 ? 10: 2000000;
const maxIndex = run === 0 ? 20 : 4000000;

fs.readFile(filename, 'utf8', process);
