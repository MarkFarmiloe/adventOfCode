'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split('').map(d => Number.parseInt(d)));
} 

const getVisible = (trees) => {
    let visible = (trees[0].length - 1 + trees.length - 1) * 2;
    const maxhc = trees[0].slice(0);
    for (let r = 1; r < trees.length - 1; r++) {
        const row = trees[r];
        let maxhr = row[0];
        for (let c = 1; c < row.length - 1; c++) {
            const h = row[c];
            let hidden = true;
            if (h > maxhr) {
                maxhr = h;
                visible++;
                hidden = false;
            }
            if (h > maxhc[c]) {
                maxhc[c] = h;
                if (hidden) {
                    hidden = false;
                    visible++;
                }
            }
            if (hidden) {
                hidden = false;
                for (let i = c + 1; i < row.length; i++) {
                    if (row[i] >= h) {
                        hidden = true;
                        break;
                    }
                }
                if (hidden) {
                    hidden = false;
                    for (let i = r + 1; i < trees.length; i++) {
                        if (trees[i][c] >= h) {
                            hidden = true;
                            break;
                        }
                    }
                }
                if (! hidden) visible++;
            }
        }
    }
    return visible;
}

const getScenicScore = (trees) => {
    let scenicScore = 0;
    for (let r = 1; r < trees.length - 1; r++) {
        const row = trees[r];
        for (let c = 1; c < row.length - 1; c++) {
            const h = row[c];
            let west = 0;
            for (let i = c - 1; i >= 0; i--) {
                west++;
                if (row[i] >= h) break;
            }
            let north = 0;
            for (let i = r - 1; i >= 0; i--) {
                north++;
                if (trees[i][c] >= h) break;
            }
            let east = 0;
            for (let i = c + 1; i < row.length; i++) {
                east++;
                if (row[i] >= h) break;
            }
            let south = 0;
            for (let i = r + 1; i < trees.length; i++) {
                south++;
                if (trees[i][c] >= h) break;
            }
            const ss = north * east * south * west;
            if (ss > scenicScore) scenicScore = ss;
        }
    }
    return scenicScore;
}

const process = (err, data) => {
    if (err) throw err;
    const trees = getData(data);
    const visible = getVisible(trees);
    console.log(visible);
    console.log(getScenicScore(trees));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
