'use strict';
const fs = require("fs");
const { decode } = require("punycode");

const getData = (data) => {
    return data.trim().replace(/\r/g, '').split('\n').map(l => l.trim().split('').map(d => Number.parseInt(d)));
};

let grid = [[]];
let height = 0;
let width = 0;

const getLowPoints = () => {
    return grid.reduce((a, row, i) => {
        return a.concat(row.reduce((b, d, j) => {
            let lowPoint = 
                (i == 0 || grid[i-1][j] > d) &&
                (j == 0 || grid[i][j-1] > d) &&
                (i == grid.length - 1 || grid[i+1][j] > d) &&
                (j == row.length - 1 || grid[i][j+1] > d);
            if (lowPoint) b.push([i, j, d])
            return b;
        }, []));
    }, []);
}

const expandRegion = (count, row, column) => {
    // console.log("E", row, column, grid);
    if (grid[row][column] == 9) return count;
    if (row > 0             && grid[row-1][column]   < 9) { grid[row-1][column]   += 10; count++ };
    // console.log(grid);
    if (column > 0          && grid[row]  [column-1] < 9) { grid[row]  [column-1] += 10; count++ };
    // console.log(grid);
    if (row < height - 1     && grid[row+1][column]   < 9) { grid[row+1][column]   += 10; count++ };
    // console.log(grid);
    if (column < width - 1 && grid[row]  [column+1] < 9) { grid[row]  [column+1] += 10; count++ };
    // console.log(grid);
    grid[row][column] += 10;
    // console.log(grid);
    // return count;
    if (row > 0             && grid[row-1][column] < 19) count = expandRegion(count, row-1, column);
    if (column > 0          && grid[row][column-1] < 19) count = expandRegion(count, row, column-1);
    if (row < height - 1     && grid[row+1][column] < 19) count = expandRegion(count, row+1, column);
    if (column < width - 1 && grid[row][column+1] < 19) count = expandRegion(count, row, column+1);
    return count;
}

const getBasinSize = ([row, column, _]) => {
    // console.log(row, column);
    grid[row][column] += 10;
    let count = 1;
    return expandRegion(count, row, column);
}

const getLargestBasins = (lowPoints) => {
    return lowPoints.reduce(([a, b, c], lowPoint) => {
        const basinSize = getBasinSize(lowPoint);
        // console.log(basinSize);
        if (basinSize > a) return [basinSize, a, b];
        if (basinSize > b) return [a, basinSize, b];
        if (basinSize > c) return [a, b, basinSize];
        return [a, b, c];
    }, [0, 0, 0]);
}

const process = (err, data) => {
    if (err) throw err;
    grid = getData(data);
    height = grid.length;
    width = grid[0].length;
    // console.log(grid);
    const lowPoints = getLowPoints();
    // console.log(lowPoints);
    console.log(lowPoints.reduce((a, [i, j, d]) => a + 1 + d, 0));
    const [a, b, c] = getLargestBasins(lowPoints);
    // console.log(a, b, c, grid);
    console.log(a * b * c);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
