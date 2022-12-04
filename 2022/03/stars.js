'use strict';
const fs = require("fs");

const chars = '0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 

const getData = (raw) => {
    return raw.split('\n');
} 

const processRucksack = (rucksack) => {
    const midpoint = rucksack.length / 2;
    const l = rucksack.slice(0, midpoint);
    const r = rucksack.slice(midpoint);
    for (const c of l) {
        if (r.includes(c)) return chars.indexOf(c);
    }
    return NaN;
}

const processGroup = ([r1, r2, r3]) => {
    for (const c of r1) {
        if (r2.includes(c) && r3.includes(c)) return chars.indexOf(c);
    }
    return NaN;
}

const process = (err, data) => {
    if (err) throw err;
    const rucksacks = getData(data);
    console.log(rucksacks.reduce((a, r) => a + processRucksack(r), 0));
    const groups = rucksacks.reduce(([a, t], r) => {
        t.push(r);
        if (t.length === 3) {
            a.push(t);
            t = [];
        }
        return [a, t]; 
    }, [[], []])[0];
    console.log(groups.reduce((a, g) => a + processGroup(g), 0));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
