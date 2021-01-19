const fs = require("fs");

const countNeighbours = (grid, r, c) => {
    let count = 0;
    for (let i = (r === 0 ? r : r - 1); i <= (r === grid.length - 1 ? r : r + 1); i++) {
        const row = grid[i];
        for (let j = (c === 0 ? c : c - 1); j <= (c === row.length - 1 ? c : c + 1); j++) {
            const seat = row[j];
            count += (seat === 1 && (i !== r || j !== c)) ? 1 : 0;
        }
    }
    return count;
}

const countNeighbours2 = (grid, r, c) => {
    let count = 0;
    // left
    for (let i = c - 1; i >= 0; i--) {
        const seat = grid[r][i];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // right
    for (let i = c + 1; i < grid[0].length; i++) {
        const seat = grid[r][i];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // up
    for (let i = r - 1; i >= 0; i--) {
        const seat = grid[i][c];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // down
    for (let i = r + 1; i < grid.length; i++) {
        const seat = grid[i][c];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // NW
    for (let i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) {
        const seat = grid[i][j];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // NE
    for (let i = r - 1, j = c + 1; i >= 0 && j < grid[0].length; i--, j++) {
        const seat = grid[i][j];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // SW
    for (let i = r + 1, j = c - 1; i < grid.length && j >= 0; i++, j--) {
        const seat = grid[i][j];
        if (seat === null) continue;
        count += seat;
        break;
    }
    // SE
    for (let i = r + 1, j = c + 1; i < grid.length && j < grid[0].length; i++, j++) {
        const seat = grid[i][j];
        if (seat === null) continue;
        count += seat;
        break;
    }
    return count;
}

const nextGrid = (grid, cn, minN) => {
    let stable = true;
    const newGrid = grid.map(r => r.map(s => s));
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const seat = row[j];
            if (seat === null) continue;
            const neighbours = cn(grid, i, j);
            if (seat === 0) {
                if (neighbours === 0) {
                    newGrid[i][j] = 1;
                    stable = false;
                }
            } else {
                if (neighbours >= minN) {
                    newGrid[i][j] = 0;
                    stable = false;
                }
            }
        }
    }
    return [stable, newGrid];
}

const countAtStability = (grid, cn, minN) => {
    let i = 0;
    for (let stable = false; !stable; i++) {
        [stable, grid] = nextGrid(grid, cn, minN);
    }
    return grid.reduce((a,r) => { 
        return a + r.reduce((b,s) => b + (s === 1 ? 1 : 0),0);
    }, 0);
}

const decodeLine = (l) => {
    const values = [];
    for (let c of l.trim()) {
        values.push((c === '.') ? null : 0);
    }
    return values;
}

const process = (err, data) => {
    if (err) throw err;
    const grid = data.split("\n").map(decodeLine);
    console.log(countAtStability(grid, countNeighbours, 4));

    console.log(countAtStability(grid, countNeighbours2, 5));
};

fs.readFile("./input.txt", 'utf8', process);
