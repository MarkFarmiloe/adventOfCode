'use strict';
const fs = require("fs");
const { decode } = require("punycode");

const segments = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 
                  'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];

// 2 = 1, 3 = 7, 4 = 4, 5 = 2 3 5, 6 = 0 6 9, 7 = 8

const getData = (data) => {
    return data.trim().replace(/\r/g, '').split('\n').map(l => extractInOut(l));
};

const extractInOut = line => {
    return line.split(' | ').map(s => s.split(' '));
}

const unique = (a, b) => a.split('').filter(c => !b.includes(c)).join('');

const both = (a, b) => a.split('').filter(c => b.includes(c)).join('');

const decodeIns = ins => {
    ins.sort((a, b) => a.length - b.length);
    // console.log(ins);
    let wires = {};
    wires.a = unique(ins[1], ins[0]);
    wires.cf = ins[0];
    wires.bd = unique(ins[2], ins[0]);
    wires.abfg = both(ins[6], both(ins[7], ins[8]));
    wires.cde = unique(ins[9], wires.abfg);
    wires.d = both(wires.bd, wires.cde);
    wires.b = unique(wires.bd, wires.d);
    wires.c = both(wires.cf, wires.cde);
    wires.f = unique(wires.cf, wires.c);
    wires.e = unique(unique(wires.cde, wires.c), wires.d);
    wires.g = unique(unique(unique(wires.abfg, wires.a), wires.b), wires.f);
    // console.log(wires);
    return [
        [wires.a, wires.b, wires.c, wires.e, wires.f, wires.g].sort().join(''),
        [wires.c, wires.f].sort().join(''),
        [wires.a, wires.c, wires.d, wires.e, wires.g].sort().join(''),
        [wires.a, wires.c, wires.d, wires.f, wires.g].sort().join(''),
        [wires.b, wires.c, wires.d, wires.f].sort().join(''),
        [wires.a, wires.b, wires.d, wires.f, wires.g].sort().join(''),
        [wires.a, wires.b, wires.d, wires.e, wires.f, wires.g].sort().join(''),
        [wires.a, wires.c, wires.f].sort().join(''),
        [wires.a, wires.b, wires.c, wires.d, wires.e, wires.f, wires.g].sort().join(''),
        [wires.a, wires.b, wires.c, wires.d, wires.f, wires.g].sort().join('')
    ];

};

const process = (err, data) => {
    if (err) throw err;
    const lines = getData(data);
    // console.log(lines);
    const count = lines.reduce((a, [_, outs]) => {
        return a + outs.reduce((b, s) => b + ([2,4,3,7].includes(s.length) ? 1 : 0), 0);
    }, 0);
    console.log(count);
    const count2 = lines.reduce((a, [ins, outs]) => {
        const digits = decodeIns(ins);
        // console.log(digits);
        // console.log(outs);
        const number = outs.reduce((a, out) => {
            return a * 10 + digits.findIndex(d => d === out.split('').sort().join(''));
        }, 0);
        // console.log(number);
        return a + number;
    }, 0);
    console.log(count2);

}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
