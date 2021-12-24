'use strict';

const { resourceLimits } = require("worker_threads");

// const test1 = [[0,0,0,0,0,0,0,0,0,0,0], [2,3,2,4], [1,4,3,1]];
// const test2 = [[0,0,0,0,0,0,0,0,0,0,0], [2,3,2,4], [4,3,2,1], [4,2,1,3], [1,4,3,1]];

const test1 = [[0,0,0,0,0,0,0,0,0,0,0], [2,2,4,4], [3,3,1,1]];
const test2 = [[0,0,0,0,0,0,0,0,0,0,0], [2,2,4,4], [4,3,2,1], [4,2,1,3], [3,3,1,1]];

const done = grid => {
    let passed = grid[0].every(c => c === 0);
    for (let i = 1; i < grid.length; i++) {
        passed = passed && grid[i].every((c, j) => c === j + 1);
    } 
    return passed;
}

const power = [0, 1, 10, 100, 1000]

const moveHome = (grid, i) => {
    const cell = grid[0][i];
    if (cell === 0) return [0, []];
    // can it get to the home column?
    const homeCol = cell * 2;
    if (i < homeCol && grid[0].slice(i+1, homeCol).some(v => v !== 0)) return [0, []];
    if (i > homeCol && grid[0].slice(homeCol, i).some(v => v !== 0)) return [0, []];
    for (let j = grid.length-1; j > 0; j--) {
        const c2 = grid[j][cell-1];
        if (c2 === 0) {
            const result = [
                (Math.abs(cell * 2 - i) + j) * power[cell], 
                grid.map((row, a) => row.map((col, b) => {
                    if (a === 0 && b === i) return 0;
                    if (a === j && b === cell-1) return cell;
                    return col;
                }))
            ];
            return result;
        }
        if (c2 !== cell) return [0, []];
    }
};

const possibleMoves = (grid, i, j) => {
    const moves = [];
    const cell = grid[i][j];
    if (cell === 0) return moves;
    if (i > 1 && grid[i-1][j] !== 0) return moves;
    if (cell === j + 1) {
        let home = true;
        for (let k = i+1; k < grid.length; k++) {
            home = grid[k][j] === cell;
            if (!home) break;
        }
        if (home) return moves;
    }
    for (let l = 2 * j + 1; l >= 0; l--) {
        if (l === 0 || l % 2 === 1) {
            const c2 = grid[0][l];
            if (c2 !== 0) break;
            moves.push([
                (i + j * 2 + 2 - l) * power[cell], 
                grid.map((row, a) => row.map((col, b) => {
                    if (a === 0 && b === l) return cell;
                    if (a === i && b === j) return 0;
                    return col;
                }))
            ]);
        }
    }
    for (let r = 2 * j + 3; r < 11; r++) {
        if (r === 10 || r % 2 === 1) {
            const c2 = grid[0][r];
            if (c2 !== 0) break;
            moves.push([(
                i + r - 2 - j * 2) * power[cell], 
                grid.map((row, a) => row.map((col, b) => {
                    if (a === 0 && b === r) return cell;
                    if (a === i && b === j) return 0;
                    return col;
                }))
            ]);
        }
    }
    return moves;
};

const solve = function* (cost, grid) {
    if (done(grid)) {
        yield [cost, grid];
    }
    for (let i = 0; i < grid[0].length; i++) {
        const [c, g] = moveHome(grid, i);
        if (c) yield* solve(cost + c, g);
    }
    for (let i = 1; i < grid.length; i++) {
        for (let j = 0; j < 4; j++) {
            const moves = possibleMoves(grid, i, j);
            for (let k = 0;  k < moves.length; k++) {    
                yield* solve(cost + moves[k][0], moves[k][1]);
            }
        }
    }
}

const process = grid => {
    let minCost = 999999;
    for (let [cost, g] of solve(0, grid)) {
        if (cost < minCost) {
            minCost = cost;
            console.log(minCost);
        }
    }
    console.log(minCost);
}
process(test1);
// process(test2);