'use strict';
const fs = require("fs");

const getData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(d => parseInt(d));

}

const mix = (codes, key, count) => {
    let iCodes = codes.map((c, i) => [i, c]);
    const modulo = iCodes.length - 1;
    console.log(iCodes);
    for (let j = 0; j < count; j++) {
        for (let i = 0; i < iCodes.length; i++) {
            const currPos = iCodes.findIndex(c => c[0] === i);
            const moveMe = iCodes[currPos];
            let moveBy = (moveMe[1] * key) % modulo;
            if (moveBy < 0) moveBy += modulo;
            if (moveBy === 0) continue;
            let moveTo = currPos + moveBy
            if (moveTo > modulo) moveTo = moveTo - modulo;
            let moveFrom = currPos;
            if (currPos < moveTo) {
                moveTo++; // inserting before deleting.
            } else {
                moveFrom++;
            }
            iCodes.splice(moveTo, 0, iCodes[currPos]);
            // console.log(i, moveBy, moveTo, moveFrom, iCodes.map(([i, c]) => c).join(', '));
            iCodes.splice(moveFrom, 1);
            // console.log(iCodes.map(([i, c]) => c).join(', '));
        }
    }
    return iCodes.map(([i, c]) => c);
}

const process = (err, data) => {
    if (err) throw err;
    let codes = getData(data);
    console.log(codes);
    codes = mix(codes, 1, 1);
    const len = codes.length;
    const offset = 1000;
    let zeroAt = codes.findIndex(c => c === 0);
    let numbers = [
        codes[(zeroAt + offset) % len],
        codes[(zeroAt + 2 * offset) % len],
        codes[(zeroAt + 3 * offset) % len]
    ];
    console.log(numbers, numbers.reduce((s, n) => s + n, 0));

    codes = getData(data);
    const key = 811589153;
    codes = mix(codes, key % (len - 1), 10);
    zeroAt = codes.findIndex(c => c === 0);
    numbers = [
        codes[(zeroAt + offset) % len],
        codes[(zeroAt + 2 * offset) % len],
        codes[(zeroAt + 3 * offset) % len]
    ];
    console.log(numbers, numbers.reduce((s, n) => s + n, 0));
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
