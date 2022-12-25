'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(l => l.split(' '));
} 

const getFolderSizes = (folder) => {
    let results = [];
    const getFolderSize = (f, path) => {
        let total = 0;
        for (const key in f) {
            if (f.hasOwnProperty(key)) {
                if (key !== '..') {
                    const value = f[key];
                    if (typeof value === 'number') total += value;
                    else total += getFolderSize(value, path + key + '/');
                }
            }
        }
        results.push([path, total]);
        return total;
    }
    getFolderSize(folder, '/');
    return results;
}

const process = (err, data) => {
    if (err) throw err;
    const terminal = getData(data);
    const drive = {};
    let folder = {};
    terminal.forEach(([a, b, c]) => {
        if (a === '$') {
            if (b === 'cd') {
                if (c === '/') folder = drive;
                else if (c === '..') folder = folder['..'];
                else {
                    if (typeof folder[c] === 'undefined') {
                        folder[c] = {};
                        folder[c]['..'] = folder;
                    }
                    folder = folder[c];
                }
            }
            // ignore ls
        } else {
            if (a === 'dir') {
                ; // ignore dir
            } else {
                folder[b] = Number.parseInt(a);
            }
        }
    });
    // console.log(drive);
    const folderSizes = getFolderSizes(drive); 
    // console.log(folderSizes);
    // console.log(folderSizes.slice(100));
    console.log(folderSizes.reduce((a, [k, v]) => a + (v <= 100000 ? v : 0), 0));
    const need = 30000000 - (70000000 - folderSizes.filter(f => f[0] === '/')[0][1]);
    const dump = folderSizes.filter(f => f[1] >= need).sort((a, b) => a[1] - b[1])[0];
    console.log(need, dump);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
