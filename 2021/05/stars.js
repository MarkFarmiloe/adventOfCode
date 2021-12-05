'use strict';
const fs = require("fs");

const getData = (data) => {
    const lines = data.trim().replace('\r', '').split('\n');
    return lines.map(line => decodeLine(line));
};

const decodeLine = line => {
    const parts = line.split(' -> ');
    return parts.map(part => part.split(',').map(coord => Number.parseInt(coord)));
};

const buildGrid = (lines, initGrid) => {
    let grid = initGrid || [];
    lines.forEach(([[sx, sy], [ex,ey]]) => {
        const xDiff = ex - sx;
        const yDiff = ey - sy;
        if (initGrid) {
            if (xDiff && yDiff) {
                const yInc = (xDiff > 0 && yDiff > 0) || (xDiff < 0 && yDiff < 0) ?
                    1 : -1;
                const yStart = (yInc === 1 ?  Math.min(sy, ey) :  Math.max(sy, ey));
                for (let i = Math.min(sx, ex), j = yStart; 
                        i <= Math.max(sx, ex); i++, j = j + yInc) {
                    if (!grid[i]) grid[i] = [];
                    grid[i][j] = grid[i][j] ? grid[i][j] + 1 : 1;
                }
            }
        } else {
            if (xDiff === 0) {
                if (!grid[sx]) grid[sx] = [];
                for (let i = Math.min(sy, ey); i <= Math.max(sy, ey); i++) {
                    grid[sx][i] = grid[sx][i] ? grid[sx][i] + 1 : 1;
                }
            } else if (yDiff === 0) {
                for (let i = Math.min(sx, ex); i <= Math.max(sx, ex); i++) {
                    if (!grid[i]) grid[i] = [];
                    grid[i][sy] = grid[i][sy] ? grid[i][sy] + 1 : 1;
                }
            }
        }
    });
    return grid;
};

const process = (err, data) => {
    if (err) throw err;
    const lines = getData(data);
    const grid = buildGrid(lines);
    const count = grid.reduce(
        (rc, row) => {
            return rc + row.reduce(
                ((cc, col) => {
                    return cc + ((col && col > 1) ? 1 : 0);
                })
            , 0);
        }
    , 0);
    console.log(count);
    const grid2 = buildGrid(lines, grid);
    const count2 = grid2.reduce(
        (rc, row) => {
            return rc + row.reduce(
                ((cc, col) => {
                    return cc + ((col && col > 1) ? 1 : 0);
                })
            , 0);
        }
    , 0);
    console.log(count2);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
