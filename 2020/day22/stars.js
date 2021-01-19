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

const process = (err, data) => {
    if (err) throw err;
    let packs = data.replace(/\r/g, '').split("\n\n").map(extractPack);
    console.log(packs);
    // const loser = packs.map(p => p.reduce((max, c) => (max > c) ? max : c, 0)).reduce((w, m, i, p) => (p[0] < p[1]) ? 0 : 1);
    // // console.log(loser);
    // while (packs[loser].length) {
    //     // console.log(packs);
    //     playRound(packs);
    // }
    // console.log(packs[1 - loser].reverse().reduce((total, c, i) => total + c * (i + 1), 0));

    // packs = data.replace(/\r/g, '').split("\n\n").map(extractPack);
    const finalPacks = playRecursiveCombat(packs);
    console.log(finalPacks);
    console.log(finalPacks.reduce((t, p) => t + p.reverse().reduce((total, c, i) => total + c * (i + 1), 0), 0));
};

// fs.readFile("./test2.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
