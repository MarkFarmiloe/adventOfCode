'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(' -> ').map(p => p.split(',').map(d => parseInt(d, 10))));
}

const addSand = (grid, xOffset) => {
    let x = xOffset;
    let y = 0;
    const height = grid.length;
    const width = grid[0].length;
    while (x >= 0 && x < width && y < height - 1) {
        y++;
        if (grid[y][x] === '.') {
            if (y === height - 1) return false;
        } else {
            if (x === 0) return false;
            if (grid[y][x - 1] === '.') {
                x--;
            } else {
                if (x === width - 1) return false;
                if (grid[y][x + 1] === '.') {
                    x++;
                } else break; // stopped moving
            }
        }
    }
    y--;
    grid[y][x] = 'o';
    return (y > 0);
}

const getGrainCount = (paths, minx, maxx, maxy, extra) => {
    const initialGrid = Array(maxy + 1 + (extra === 0 ? 0 : 2));
    for (let i = 0; i < initialGrid.length; i++) {
        const row = Array(maxx - minx + 1 + (2 * extra)).fill('.');
        initialGrid[i] = row;
    }
    const offset = minx - extra;
    const grid = paths.reduce((g, p) => {
        for (let i = 1; i < p.length; i++) {
            const from = p[i - 1];
            const to = p[i];
            const index = (from[1] === to[1] ? 0 : 1);
            const start = Math.min(from[index], to[index]);
            const end = Math.max(from[index], to[index]);
            for (let j = start; j <= end; j++) {
                if (index === 0) g[from[1]][j - offset] = '#';
                else g[j][from[0] - offset] = '#'
            }
        }
        return g;
    }, initialGrid);
    if (extra > 0) {
        grid[grid.length - 1].fill('#');
    }
    // console.log(grid.map(l => l.join('')).join('\n'));
    let grains = 0;
    const xOffset = 500 - minx + extra;
    while (addSand(grid, xOffset)) { grains++; }
    // console.log(grid.map(l => l.join('')).join('\n'));
    return grains;
}

const process = (err, data) => {
    if (err) throw err;
    const paths = getData(data);
    const [minx, maxx, maxy] = paths.reduce((a, p) => {
        p.forEach(([x, y]) => {
            if (x < a[0]) a[0] = x;
            if (x > a[1]) a[1] = x;
            if (y > a[2]) a[2] = y;
        });
        return a;
    }, [1000000, 0, 0]);
    // console.log(minx, maxx, maxy);
    console.log(getGrainCount(paths, minx, maxx, maxy, 0));
    console.log(1 + getGrainCount(paths, minx, maxx, maxy, maxy + 1));
    // console.log(paths);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
