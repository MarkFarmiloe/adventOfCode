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
}

const reorient = (s, o) => {
    return s.map(([a,b,c]) => 
    [
        a * o[0][0] + b * o[0][1] + c * o[0][2],
        a * o[1][0] + b * o[1][1] + c * o[1][2],
        a * o[2][0] + b * o[2][1] + c * o[2][2]
    ]).sort(
        ([a,b,c], [x,y,z]) => {
            if (a !== x) return a - x;
            if (b !== y) return b - y;
            return c - z;
        }
    );
}

const locateAndReorient = (s0, s1) => {
    for (let i = 0; i < orientations.length; i++) {
        const s2 = reorient(s1, orientations[i]);
        for (let j = 0; j < s0.length - 11; j++) {
            const p0 = s0[j];
            for (let k = 0; k < s2.length; k++) {
                const p2 = s2[k];
                const dx = p0[0] - p2[0];
                const xMatches = s2.filter(pb => s0.some(pa => pa[0] - pb[0] === dx));
                if (xMatches.length >= 12) {
                    const dy = p0[1] - p2[1];
                    const yMatches = s2.filter(pb => 
                        s0.some(pa => 
                            pa[0] - pb[0] === dx &&
                            pa[1] - pb[1] === dy)
                        );
                    if (yMatches.length >= 12) {
                        const dz = p0[2] - p2[2];
                        const zMatches = s2.filter(pb => 
                            s0.some(pa => 
                                pa[0] - pb[0] === dx &&
                                pa[1] - pb[1] === dy &&
                                pa[2] - pb[2] === dz)
                            );
                        if (zMatches.length >= 12) {
                            return [[dx, dy, dz], s2];
                        }
                    }
                }
            }
        }
    }
    return [];
}

const getMD = ([a,b,c], [x,y,z]) => {
    return Math.abs(a-x) + Math.abs(b-y) + Math.abs(c-z);
}

const process = (err, data) => {
    if (err) throw err;
    const scanners = getData(data);
    let offsets = [[0,0,0]];
    let rounds = 10;  // fudge number to ensure infinite loop is avoided.
    while (rounds) {
        for (let i = 0; i < scanners.length; i++) {
            const scannerA = scanners[i];
            const offsetA = offsets[i];
            if (offsetA) { // located, so can use this to locate others
                for (let j = 0; j < scanners.length; j++) {
                    const offsetB = offsets[j];
                    if (offsetB) continue; // already located and reoriented this scanner.
                    const scannerB = scanners[j];
                    const [offset, reoriented] = locateAndReorient(scannerA, scannerB);
                    if (offset) {
                        offsets[j] = offset;
                        scanners[j] = reoriented.map(p => [p[0] + offset[0], p[1] + offset[1], p[2] + offset[2]]);
                    }
                }
            }
        }
        let allDone = true;
        for (let i = 0; i < scanners.length; i++) {
            if (!offsets[i]) allDone = false;
        }
        rounds--;
        if (allDone) rounds = 0;
    }
    // console.log(offsets);
    const points = scanners.reduce((a, s) => {
        return s.reduce((b, [p,q,r]) => {
            if (!b.some(([x,y,z]) => x === p && y === q && z === r)) b.push([p,q,r]);
            return b;
        }, a);
    }, []);
    console.log(points.length);
    let md = 0;
    for (let i = 0; i < offsets.length; i++) {
        for (let j = i + 1; j < offsets.length; j++) {
            const dist = getMD(offsets[i], offsets[j]);
            md = md > dist ? md : dist;
        }        
    }
    console.log(md);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
