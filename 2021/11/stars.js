'use strict';
const fs = require("fs");

const getData = (data) => {
    return data.trim().replace(/\r/g, '').split('\n')
        .map(l => l.trim().split('')
            .map(d => Number.parseInt(d)));
};

const spreadFlash = (grid, r, c) => {
    let count = 0;
    //first increment if not zero
    for (let i = Math.max(0, r - 1); i < Math.min(grid.length, r + 2); i++) {
        for (let j = Math.max(0, c - 1); j < Math.min(grid[0].length, c + 2); j++) {
            if (grid[i][j] > 0) {
                grid[i][j]++;
            }
        }
    }
    //then flash if over 9
    for (let i = Math.max(0, r - 1); i < Math.min(grid.length, r + 2); i++) {
        for (let j = Math.max(0, c - 1); j < Math.min(grid[0].length, c + 2); j++) {
            if (grid[i][j] > 9) {
                grid[i][j] = 0;
                count++;
                count += spreadFlash(grid, i, j);
            }
        }
    }
    return count;
}

const step = grid => {
    let count = 0;
// first increment all
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j]++;
        }
    }
// now deal with flashes
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] > 9) {
                grid[i][j] = 0; // mark as flashed this step
                count++; // count the flash
                count += spreadFlash(grid, i, j);
            }
        }
    };
    return count;
}

const allZero = grid => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] !== 0) return false;
        }
    }
    return true;
}

const process = (err, data) => {
    if (err) throw err;
    let octopi = getData(data);
    let count = 0;
    for (let i = 0; i < 100; i++) {
        count += step(octopi);
    }
    console.log(count);
    octopi = getData(data);
    count = 0;
    while (!allZero(octopi)) {
        step(octopi);
        count++;
    }
    console.log(count);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
