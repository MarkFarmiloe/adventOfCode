'use strict';
const fs = require("fs");

const getData = (data) => {
    return data
        .trim().replace(/\r/g, '').split('\n')
        .map(l => l.trim().split('').map(d => parseInt(d)));
};

const backFill = (grid, g, i, j) => {
    const v = g[i][j];
    // test W, N, E then S
    if (j > 0 && v + grid[i][j-1] < g[i][j-1]) { 
        g[i][j-1] = v + grid[i][j-1]; 
        backFill(grid, g, i, j-1); 
    }
    if (i > 0 && v + grid[i-1][j] < g[i-1][j]) { 
        g[i-1][j] = v + grid[i-1][j]; 
        backFill(grid, g, i-1, j); 
    }
    if (j < grid[0].length - 1 && g[i][j+1] && v + grid[i][j+1] < g[i][j+1]) { 
        g[i][j+1] = v + grid[i][j+1]; 
        backFill(grid, g, i, j+1); 
    }
    if (i < grid.length - 1 && g[i+1] && g[i+1][j] && v + grid[i+1][j] < g[i+1][j]) { 
        g[i+1][j] = v + grid[i+1][j]; 
        backFill(grid, g, i+1, j); 
    }
}

const calcLcp = grid => {
    let g = [];
    grid.forEach((row, i) => {
        let r = [];
        g.push(r);
        row.forEach((col, j) => {
            r[j] = i === 0 && j === 0 ? 0 : col +  
                (i === 0 ? r[j - 1] :
                (j === 0 ? g[i - 1][0] : 
                    Math.min(r[j - 1], g[i - 1][j]))); 
            if (i > 0 && j > 0) {
                backFill(grid, g, i, j);
            }
        });
    });
    return g;
}

const bigUp = grid => {
    const bg = [];
    for (let i = 0; i < 5; i++) {
        for (let r = 0; r < grid.length; r++) {
            let br = [];
            for (let j = 0; j < 5; j++) {
                const offset = i + j;
                const row = grid[r].map(c => { c += offset; return c > 9 ? c - 9 : c; });
                br = br.concat(row);
            }
            bg.push(br);
        }      
    }
    return bg;
}

const process = (err, data) => {
    if (err) throw err;
    const grid = getData(data);    
    // console.log(grid);
    let lcp = calcLcp(grid);
    console.log(lcp[lcp.length - 1][lcp[0].length - 1]);
    const bigGrid = bigUp(grid);
    // console.log(bigGrid);
    lcp = calcLcp(bigGrid);
    console.log(lcp[lcp.length - 1][lcp[0].length - 1]);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
