'use strict';
const fs = require("fs");

const getData = (data) => {
    let pairs = data
        .trim().replace(/\r/g, '').split('\n')
        .map(l => l.trim().split('-'));
    return pairs.reduce((a, [l, r]) => {
        if (l !== "end" && r !== "start") a[l] = (a[l] ? a[l].concat([r]) : [r]);
        if (r !== "end" && l !== "start") a[r] = (a[r] ? a[r].concat([l]) : [l]);
        return a;
    }, {});    
};

const findPaths = (path, cave, links, paths, runTwo) => {
    if (cave.match(/[a-z]/) 
        && path.includes(cave) 
        && (!runTwo || path.match(/([a-z]+,)(?=.+\1)/))) return paths;
    path += cave +  ",";
    if (cave === "end") return paths.includes(path) ? paths : paths.concat([path]);
    links[cave].forEach(nextCave => paths = findPaths(path, nextCave, links, paths, runTwo));
    return paths;
};

const process = (err, data) => {
    if (err) throw err;
    let links = getData(data);
    console.log(links);
    let paths = links["start"].reduce((a, cave) => findPaths("", cave, links, a), []);
    console.log(paths.length);
    let paths2 = links["start"].reduce((a, cave) => findPaths("", cave, links, a, true), []);
    // paths2.sort();
    // console.log(paths2);
    console.log(paths2.length);
}

// fs.readFile("./test.txt", 'utf8', process);
// fs.readFile("./test1.txt", 'utf8', process);
// fs.readFile("./test2.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
