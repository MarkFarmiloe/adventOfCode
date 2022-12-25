'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(''));
}

const levels = 'abcdefghijklmnopqrstuvwxyzE';

const getSteps = (grid, startAtA) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const steps = [];
    for (let i = 0; i < grid.length; i++) {
        steps[i] = [];
    }
    let S = [];
    let E = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 'S') {
                S = [r, c];
            }
            if (grid[r][c] === 'E') {
                E = [r, c];
            }
            if (startAtA && grid[r][c] === 'a') steps[r][c] = 1;
        }
        if (S.length > 0 && E.length > 0 && !startAtA) break;
    }
    steps[S[0]][S[1]] = 1;
    let step = 1;
    const doStep = () => {
        const canMove = (r, c, r1, c1) => {
            const currLevel = Math.max(0, levels.indexOf(grid[r][c]));
            const destLevel = Math.min(25, levels.indexOf(grid[r1][c1]));
            return destLevel - currLevel < 2;
        };
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (steps[row][col] === step) {
                    if (row > 0 && !steps[row - 1][col] && canMove(row, col, row - 1, col)) 
                        steps[row - 1][col] = step + 1; 
                    if (row < rows - 1 && !steps[row + 1][col] && canMove(row, col, row + 1, col)) 
                        steps[row + 1][col] = step + 1; 
                    if (col > 0 && !steps[row][col - 1] && canMove(row, col, row, col - 1)) 
                        steps[row][col - 1] = step + 1; 
                    if (col < cols - 1 && !steps[row][col + 1] && canMove(row, col, row, col + 1)) 
                        steps[row][col + 1] = step + 1;
                }
                if (steps[E[0]][E[1]]) return true;
            }
        }
        return false;
    };
    while (step < 1000) {
        if (doStep()) break;
        step++;
    }
    return step;
}

const process = (err, data) => {
    if (err) throw err;
    const grid = getData(data);
    console.log(getSteps(grid, false));
    console.log(getSteps(grid, true));
}

fs.readFile("./test.txt", 'utf8', process);
// fs.readFile("./input.txt", 'utf8', process);
