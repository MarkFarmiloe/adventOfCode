'use strict';
const fs = require("fs");

const parseLine = (l) => {
    return Number.parseInt(l.trim());
}

const setCell = (grid, width, x, y, wireNo) => {
    if(!grid[x]) grid[x] = new Int8Array(width);
    if (wireNo === 0) {
        grid[x][y] = 1;
    } else {
        const v = grid[x][y];
        if (v === 1)
            grid[x][y] = 3;
        else
            grid[x][y] = 2;
    }
    // console.log(x, y, grid[x]);
}

const countSteps = (wires, dest, orig) => {
    let steps = [0, 0];
    for (let i = 0; i < wires.length; i++) {
        const wire = wires[i];
        let [x, y] = orig;
        for (let j = 0, done = false; !done; j++) {
            const code = wire[j];
            const key = code[0];
            const value = Number.parseInt(code.slice(1));
            let x1, y1;
            switch (key) {
                case 'L':
                    x1 = x - value;
                    if (y === dest[1] && x1 <= dest[0] && x >= dest[0]) {
                        steps[i] += x - dest[0];
                        done = true; 
                    } else {
                        steps[i] += value;
                        x = x1;
                    }
                    break;
                case 'R':
                    x1 = x + value;
                    if (y === dest[1] && x <= dest[0] && x1 >= dest[0]) {
                        steps[i] += dest[0] - x;
                        done = true; 
                    } else {
                        steps[i] += value;
                        x = x1;
                    }
                    break;
                case 'D':
                    y1 = y - value;
                    if (x === dest[0] && y1 <= dest[1] && y >= dest[1]) {
                        steps[i] += y - dest[1];
                        done = true; 
                    } else {
                        steps[i] += value;
                        y = y1;
                    }
                    break;
                case 'U':
                    y1 = y + value;
                    if (x === dest[0] && y <= dest[1] && y1 >= dest[1]) {
                        steps[i] += dest[1] - y;
                        done = true; 
                    } else {
                        steps[i] += value;
                        y = y1;
                    }
                    break;
                default:
                    console.log('OOPS');
                    break;
            }
        }
    }
    return steps;
}

const process = (err, data) => {
    if (err) throw err;
    const range = data.replace(/\r/g, '').split("-").map(parseLine);
    const passwords = [];
    for (let i = range[0]; i <= range[1]; i++) {
        let test = false;
        let prev = '', prevPair = '';
        let s = i.toString();
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (i === 0) { prev = c; continue; }
            if (c === prev) {
                if (c === prevPair) {
                    test = false;
                } else if (test === false) {
                    test = true;
                    prevPair = c;
                }
            }
            if (prev > c) {
                test = false;
                break;
            }
            prev = c;
        }
        if (test) {
            passwords.push(i);
            console.log(i);
        }
    }
    console.log(passwords.length);
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
