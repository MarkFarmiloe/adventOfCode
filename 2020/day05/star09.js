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

const process = (err, data) => {
    if (err) throw err;
    const lines = data.split("\n");
    console.log(lines.map(seatID).reduce((a, c) => (a > c) ? a : c, 0));
};

fs.readFile("./input.txt", 'utf8', process);
