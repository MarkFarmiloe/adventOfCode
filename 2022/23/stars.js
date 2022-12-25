'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(''));
}

const process = (err, data) => {
    if (err) throw err;
    let grid = getData(data);
    let elves = grid.reduce((e, row, i) => {
        row.forEach((c, j) => {
            if (c === '#') e.push([i, j]);
        })
        return e;
    }, []);
    console.log(grid.map(l => l.join('')).join('\n'));
    console.log(elves);
    const possibles = [[0, -1], [0, 1], [1, -1], [1, 1]];
    for (let i = 0; i < 99999; i++) {
        const newElves = [];
        let noMoves = true;
        for (const elf of elves) {
            const [t, l, b, r] = [elf[0] - 1, elf[1] - 1, elf[0] + 1, elf[1] + 1];
            const neighbours = elves.reduce((a, e) => {
                if (e[0] >= t && e[0] <= b
                    && e[1] >= l && e[1] <= r
                ) a.push([e[0] - elf[0], e[1] - elf[1]]);
                return a;
            }, []);
            if (neighbours.length === 1) {
                newElves.push(elf);
            } else {
                noMoves = false;
                let moved = false;
                for (let j = 0; j < 4; j++) {
                    const [ci, cv] = possibles[(i + j) % 4];
                    if (!neighbours.some(n => n[ci] === cv)) {
                        newElves.push(ci === 0 ? [elf[0] + cv, elf[1]] : [elf[0], elf[1] + cv]);
                        moved = true;
                        break;
                    }
                }
                if (!moved) newElves.push(elf);
            }
        }
        if (noMoves) {
            console.log(`Completed in ${i + 1} moves`);
            break;
        }
        elves = newElves.map(([ne0, ne1], i) => {
            if (newElves.filter(([e0, e1]) => e0 === ne0 && e1 === ne1).length > 1){
                return elves[i];
            } else {
                return [ne0, ne1];
            }
        });
        if (i === 9) {
            const [t, l, b, r] = elves.reduce(([t, l, b, r], e) => {
                return [
                    t < e[0] ? t : e[0],
                    l < e[1] ? l : e[1],
                    b > e[0] ? b : e[0],
                    r > e[1] ? r : e[1]
                ];
            }, [9999, 9999, -9999, -9999]);
            console.log(t, l, b, r, (1 + b - t) * (1 + r - l) - elves.length);
        }
    }
    elves.sort(([a0, a1], [b0, b1]) => (a0 === b0) ? a1 - b1 : a0 - b0);
    console.log(elves);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
