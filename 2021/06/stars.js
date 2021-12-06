'use strict';
const fs = require("fs");
const { Agent } = require("http");

const getData = (data) => {
    const fish = data.trim().split(',').map(n => Number.parseInt(n));
    const days = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    return fish.reduce((d, f) => { d[f] += 1; return d; }, days);
};

const age = fish => {
    const newFish = fish[0];
    for (let i = 0; i < 8; i++) {
        fish[i] = fish[i + 1];
    }
    fish[8] = newFish;
    fish[6] += newFish;
};

const process = (err, data) => {
    if (err) throw err;
    const fish = getData(data);
    for (let i = 0; i < 80; i++) {
        age(fish);      
    }
    console.log(fish.reduce((a, f) => a + f));
    for (let i = 80; i < 256; i++) {
        age(fish);      
    }
    console.log(fish.reduce((a, f) => a + f));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
