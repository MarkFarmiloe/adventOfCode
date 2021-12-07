'use strict';
const fs = require("fs");
const { Agent } = require("http");

const getData = (data) => {
    const crabs = data.trim().split(',').map(n => Number.parseInt(n));
    // console.log(Math.max(...crabs));
    return [crabs.reduce((a, c) => {
        a[c] = 1 + (a[c] ? a[c] : 0);
        return a;
    }, new Array(Math.max(...crabs))), crabs.length];
};

const sumTo = n => n * (n + 1) / 2;

const process = (err, data) => {
    if (err) throw err;
    const [positions, len] = getData(data);
    // console.log(positions, len);
    const [_, pivot] = positions.reduce(
        ([s, v], p, i) => s * 2 < len ? [s + p, i] : [s, v]
        , [0, 0]);
    // console.log(sum, pivot);
    const fuel = positions.reduce((a, p, i) => a + p * Math.abs(pivot - i), 0);
    console.log(fuel);
    let minFuel = 999999999999;
    for (let i = 0; i < positions.length; i++) {
        const fuel = positions.reduce((a, p, j) => a + p * sumTo(Math.abs(j - i)), 0);
        // console.log(i, fuel);
        if (fuel < minFuel) minFuel = fuel; 
    }
    console.log(minFuel);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
