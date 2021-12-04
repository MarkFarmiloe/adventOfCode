'use strict';
const fs = require("fs");

const getDiags = (data) => {
    return data
        .trim()
        .split('\n')
        .map(l => Array.from(l.trim()).map(d => Number.parseInt(d)));
};

const getMCD = (array, index) => {
    const pivot = array.length / 2;
    let count = 0;
    array.forEach(row => {
        count += row[index];
    });
    return count < pivot ? 0 : 1;
}

const binaryToBase10 = array => {
    return array.reduce((acc, b) => acc = acc * 2 + b, 0);
}

const process = (err, data) => {
    if (err) throw err;
    const diags = getDiags(data);
    const counts = new Array(diags[0].length).fill(0);
    for (let i = 0; i < diags.length; i++) {
        const row = diags[i];
        for (let j = 0; j < row.length; j++) {
            const bit = row[j];
            counts[j] += bit;
        }
    }
    const rows = diags.length / 2;
    const [gamma, epsilon] = counts.reduce(([g, e], c) => {
        g *= 2;
        e *= 2;
        if (c > rows) g++; else e++;
        return [g, e];
    }, [0, 0]);
    console.log(gamma, epsilon, gamma * epsilon); 
// next star
    const firstG = gamma > epsilon ? 1 : 0;
    let o2 = diags.filter(r => r[0] === firstG);
    let co2 = diags.filter(r => r[0] !== firstG);
    for (let i = 1; 1 < o2.length; i++) {
        const mcd = getMCD(o2, i);
        o2 = o2.filter(r => r[i] === mcd);
    }
    for (let i = 1; 1 < co2.length; i++) {
        const mcd = getMCD(co2, i);
        co2 = co2.filter(r => r[i] !== mcd);
    }
    o2 = binaryToBase10(o2[0]);
    co2 = binaryToBase10(co2[0]);
    console.log(o2, co2, o2 * co2); 
}

fs.readFile("./input.txt", 'utf8', process);
