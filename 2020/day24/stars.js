'use strict';
const fs = require("fs");

const extractSteps = (line) => {
    return line.trim().split('').reduce(([acc, prev], c) => {
        switch (c) {
            case 'n':
                if (prev !== '') console.log('OOPS');
                prev = 'n';
                break;
            case 's':
                if (prev !== '') console.log('OOPS');
                prev = 's';
                break;
            case 'e':
                acc.push((prev === '' ? 2 : (prev === 'n' ? 1 : 3)));
                prev = '';
                break;
            case 'w':
                acc.push((prev === '' ? 5 : (prev === 'n' ? 0 : 4)));
                prev = '';
                break;
            default:
                console.log('OOPS');
                break;
        }
        return [acc, prev];
    }, [[], ''])[0];
}

const dayFlip = (blackTiles) => {
    const newTiles = [];
    const whiteTiles = {};
    blackTiles.forEach(([e, nw]) => {
        let black = 0;
        for (let i = 0; i < 6; i++) {
            const inw = ((i + 1) % 3 === 0 ? 0 : (i < 3 ? 1 : -1));
            const ie = (i % 3 === 0 ? 0 : (i < 3 ? 1 : -1));
            const s = [e + ie, nw + inw];
            if (blackTiles.filter((t => t[0] === s[0] && t[1] === s[1])).length > 0) {
                black++;
            } else {
                if (whiteTiles.hasOwnProperty(s)) whiteTiles[s] += 1; else whiteTiles[s] = 1;
            }
        }
        if (black === 1 || black === 2) newTiles.push([e, nw]); 
    });
    Object.entries(whiteTiles).filter(([k, v]) => v === 2).forEach(([k, v]) => newTiles.push(k.split(',').map(x => Number.parseInt(x))));
    return newTiles.sort((a, b) => (a[0] - b[0] === 0 ? a[1] - b[1] : a[0] - b[0]));
}

const process = (err, data) => {
    if (err) throw err;
    const steps = data.replace(/\r/g, '').split('\n').map(extractSteps);
    // console.log(steps);
    const normalisedSteps = steps.map(step => step.reduce(([e, nw], s) => {
        switch (s) {
            case 0:
                nw++;
                break;
            case 1:
                nw++;
                e++;
                break;
            case 2:
                e++;
                break;
            case 3:
                nw--;
                break;
            case 4:
                nw--;
                e--;
                break;
            case 5:
                e--;
                break;
            default:
                console.log('OOPS', s);
                break;
        }
        return [e, nw];
    }, [0, 0]));
    // console.log(normalisedSteps);
    const tileFlips = normalisedSteps.reduce((acc, s) => {
        if (acc.hasOwnProperty(s)) acc[s] += 1; else acc[s] = 1;
        return acc;
    }, {});
    // console.log(tileFlips);
    let blackTiles = Object.entries(tileFlips).filter(([k, v]) => v % 2 === 1).
        map(([k, v]) => k.split(',').map(x => Number.parseInt(x))).
        sort((a, b) => (a[0] - b[0] === 0 ? a[1] - b[1] : a[0] - b[0]));
    console.log(blackTiles.length);
    for (let i = 0; i < 100; i++) {
        // console.log(blackTiles);
        blackTiles = dayFlip(blackTiles);
        // console.log(`Day ${i + 1}: ${blackTiles.length}`);    
    }
    console.log(blackTiles.length);    
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
