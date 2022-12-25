'use strict';
const fs = require("fs");
const { arrayBuffer } = require("stream/consumers");

const getData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(l => l.split(',').map(d => parseInt(d)));
}

const calcBestScore = (valves, times, currId, availableIds, time) => {

};

const part1 = (valves, goodIds, times) => {

};

const part2 = (valves, goodIds, times) => {

};

const process = (err, data) => {
    if (err) throw err;
    const cubes = getData(data);
    cubes.sort((a, b) => (a[0] - b[0]) ? a[0] - b[0] : (a[1] - b[1]) ? a[1] - b[1] : a[2] - b[2]);
    console.log(cubes);
    let exposed = 6 * cubes.length;
    cubes.forEach(cube => {
        if (cubes.some(c => c[0] === cube[0] + 1 && c[1] === cube[1] && c[2] === cube[2])) exposed -= 2;
        if (cubes.some(c => c[1] === cube[1] + 1 && c[0] === cube[0] && c[2] === cube[2])) exposed -= 2;
        if (cubes.some(c => c[2] === cube[2] + 1 && c[1] === cube[1] && c[0] === cube[0])) exposed -= 2;
    });
    console.log(exposed);
    const min = cubes.reduce((c, cube) => {
        return [c[0] < cube[0] ? c[0] : cube[0], c[1] < cube[1] ? c[1] : cube[1], c[2] < cube[2] ? c[2] : cube[2]];
    }, [999, 999, 999]);
    const max = cubes.reduce((c, cube) => {
        return [c[0] > cube[0] ? c[0] : cube[0], c[1] > cube[1] ? c[1] : cube[1], c[2] > cube[2] ? c[2] : cube[2]];
    }, [0, 0, 0]);
    console.log(min, max);
    let holes = [];
    for (let x = 1 + min[0]; x < max[0]; x++) {
        for (let y = 1 + min[1]; y < max[1]; y++) {
            for (let z = 1 + min[2]; z < max[2]; z++) {
                if (!cubes.find(([cx, cy, cz]) => cx === x && cy === y && cz === z)) {
                    holes.push([x, y, z]);
                }
            }
        }
    }
    console.log(holes);
    let holesCount = 0;
    do {
        holes.forEach(hole => {
            const cubeOrHoleAt = (x, y, z) => {
                if (cubes.some(([cx, cy, cz]) => cx === x && cy === y && cz === z)) return true;
                if (holes.some(([hx, hy, hz, hDead]) => !hDead && hx === x && hy === y && hz === z)) return true;
                return false;
            }
            const cubeOrHoleAround = ([hx, hy, hz]) => {
                if (!cubeOrHoleAt(hx - 1, hy, hz)) return false;
                if (!cubeOrHoleAt(hx + 1, hy, hz)) return false;
                if (!cubeOrHoleAt(hx, hy - 1, hz)) return false;
                if (!cubeOrHoleAt(hx, hy + 1, hz)) return false;
                if (!cubeOrHoleAt(hx, hy, hz - 1)) return false;
                if (!cubeOrHoleAt(hx, hy, hz + 1)) return false;
                return true;
            } ;
            if (!cubeOrHoleAround(hole)) hole[3] = 'x';
        });
        holesCount = holes.length;
        holes = holes.filter(h => h[3] !== 'x');
        console.log(holes, holesCount);
    } while (holesCount > holes.length);
    let hExposed = 6 * holes.length;
    holes.forEach(cube => {
        if (holes.some(c => c[0] === cube[0] + 1 && c[1] === cube[1] && c[2] === cube[2])) hExposed -= 2;
        if (holes.some(c => c[1] === cube[1] + 1 && c[0] === cube[0] && c[2] === cube[2])) hExposed -= 2;
        if (holes.some(c => c[2] === cube[2] + 1 && c[1] === cube[1] && c[0] === cube[0])) hExposed -= 2;
    });
    console.log(exposed, hExposed, exposed - hExposed);
}

const run = 1;
const filename = run === 0 ? "./test.txt": "./input.txt";

fs.readFile(filename, 'utf8', process);
