'use strict';
const fs = require("fs");

const getData = (raw) => {
    const lines = raw.split('\n');
    const parts = lines.map(l => l.split(/^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/));
    return parts.map(b => {
        b = b.map(d => parseInt(d));
        return { id: b[1], ore: b[2], clay: b[3], obs: [b[4], b[5]], geode: [b[6], b[7]] };
    });
}

const getMaxGeodes = (bp, time) => {
    const maxOre = Math.max(bp.ore, bp.clay, bp.obs[0], bp.geode[0]);
    const processMinute = ps => {
        const newPs = [];
        for (const [[r0, r1, r2, r3], [s0, s1, s2, s3]] of ps) {
            // if can create geode, do it. No other options allowed as this is clearly the optimal path.
            if (s0 >= bp.geode[0] && s2 >= bp.geode[1]) {
                newPs.push([[r0, r1, r2, r3 + 1], [s0 + r0 - bp.geode[0], s1 + r1, s2 + r2 - bp.geode[1], s3 + r3]]);
            } else {
                if (s0 >= bp.obs[0] && s1 >= bp.obs[1]) {
                    newPs.push([[r0, r1, r2 + 1, r3], [s0 + r0 - bp.obs[0], s1 + r1 - bp.obs[1], s2 + r2, s3 + r3]]);
                }
                if (s0 >= bp.clay) {
                    newPs.push([[r0, r1 + 1, r2, r3], [s0 + r0 - bp.clay, s1 + r1, s2 + r2, s3 + r3]]);
                }
                if (s0 >= bp.ore && s0 <= maxOre * 2) {
                    newPs.push([[r0 + 1, r1, r2, r3], [s0 + r0 - bp.ore, s1 + r1, s2 + r2, s3 + r3]]);
                }
                if (s0 < maxOre) {
                    newPs.push([[r0, r1, r2, r3], [s0 + r0, s1 + r1, s2 + r2, s3 + r3]]);
                }
            }
        }
        return newPs;
    };
    const removeDuds = ps => {
        ps.sort(([[a0, a1, a2, a3], c], [[b0, b1, b2, b3], d]) =>
            a3 !== b3 ? b3 - a3 :
            a2 !== b2 ? b2 - a2 :
            a1 !== b1 ? b1 - a1 :
                        b0 - a0);
        // Assume best can't be more than 2 geodes behind any other possible.
        ps = ps.filter(([[r0,r1,r2,r3],x]) => r3 >= ps[0][0][3] - 2);
        for (let i = 0; i < ps.length; i++) {
            const [[pr0, pr1, pr2, pr3], [ps0, ps1, ps2, ps3]] = ps[i];
            for (let j = ps.length - 1; j > i; j--) {
                const [[qr0, qr1, qr2, qr3], [qs0, qs1, qs2, qs3]] = ps[j];
                if (pr0 >= qr0 && pr1 >= qr1 && pr2 >= qr2 && pr3 >= qr3) {
                    if (ps0 >= qs0 && ps1 >= qs1 && ps2 >= qs2 && ps3 >= qs3) {
                        ps.splice(j, 1); 
                    }                
                }
            }
        }
        return ps;
    };
    let possibles = [[[1, 0, 0, 0], [0, 0, 0, 0]]];
    for (let i = 0; i < time; i++) {
        possibles = processMinute(possibles);
        possibles = removeDuds(possibles);
    }
    // console.log(possibles);
    return possibles.reduce((m, p) => m > p[1][3] ? m : p[1][3], 0);
}

const process = (err, data) => {
    if (err) throw err;
    const bps = getData(data);
    console.log(bps);
    let ql = 0;
    for (const bp of bps) {
        const g = getMaxGeodes(bp, 24);
        console.log(bp.id, g);
        ql += bp.id * g;
    }
    console.log(ql);
    ql = 1;
    for (let i = 0; i < bps.length; i++) {
        if (i > 2) break;
        const bp = bps[i];
        const g = getMaxGeodes(bp, 32);
        console.log(bp.id, g);
        ql *= g;
    }
    console.log(ql);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
