'use strict';
const fs = require("fs");

const getData = (raw) => {
    const decodeLine = l => {
        const packet = JSON.parse(l);
        return packet;
    };
    return raw.split('\n\n').map(p => p.split('\n').map(l => decodeLine(l)));
}

const compareItems = (l, r) => {
    // console.log(l, r);
    if (typeof l === 'number') {
        if (typeof r === 'number') return l - r;
        if (r.length === 0) return 1;
        if (r.length === 1) return compareItems(l, r[0]);
        const res = compareItems(l, r[0]);
        return (res <= 0) ? -1 : 1;
    }
    if (typeof r === 'number') {
        if (l.length === 0) return -1;
        if (l.length === 1) return compareItems(l[0], r);
        const res = compareItems(l[0], r);
        return (res < 0) ? -1 : 1;
    }
    // both arrays
    for (let i = 0; i < r.length; i++) {
        if (i === l.length) return -1;
        const result = compareItems(l[i], r[i]);
        if (result !== 0) return result;            
    }
    return (l.length === r.length) ? 0 : 1;
}

const correctOrder = ([left, right]) => {
    const res = compareItems(left, right) <= 0;
    // console.log(res);
    // if (!res) { console.log(left); console.log(right); }
    return res;
}

const process = (err, data) => {
    if (err) throw err;
    const pairs = getData(data);
    // console.log(pairs);
    console.log(pairs.reduce((t, p, i) => t += correctOrder(p) ? i + 1 : 0, 0));
    const packets = pairs.flat();
    packets.push([[2]]);
    packets.push([[6]]);
    packets.sort((a, b) => compareItems(a, b));
    console.log(packets.length);
    const start = 1 + packets.findIndex(p => p[0] && p[0][0] === 2);
    const end = 1 + packets.findIndex(p => p[0] && p[0][0] === 6);
    console.log(start * end);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
