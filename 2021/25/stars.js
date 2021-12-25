'use strict';
const fs = require("fs");

const getData = (data) => {
    const parts = data
        .trim().replace(/\r/g, '').split('\n').map(l => {
            return l.trim().split('');
        });
    return parts;
};

const gang = [
    ['>', 0, 1],
    ['v', 1, 0]
];

const firstStationaryStep = grid => {
    const height = grid.length;
    const width = grid[0].length;
    let step = 0, moved = false;
    do {
        step++;
        moved = false;
        for (let i = 0; i < 2; i++) {
            let g = grid.map(r => r.map(c => c));
            for (let r = 0; r < height; r++) {
                for (let c = 0; c < width; c++) {
                    if (
                        g[r][c] === gang[i][0] && 
                        g[(r + gang[i][1]) % height][(c + gang[i][2]) % width] === '.'
                    ) {
                        moved = true;
                        grid[(r + gang[i][1]) % height][(c + gang[i][2]) % width] = gang[i][0];
                        grid[r][c] = '.';
                    }
                }
            }
        }
    } while (moved);
    return step;
}

const process = (err, data) => {
    if (err) throw err;
    const grid = getData(data);
    const step = firstStationaryStep(grid);
    console.log(step);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
