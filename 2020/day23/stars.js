'use strict';
const fs = require("fs");

const extractPack = (lines) => {
    return lines.trim().split('\n').slice(1).map(l => Number.parseInt(l.trim()));
}

const playRound = ([p0, p1]) => {
    const [c0, c1] = [p0.shift(), p1.shift()];
    if (c0 > c1) {
        p0.push(c0);
        p0.push(c1);
    } else {
        p1.push(c1);
        p1.push(c0);
    }
}

const playRecursiveCombat = (packs, level = 0) => {
    const historyPacks = [packs];
    // console.log(historyPacks);
    // console.log('---', packs);
    const [p0, p1] = [[...packs[0]], [...packs[1]]];
    while (p0.length && p1.length) {
        const [c0, c1] = [p0.shift(), p1.shift()];
        let winner, show;
        if (c0 <= p0.length && c1 <= p1.length) {
            // console.log('L', level, 'c', c0, c1, 'p', p0, p1);
            const subResults = playRecursiveCombat([p0.slice(0, c0), p1.slice(0, c1)], level + 1);
            winner = subResults[0].length ? 0 : 1;
            show = true;
        } else {
            winner = (c0 > c1) ? 0 : 1;
        }
        if (winner === 0) {
            p0.push(c0);
            p0.push(c1);
        } else {
            p1.push(c1);
            p1.push(c0);
        }
        if (show) {
            // console.log('Player', winner, 'won:', p0, p1);
            show = false;
        }
        if (historyPacks.find(([hp0, hp1]) => {
            if (p0.length !== hp0.length) return false;
            for (let i = 0; i < p0.length; i++) {
                if (p0[i] !== hp0[i]) return false;
            }
            for (let i = 0; i < p1.length; i++) {
                if (p1[i] !== hp1[i]) return false;
            }
            return true;
        }) !== undefined) {
            console.log('STOP RECURSION - PLAYER 1 WINS!!!', level);
            return [p0, []];
        }
        historyPacks.push([[...p0], [...p1]]);
        // console.log(historyPacks);
    }
    return [p0, p1];
}

const add9 = (a, b) => {
    return (9 + a + b) % 9;
}

const shuffleCups = (cups, currentCup) => {
    // console.log(cups, currentCup);
    const removeIdx = (1 + cups.findIndex(c => c === currentCup)) % 9;
    const removed = [];
    for (let i = removeIdx; i < removeIdx + 3; i++) {
        removed.push(cups[i % 9]);
    }
    cups = [...cups].filter(c => !removed.includes(c));
    let destCup = currentCup - 1;
    // console.log(destCup, cups);
    while (!cups.includes(destCup)) {
        destCup = (destCup < 2) ? 9 : destCup - 1;
    }
    const insertIdx = (1 + cups.findIndex(c => c === destCup)) % 6;
    cups.splice(insertIdx, 0, ...removed);
    currentCup = cups[(1 + cups.findIndex(c => c === currentCup)) % 9];
    return [cups, currentCup];
}

const MAX_INDEX = 1000000 -1;
// const values = new Int32Array(MAX_CUP_NO);
const nexts = new Int32Array(MAX_INDEX + 1);
const removed = [];

const bigShuffle = (currentCupNo) => {
    const currentIndex = currentCupNo;
    let removedIndex = currentIndex;
    for (let i = 0; i < 3; i++) {
        removedIndex = nexts[removedIndex];
        removed[i] = removedIndex;
    }
    let insertIndex = (currentIndex === 0) ? MAX_INDEX : currentIndex - 1;
    while (removed.includes(insertIndex)) {
        insertIndex = (insertIndex === 0) ? MAX_INDEX : insertIndex - 1;
    }
    // console.log(currentIndex, removedIndex, insertIndex, removed);
    const currentNext = nexts[currentIndex];
    nexts[currentIndex] = nexts[removedIndex];
    nexts[removedIndex] = nexts[insertIndex];
    nexts[insertIndex] = currentNext;
    return nexts[currentIndex];
}

const process = (err, data) => {
    if (err) throw err;
    const digits = data.replace(/\r/g, '').trim().split('').map(c => Number.parseInt(c));
    let cups = [...digits];
    // for (let c of data.replace(/\r/g, '').trim()) { cups.push(Number.parseInt(c))};
    console.log(cups);
    let currentCupNo = cups[0];
    for (let i = 0; i < 100; i++) {
        [cups, currentCupNo] = shuffleCups(cups, currentCupNo);
    }
    let s = ''
    let startIndex = cups.findIndex(c => c == 1);
    for (let i = 1; i < cups.length; i++) {
        const idx = (startIndex + i) % cups.length;
        s += cups[idx].toString();
    }
    console.log(s);

    for (let i = 0; i <= MAX_INDEX; i++) {
        nexts[i] = i + 1;
    }
    // nexts[nexts.length - 1] = 0;
    // data = data.replace(/\r/g, '').trim();
    console.log(digits);
    nexts[MAX_INDEX] = digits[0] - 1;
    for (let i = 1; i < digits.length; i++) {
        const v = digits[i - 1] - 1;
        const n = digits[i] - 1;
        nexts[v] = n;
    }
    nexts[digits[digits.length - 1] - 1] = digits.length;
    console.log(nexts.slice(0,10));
    currentCupNo = digits[0] - 1;
    for (let i = 0; i < 10000000; i++) {
    // for (let i = 0; i < 10; i++) {
        // console.log(currentCupNo, nexts.slice(0, 10));
        // if (i % 1000 === 0) console.log(i);
        currentCupNo = bigShuffle(currentCupNo);
    }
    let total = (1 + nexts[0]) * (1 + nexts[nexts[0]]);
    console.log(nexts[0], nexts[nexts[0]]);
    console.log(total);
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
