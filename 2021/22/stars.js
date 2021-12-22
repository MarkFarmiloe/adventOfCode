'use strict';
const fs = require("fs");

const getData = (data) => {
    const parts = data
        .trim().replace(/\r/g, '').split('\n').map(l => {
            return l.trim().split(' ');
        });
    return parts.map(p => [p[0] === 'on', p[1].split(',').map(a => {
        return a.split('..').map(b => {
            b.trim();
            const i =b.indexOf('=');
            if (i > -1) b = b.slice(i+1);
            return parseInt(b);
        })
    })]);
};

const setBlocks = (cubes, [turnOn, [[xMin, xMax], [yMin, yMax], [zMin, zMax]]]) => {
    for (let i = Math.max(-50, xMin); i <= Math.min(50, xMax); i++) {
        for (let j = Math.max(-50, yMin); j <= Math.min(50, yMax); j++) {
            for (let k = Math.max(-50, zMin); k <= Math.min(50, zMax); k++) {
                const key = '' + i + '|' + j + '|' + k;
                if (turnOn) {
                    cubes[key] = 1;
                } else {
                    if (cubes[key]) delete cubes[key];
                }
            }
        }
    }
    return cubes;
}

const setBlocksAll = (cubes, [turnOn, cube]) => {
    let slave;
    let master;
    if (turnOn) { // remove intersection from new block
        master = cubes;
        slave = [cube];
    } else {
        master = [cube];
        slave = cubes;
    }
    master.forEach(([[aMin, aMax],[bMin, bMax],[cMin, cMax]]) => {
        const addCubes = [];
        const removeCubes = [];
        slave.forEach(([[xMin, xMax], [yMin, yMax], [zMin, zMax]]) => {
            if (xMin <= aMax && xMax >= aMin && 
                yMin <= bMax && yMax >= bMin && 
                zMin <= cMax && zMax >= cMin) // collision!
            {
                removeCubes.push([[xMin, xMax], [yMin, yMax], [zMin, zMax]]);
                if (xMin < aMin) { // there is a surviving left hand block
                    addCubes.push([[xMin, aMin-1], [yMin, yMax], [zMin, zMax]]);
                }
                if (xMax > aMax) { // there is a surviving right hand block
                    addCubes.push([[aMax+1, xMax], [yMin, yMax], [zMin, zMax]]);
                }
                if (yMin < bMin) { // there is a surviving bottom block
                    addCubes.push([[Math.max(xMin, aMin), Math.min(xMax, aMax)], [yMin, bMin-1], [zMin, zMax]]);
                }
                if (yMax > bMax) { // there is a surviving top block
                    addCubes.push([[Math.max(xMin, aMin), Math.min(xMax, aMax)], [bMax+1, yMax], [zMin, zMax]]);
                }
                if (zMin < cMin) { // there is a surviving back block
                    addCubes.push([
                        [Math.max(xMin, aMin), Math.min(xMax, aMax)], 
                        [Math.max(yMin, bMin), Math.min(yMax, bMax)], 
                        [zMin, cMin-1]]);
                }
                if (zMax > cMax) { // there is a surviving front block
                    addCubes.push([
                        [Math.max(xMin, aMin), Math.min(xMax, aMax)], 
                        [Math.max(yMin, bMin), Math.min(yMax, bMax)], 
                        [cMax+1, zMax]]);
                }
            }
        });
        if (removeCubes.length > 0) {
            slave = slave
                .filter(([[x0,x1],[y0,y1],[z0,z1]]) => !removeCubes.some(([[a0,a1],[b0,b1],[c0,c1]]) =>
                    a0 === x0 & a1 === x1 & b0 === y0 & b1 === y1 & c0 === z0 & c1 === z1
                ))
                .concat(addCubes);
        }
    });
    if (turnOn) return master.concat(slave);
    else return slave;
};

const process = (err, data) => {
    if (err) throw err;
    const instructions = getData(data);
    const cubes = instructions.reduce(setBlocks, {}); 
    console.log(Object.keys(cubes).length);
    const cubes2 = instructions.reduce(setBlocksAll, []); 
    console.log(cubes2.reduce((a, [[a0,a1],[b0,b1],[c0,c1]]) => {
        return a + (1 + a1 - a0) * (1 + b1 - b0) * (1 + c1 - c0);
    }, 0));
}

// fs.readFile("./test1.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
