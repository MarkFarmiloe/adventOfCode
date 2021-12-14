'use strict';
const fs = require("fs");

const getData = (data) => {
    let parts = data
        .trim().replace(/\r/g, '').split('\n\n')
        .map(l => l.trim());
    let template = parts[0].split('').reduce((a, c, i, array) => {
        if (i < array.length - 1) a.push(c + array[i + 1]);
        return a;
    }, []);
    let folds = parts[1].split('\n').map(l => l.split(' -> '));
    let pairs = {};
    folds.forEach(([k, v]) => pairs[k] = [v, 0]);
    template.forEach(p => pairs[p][1]++);
    return pairs;
};

const grow = (pairs) => {
    let zeroedPairs = Object.entries(pairs).reduce((a, [k, [c, v]]) => { a[k] = [c, 0]; return a; }, {});
    return Object.entries(pairs).reduce((a, [p, [c, v]]) => {
        let l = p[0] + c;
        let r = c + p[1];
        a[l][1] += v;
        a[r][1] += v;
        return a;
    }, zeroedPairs);
};

const reportAnswer = (pairs) => {
    const counts = Object.entries(pairs).reduce((a, [k, [_, v]]) => {
        for (let i = 0; i < 2; i++) {
            const c = k[i];
            a[c] = a[c] ? a[c] + v : v;
        }
        return a;
    }, {});
    let answer = Object.values(counts).reduce(([x, n], v) => {
        x = x > v ? x : v;
        n = n < v ? n : v;
        return [x, n];
    }, [0, 999999999999999999]);
    answer = [
        (answer[0] % 2 ? answer[0] + 1 : answer[0]) / 2,
        (answer[1] % 2 ? answer[1] + 1 : answer[1]) / 2
    ];
    console.log(answer[0] - answer[1]);
};

const process = (err, data) => {
    if (err) throw err;
    let pairs = getData(data);    
    for (let i = 0; i < 10; i++) {
        pairs = grow(pairs);
    }
    reportAnswer(pairs);
    for (let i = 0; i < 30; i++) {
        pairs = grow(pairs);
    }
    reportAnswer(pairs);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
