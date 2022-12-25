'use strict';
const fs = require("fs");

const getData = (raw) => {
    return raw.split('\n').map(parseSNAFU);
}

const parseSNAFU = l => {
    let v = 0;
    let m = 1;
    for (let i = l.length - 1; i >= 0; i--) {
        switch (l[i]) {
            case '2':
                v += m * 2;
                break;
            case '1':
                v += m;
                break;
            case '0':
                break;
            case '-':
                v -= m;
                break;
            case '=':
                v -= m * 2;
                break;
            default:
                throw new Error("OOPS");
                break;
        };
        m *= 5;
    }
    return v;
};

const toSNAFU = v => {
    const codes = '=-012';
    let s = '';
    while (v > 0) {
        const r = (v + 2) % 5;
        s = codes[r] + s;
        v = (v + 2 - r) / 5;
    }
    return s;
};

const process = (err, data) => {
    if (err) throw err;
    const values = getData(data);
    const total = values.reduce((t, v) => t += v, 0);
    console.log(toSNAFU(total));
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
