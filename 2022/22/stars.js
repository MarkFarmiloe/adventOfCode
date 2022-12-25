'use strict';
const fs = require("fs");

const getData = (raw) => {
    const decodeLine = (a, l) => {
        const [key, value] = l.split(': ');
        const parts = value.split(' ');
        a[key] = parts.length > 1 ? parts : parseInt(value);
        return a;
    };
    const [mapInfo, stepsInfo] = raw.split('\n\n');
    const map = mapInfo.split('\n').map(l => l.split(''));
    const steps = [];
    let direction = 0;
    for (let i = 0; i < stepsInfo.length; ) {
        let j = i;
        for (; j < stepsInfo.length; j++) {
            if (stepsInfo[j] === 'L') break;
            if (stepsInfo[j] === 'R') break;            
        }
        const value = parseInt(stepsInfo.slice(i, j));
        steps.push([direction, value]);
        if (j < stepsInfo.length) {
            direction = stepsInfo[j] === 'L' ? 3 : 1;
        }
        i = j + 1;
    }
    return [map, steps];
}

const process = (err, data) => {
    if (err) throw err;
    let [map, steps] = getData(data);
    console.log(map);
    console.log(steps);
    let pos = [0, map[0].findIndex(c => c === '.')];
    const maxCol = map.reduce((c, l) => c > l.length ? c : l.length, 0) - 1;
    console.log(pos, maxCol);
    const row = [0, 1, 0, -1];
    const col = [1, 0, -1, 0];
    const offMap = ([r, c]) => {
        if (r < 0 || c < 0) return true;
        if (r === map.length || c > maxCol) return true;
        if ( !map[r][c] || map[r][c] === ' ') return true;
        return false;
    }
    let prevD = 0;
    steps.forEach(([dc, v]) => {
        let d = (prevD + dc) % 4;
        prevD = d;
        // console.log(d, v);
        for (let i = 0; i < v; i++) {
            let nextPos = [pos[0] + row[d], pos[1] + col[d]];            
            if (offMap(nextPos)) {
                do {
                    // console.log(nextPos);
                    nextPos = [nextPos[0] - row[d], nextPos[1] - col[d]];
                } while (!offMap(nextPos));
                nextPos = [nextPos[0] + row[d], nextPos[1] + col[d]];
            }
            if (map[nextPos[0]][nextPos[1]] === '#') break;
            pos = nextPos;
            // console.log(pos);
        }
    });
    console.log(pos);
    console.log(1000 * pos[0] + 4 * pos[1] + prevD + 1004);

    const nexts = [
        [[2, 1], [2, 0], [3, 0], [4, 0], [1, 0], [2, 3]],
        [[1, 1], [5, 1], [5, 2], [5, 3], [5, 0], [3, 3]],
        [[4, 1], [4, 2], [1, 2], [2, 2], [3, 2], [4, 3]],
        [[3, 1], [0, 3], [0, 2], [0, 1], [0, 0], [1, 3]]
    ];
    const nextCubePos = ([side, direction, row, col]) => {
        let nSide, nDirection;
        switch (direction) {
            case 0:
                if (col < maxIndex) return [side, direction, row, col + 1];
                [nSide, nDirection] = nexts[0][side];
                col = nDirection === 0 ? 0 : (nDirection === 1 ? maxIndex - row : row);
                row = nDirection === 0 ? row : (nDirection === 1 ? 0 : maxIndex);
                return [nSide, nDirection, row, col] 
            case 2:
                if (col > 0) return [side, direction, row, col - 1];
                [nSide, nDirection] = nexts[2][side];
                col = nDirection === 2 ? maxIndex : (nDirection === 1 ? row : maxIndex - row);
                row = nDirection === 2 ? row : (nDirection === 1 ? 0 : maxIndex);
                return [nSide, nDirection, row, col] 
            case 1:
                if (row < maxIndex) return [side, direction, row + 1, col];
                [nSide, nDirection] = nexts[1][side];
                switch(nDirection) { 
                    case 0: row = maxIndex - col; col = 0; break;
                    case 1: row = 0; break;
                    case 2: row = col; col = maxIndex; break;
                    case 3: row = maxIndex; col = maxIndex - col; break;
                };
                return [nSide, nDirection, row, col] 
            case 3:
                if (row > 0) return [side, direction, row - 1, col];
                [nSide, nDirection] = nexts[3][side];
                switch(nDirection) { 
                    case 0: row = col; col = 0; break;
                    case 1: row = 0; col = maxIndex - col; break;
                    case 2: row = maxIndex - col; col = maxIndex; break;
                    case 3: row = maxIndex; break;
                };
                return [nSide, nDirection, row, col] 
        }
    };
    const deRef = ([side, dir, row, col]) => {
        let [r, c, rot] = sides[side];
        let tRow = r * (maxIndex + 1);
        let lCol = c * (maxIndex + 1);
        switch (rot) {
            case 0: return [tRow + row, lCol + col, dir];
            case 1: return [tRow + maxIndex - col, lCol + row, (dir + 3) % 4];
            case 2: return [tRow + maxIndex - row, lCol + maxIndex - col, (dir + 2) % 4];
            case 3: return [tRow + col, lCol + maxIndex - row, (dir + 1) % 4];
        }
    };
    const content = (cp) => {
        let [r, c] = deRef(cp);
        return map[r][c];
    }
    let cubePos = [0, 0, 0, 0]; // side, dir, row, col
    steps.forEach(([dc, v], i) => {
        if (i < 149999) {
        cubePos[1] = (cubePos[1] + dc) % 4; // set direction even if doesn't move!!!
        for (let j = 0; j < v; j++) {
            const nextCP = nextCubePos(cubePos);
            if (content(nextCP) === '#') break;
            cubePos = nextCP;
        }
        // console.log(dc, v, cubePos);
        }
    });
    console.log(cubePos);
    const [r, c, d] = deRef(cubePos)
    console.log(r, c, d, 1000 * (r + 1) + 4 * (c + 1) + d);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";
const maxIndex = (run === 0 ? 4 : 50) - 1;
const sides = run === 0 ?
    [[0, 2, 0], [1, 2, 0], [2, 3, 3], [1, 0, 0], [1, 1, 0], [2, 2, 0]] :
    [[0, 1, 0], [1, 1, 0], [0, 2, 1], [3, 0, 1], [2, 0, 1], [2, 1, 0]];

fs.readFile(filename, 'utf8', process);
