'use strict';
const fs = require("fs");

const sideToULO = (side, dims) => {
    const upper = Math.floor((side - 1) / 2);
    const lower = 1 + upper - side;
    const origin = -lower - 
        (lower * side) - 
        (lower * side * side) -
        (dims === 4 ? lower * side * side * side: 0); 
    return [upper, lower, origin];
}

const coordsToIndex = ([x, y, z, w], side, dims) => {
    const [u, l, o] = sideToULO(side, dims);
    return o + x + (side * y) + (side * side * z) + (dims === 4 ? (side * side * side * w) : 0);
}

const indexToCoords = (index, side, dims) => {
    const [u, l, o] = sideToULO(side, dims);
    let h = index;
    let w = 0;
    if (dims === 4) {
        h = index % (side * side * side);
        w = (index - h) / (side * side * side) + l;
    }
    const i = h % (side * side);
    const z = (h - i) / (side * side) + l;
    const j = i % side;
    const y = (i - j) / side + l;
    const x = j + l;
    return [x, y, z, w];
}

// const testConversion = () => {
//     const side = 20;
//     const [u, l, o] = sideToULO(side);
//     let indexes = [0, 7999, 3999, 3998, 4000];
//     indexes.forEach(index => {
//         let coord = indexToCoords(index, side);
//         console.log(index, coord);
//         console.log(coord, coordsToIndex(coord, side));
//     });
//     let coords = [[0, 0, 0], [l, l, l], [u, u, u]];
//     coords.forEach(coord => {
//         let index = coordsToIndex(coord, side);
//         console.log(coord, index);
//         console.log(index, indexToCoords(index, side));
//     });
// }

const growGrid = (grid, side, dims) => {
    const [u, l, o] = sideToULO(side, dims);
    const newGrid = new Int8Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        // if (i % 100 === 0) console.log(i);
        const [x, y, z, w] = indexToCoords(i, side, dims);
        const centre = grid[i];
        // if (centre) console.log(x, y, z);
        let count = -centre;
        for (let a = ((x === l) ? l : x - 1); a <= ((x === u) ? u : x + 1); a++) {
            for (let b = ((y === l) ? l : y - 1); b <= ((y === u) ? u : y + 1); b++) {
                for (let c = ((z === l) ? l : z - 1); c <= ((z === u) ? u : z + 1); c++) {
                    if (dims === 4) {
                        for (let d = ((w === l) ? l : w - 1); d <= ((w === u) ? u : w + 1); d++) {
                            count += grid[coordsToIndex([a, b, c, d], side, dims)];
                        }
                    } else {
                        count += grid[coordsToIndex([a, b, c, 0], side, dims)];
                    }
                    // if (centre) console.log(a, b, c, grid[coordsToIndex([a, b, c], side)]);
                }
            }
        }
        // if (count !== 0) console.log(count);
        if(centre) {
            newGrid[i] = (count >= 2 && count <= 3) ? 1 : 0; 
        } else {
            newGrid[i] = (count === 3) ? 1 : 0; 
        }
    }
    return newGrid;
}

const lineToGrid = (grid, dims, side, x, y, l) => {
    for (let i = 0; i < l.length; i++) {
        if (l[i] !== '.') {
            const index = coordsToIndex([x + i, y, 0, 0], side, dims);
            // console.log(x + i, y);
            grid[index] = 1;
        }
    }
}

const processDim = (dims, lines) => {
    const len = lines[0].length;
    const side = len + 12;
    const [u, lower, o] = sideToULO(side);
    let grid = new Int8Array(Math.pow(side, dims));
    lines.forEach((l,i) => lineToGrid(grid, dims, side, 6 + lower, 6 + lower + i, l));
    for (let i = 0; i < 6; i++) {
        console.log(grid.reduce((a, c) => a + c, 0));
        grid = growGrid(grid, side, dims);
    }
    // console.log(grid);
    console.log(grid.reduce((a, c) => a + c, 0));
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.replace(/\r/g, '').split("\n");
    processDim(3, lines);
    processDim(4, lines);
};
// console.log(testConversion());

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
