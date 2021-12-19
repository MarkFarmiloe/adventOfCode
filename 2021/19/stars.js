'use strict';
const fs = require("fs");

const getData = (data) => {
    return data
        .trim().replace(/\r/g, '').split('\n\n')
        .map(l => getScannerInfo(l.trim().split('\n')));
};

const orientations = [
    [[ 1, 0, 0],[ 0, 1, 0],[ 0, 0, 1]],
    [[ 1, 0, 0],[ 0,-1, 0],[ 0, 0,-1]],
    [[ 1, 0, 0],[ 0, 0, 1],[ 0,-1, 0]],
    [[ 1, 0, 0],[ 0, 0,-1],[ 0, 1, 0]],

    [[-1, 0, 0],[ 0, 1, 0],[ 0, 0,-1]],
    [[-1, 0, 0],[ 0,-1, 0],[ 0, 0, 1]],
    [[-1, 0, 0],[ 0, 0, 1],[ 0, 1, 0]],
    [[-1, 0, 0],[ 0, 0,-1],[ 0,-1, 0]],

    [[ 0, 1, 0],[-1, 0, 0],[ 0, 0, 1]],
    [[ 0, 1, 0],[ 1, 0, 0],[ 0, 0,-1]],
    [[ 0, 1, 0],[ 0, 0, 1],[ 1, 0, 0]],
    [[ 0, 1, 0],[ 0, 0,-1],[-1, 0, 0]],

    [[ 0,-1, 0],[ 1, 0, 0],[ 0, 0, 1]],
    [[ 0,-1, 0],[-1, 0, 0],[ 0, 0,-1]],
    [[ 0,-1, 0],[ 0, 0,-1],[ 1, 0, 0]],
    [[ 0,-1, 0],[ 0, 0, 1],[-1, 0, 0]],

    [[ 0, 0, 1],[ 0, 1, 0],[-1, 0, 0]],
    [[ 0, 0, 1],[ 0,-1, 0],[ 1, 0, 0]],
    [[ 0, 0, 1],[ 1, 0, 0],[ 0, 1, 0]],
    [[ 0, 0, 1],[-1, 0, 0],[ 0,-1, 0]],

    [[ 0, 0,-1],[ 0, 1, 0],[ 1, 0, 0]],
    [[ 0, 0,-1],[ 0,-1, 0],[-1, 0, 0]],
    [[ 0, 0,-1],[ 1, 0, 0],[ 0,-1, 0]],
    [[ 0, 0,-1],[-1, 0, 0],[ 0, 1, 0]]
];

const getScannerInfo = lines => {
    lines.shift();
    return lines.map(
        l => l.split(',').map(
        s => parseInt(s))
        ).sort(
            ([a,b,c], [x,y,z]) => {
                if (a !== x) return a - x;
                if (b !== y) return b - y;
                return c - z;
            }
        );
        // .map(
        //     ([a,b,c]) => {
        //         const [aa, ab] = [Math.abs(a + b), Math.abs(a - b)];
        //         const [ba, bb] = [Math.abs(b + c), Math.abs(b - c)];
        //         const [ca, cb] = [Math.abs(c + a), Math.abs(c - a)];
        //         return [a,b,c,aa,ab,ba,bb,ca,cb];
        //     }
        // );
}

const reorient = (s, o) => {
    return s.map(([a,b,c]) => 
    [
        a * o[0][0] + b * o[0][1] + c * o[0][2],
        a * o[1][0] + b * o[1][1] + c * o[1][2],
        a * o[2][0] + b * o[2][1] + c * o[2][2]
    ]);
}

const locateAndReorient = (s0, s1) => {
    for (let i = 0; i < orientations.length; i += 4) {
        const s2 = reorient(s1, orientations[i]);
        for (let j = 0; j < s0.length - 12; j++) {
            const p0 = s0[j];
            for (let k = 0; k < s2.length; k++) {
                const p2 = s2[k];
                const dx = p0[0] - p2[0];
                const xMatches = s2.filter(pb => s0.some(pa => pa[0] - pb[0] === dx));
                if (xMatches.length >= 12) {
                    console.log(i, j, k, dx, xMatches);
                    const dy = p0[1] - p2[1];
                    const yMatches = s2.filter(pb => 
                        s0.some(pa => 
                            pa[0] - pb[0] === dx &&
                            pa[1] - pb[1] === dy)
                        );
                    if (yMatches.length >= 12) {
                        console.log(i, j, k, dx, dy, yMatches);
                        const dz = p0[2] - p2[2];
                        const zMatches = s2.filter(pb => 
                            s0.some(pa => 
                                pa[0] - pb[0] === dx &&
                                pa[1] - pb[1] === dy &&
                                pa[2] - pb[2] === dz)
                            );
                        if (zMatches.length >= 12) {
                            console.log(i, j, k, dx, dy, dz, zMatches);
                            return [[dx, dy, dz], s2];
                        }
                    }
                }
            }
        }
    }
}

const process = (err, data) => {
    if (err) throw err;
    const scanners = getData(data);    
    // console.log(scanners);
    const [offset, reoriented] = locateAndReorient(scanners[0], scanners[1]);
}

fs.readFile("./test.txt", 'utf8', process);
// fs.readFile("./input.txt", 'utf8', process);
