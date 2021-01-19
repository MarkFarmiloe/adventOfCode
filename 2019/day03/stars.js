'use strict';
const fs = require("fs");

const parseLine = (l) => {
    return l.trim().split(',');
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
    const wires = data.replace(/\r/g, '').split("\n").slice(0, 2).map(parseLine);
    console.log(wires);
    const [minX, minY, maxX, maxY] = wires.reduce(([minx, miny, maxx, maxy], w) => {
        let [x, y] = [0, 0];
        w.forEach(code => {
            switch (code[0]) {
                case 'L':
                    x -= Number.parseInt(code.slice(1));
                    break;
                case 'R':
                    x += Number.parseInt(code.slice(1));
                    break;
                case 'D':
                    y -= Number.parseInt(code.slice(1));
                    break;
                case 'U':
                    y += Number.parseInt(code.slice(1));
                    break;
                default:
                    console.log('OOPS', code);
                    break;
            }
            if (x < minx) minx = x;
            if (y < miny) miny = y;
            if (x > maxx) maxx = x;
            if (y > maxy) maxy = y;
        });
        return [minx, miny, maxx, maxy];
    }, [0, 0, 0, 0]);
    console.log(minX, minY, maxX, maxY);
    const centre = [-minX, -minY];
    const width = maxX - minX + 1;
    // const height = maxY - minY + 1;
    const grid = wires.reduce((grid, w, wireNo) => {
        let [x, y] = centre;
        w.forEach(code => {
            const key = code[0];
            const value = Number.parseInt(code.slice(1));
            switch (key) {
                case 'L':
                    for (let i = 1; i <= value; i++) setCell(grid, width, x - i, y, wireNo);
                    x -= value;
                    break;
                case 'R':
                    for (let i = 1; i <= value; i++) setCell(grid, width, x + i, y, wireNo);
                    x += value;
                    break;
                case 'D':
                    for (let i = 1; i <= value; i++) setCell(grid, width, x, y - i, wireNo);
                    y -= value;
                    break;
                case 'U':
                    for (let i = 1; i <= value; i++) setCell(grid, width, x, y + i, wireNo);
                    y += value;
                    break;
                default:
                    console.log('OOPS');
                    break;
            }
        });
        return grid;
    }, [])
    // console.log(grid);
    // console.log(grid[0][0]);
    const crosses = [];
    grid.forEach((row, x) => {
        row.forEach((cell, y) => {
            if (cell === 3) {
                crosses.push([x, y]);
            }
        })
    });
    console.log(crosses);
    console.log(crosses.reduce((md, [x, y]) => {
        const dist = Math.abs(x - centre[0]) + Math.abs(y - centre[1]);
        if (md > dist) md = dist;
        return md;
    }, 1000000));
    const crossSteps = crosses.map(([x, y]) => {
        return [x, y, ...countSteps(wires, [x, y], centre)];
    });
    console.log(crossSteps);
    console.log(crossSteps.reduce((min, c) => {
        const steps = c[2] + c[3];
        if (min > steps) min = steps;
        return min;
    }, 1000000));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
