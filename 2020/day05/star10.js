const fs = require("fs");
const { moveMessagePortToContext } = require("worker_threads");

const seatID = (code) => {
    const asBinary = code.trim()
        .replace(/F/g, '0')
        .replace(/B/g, '1')
        .replace(/L/g, '0')
        .replace(/R/g, '1');
    const val = Number.parseInt(asBinary, 2);
    return val;
}

const findGaps = (a, v, i, s) => {
    if (i === 0) return a;
    let p = s[i - 1];
    p++;
    while (v > p) { a.push(p); p++; }
    return a;
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.split("\n");
    const ids = lines.map(seatID).sort((a,b) => a - b);
    // console.log(ids, ids.slice(100,200));
    // console.log(ids.slice(200,300), ids.slice(300,400));
    // console.log(ids.slice(400,500), ids.slice(500,600));
    // console.log(ids.slice(600,700), ids.slice(700,800));
    // console.log(ids.slice(800,900), ids.slice(900));
    console.log(ids.reduce(findGaps, []));
};

fs.readFile("./input.txt", 'utf8', process);
