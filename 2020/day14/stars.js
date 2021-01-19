'use strict';
const fs = require("fs");

const masked = (m, v) => {
    for (let i = 0, div = Math.pow(2, 35); i < m.length; i++, div /= 2) {
        const bit = m[i];
        if (bit !== 'X') {
            const b = Math.floor(v / div) % 2;
            if (b != bit) { // NOT absolute non-equality
                v += b ? -div : div;
            }
        }
    }
    return v;
}

const memTotal = (instructions) => {
    let mask = 'X'.repeat(36);  
    const mem = instructions.reduce((m, [pos, v]) => {
        if (pos === -1) { mask = v; return m; }
        m[pos] = masked(mask, v);
        return m;
    }, {});
    return Object.values(mem).reduce((a, m) => a + m, 0);
}

const updateMemory = (mem, mask, pos, value) => {
    const floats = [], origPos = pos;
    for (let i = 0, div = Math.pow(2, 35); i < mask.length; i++, div /= 2) {
        const bit = mask[i];
        const b = Math.floor(pos / div) % 2;
        // const b = ((pos - (pos % div)) / div) % 2;
        // console.log(div, bit, b, pos, typeof div, typeof pos);
        switch (bit) {
            case 'X':
                floats.push(div);
                pos -= b === 0 ? 0 : div;
                break;
            case '0':  
                break;
            case '1':
                pos += b === 0 ? div : 0;
                break;
            default:
                throw 'OOPS';
        }
    }
    const expFloats = floats.reduce((a, i) => {
        return a.concat(a.map(f => f + i));
    }, [0]);
    // const currIndexes = Object.keys(mem);
    // let newEntries = 0;
    for (let i = 0; i < expFloats.length; i++) {
        const index = pos + expFloats[i];
        // if (!currIndexes.includes(`${index}`)) newEntries++;
        mem[index] = value;
    }
    // console.log(origPos, mask, pos, floats, expFloats);
    // if (Object.keys(mem).length !== currIndexes.length + newEntries) {
    //     console.log(currIndexes);
    //     throw `OUCH: ${Object.values(mem).length} != ${currIndexes.length} + ${newEntries}`;
    // }
    return mem;
}

const memTotal2 = (instructions) => {
    let mask = 'X'.repeat(36);  
    const mem = instructions.reduce((m, [pos, v]) => {
        if (pos === -1) { mask = v; return m; }
        return updateMemory(m, mask, pos, v);
    }, {});
    const values = Object.values(mem);
    // console.log(values.length);
    return values.reduce((a, m) => a + m, 0);
}

const decodeLine = (l) => {
    const re = /mem\[(\d+)/;
    const [a, v] = l.split(' = ').map(s => s.trim());
    if (a === 'mask') return [-1, v];
    return [Number.parseInt(a.match(re)[1]), Number.parseInt(v.trim())];
}

const process = (err, data) => {
    if (err) throw err;
    const instructions = data.split("\n").map(decodeLine);

    console.log(memTotal(instructions));

    console.log(memTotal2(instructions));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
