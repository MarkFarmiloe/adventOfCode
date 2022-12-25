'use strict';
const fs = require("fs");

const getData = (raw) => {
    // const decodeLine = l => {
    //     const parts = l.split(/^Valve (..) has flow rate=(\d+); [^A-Z]* (.*)$/);
    //     const value = {flow: parseInt(parts[2]), links: parts[3].split(', ')};
    //     return [parts[1], value];
    // }
    const wind = raw.split('').map(c => c === '<' ? -1 : 1);
    return wind;
}

const part1 = () => {

};

let checked = 0;

const dropBlock = (chamber, height, wind, windIndex, dropNo) => {
    const blockNo = BigInt.asIntN(16, dropNo % 5n);
    const block = blocks[blockNo];
    const collision = ([posL, posB]) => {
        for (let i = 0; i < block.length; i++) {
            if (posB + i >= chamber.length) return false;
            const row = block[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === '.') continue;
                if (chamber[posB + i][posL + j]) return true;
            }
        }
        return false;
    }
    const h = chamber.length;
    let blockBLPos = [2, h + 3];
    do {
        const gust = wind[windIndex];
        windIndex = (windIndex + 1) % wind.length;
        let newPos = [blockBLPos[0] + gust, blockBLPos[1]];
        if (newPos[0] >= 0 && newPos[0] + block[0].length <= 7) {
            if (!collision(newPos)) {
                blockBLPos = newPos;
            }
        }
        newPos = [blockBLPos[0], blockBLPos[1] - 1];
        if (collision(newPos)) {
            break;
        } else {
            blockBLPos = newPos;
        }
    } while (true);
    // console.log(blockBLPos, windIndex, block);
    for (let i = 0; i < block.length; i++) {
        const row = block[i];
        const chamberRow = i + blockBLPos[1];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === '#') {
                if (chamberRow >= chamber.length) {
                    chamber[chamberRow] = new Array(7);
                }
                chamber[chamberRow][j + blockBLPos[0]] = '#';
            }
        }
    }
    let rowsDropped = 0;
    if (chamber.length > 100000 || (windIndex < 5 && chamber.length > 2)) {
        for (let i = chamber.length - 1; i > 1 + checked; i--) {
            const r1 = chamber[i];
            const r2 = chamber[i - 1];
            let j = 0;
            for (; j < 7; j++) {
                if (r1[j] !== '#' && r2[j] !== '#')
                    break;
            }
            if (j === 7) {
                rowsDropped = i - 1;
                chamber.splice(0, rowsDropped);
                break;
            }
        }
        checked = (rowsDropped === 0 ? chamber.length : 0);
        height += BigInt(rowsDropped);
        console.log(dropNo, blockNo, windIndex, height);
        if (rowsDropped !== 0) {
            const chamberS = chamberToString(chamber);
            // console.log(chamberS);
            const match = chamberInfos.find(ci => ci[4] == chamberS);
            if (match) {
                // console.log("Match found:");
                // console.log(match);
                const matchInfo = [dropNo, match[0], height, match[3]];
                return [windIndex, height, matchInfo];
            }
            chamberInfos.push([dropNo, blockNo, windIndex, height, chamberS]);
        }
    }
    return [windIndex, height];
};

const chamberInfos = [];

const blocks = [
    ['####'],
    ['.#.', '###', '.#.'],
    ['###', '..#', '..#'], // stored bottom row first !!!
    ['#', '#', '#', '#'],
    ['##', '##']
];

const chamberToString = chamber => {
    return chamber.map(l => {
        let s = '';
        for (let i = 0; i < 7; i++) {
            s += (l[i] ? l[i] : '.');
        }
        return s;
    }).reverse().join('\n');
};

const process = (err, data) => {
    if (err) throw err;
    const wind = getData(data);
    const chamber = ['#######'];
    let windIndex = 0;
    let height = 0n;
    let rowsDropped = 0;
    let matchInfo;
    let noOfDrops = 2022n;
    for (let i = 0n; i < noOfDrops; i++) {
        [windIndex, height, matchInfo] = dropBlock(chamber, height, wind, windIndex, i);
        if (matchInfo) {
            console.log(matchInfo);
            const dropRepeat = matchInfo[0] - matchInfo[1];
            const heightRepeat = matchInfo[2] - matchInfo[3];
            const remainder = (noOfDrops - i) % dropRepeat;
            const repeats = (noOfDrops - i - remainder) / dropRepeat;
            i = noOfDrops - remainder;
            height += repeats * heightRepeat;
        }
    }
    height += BigInt(chamber.length - 1);
    console.log(height, chamber.length);
    // return;
    chamber.length = 1;
    chamber[0] = '#######';
    chamberInfos.length = 0;
    windIndex = 0;
    height = 0n;
    rowsDropped = 0;
    matchInfo = 0;
    noOfDrops = 1000000000000n;
    for (let i = 0n; i < noOfDrops; i++) {
        [windIndex, height, matchInfo] = dropBlock(chamber, height, wind, windIndex, i);
        if (matchInfo) {
            console.log(matchInfo);
            const dropRepeat = matchInfo[0] - matchInfo[1];
            const heightRepeat = matchInfo[2] - matchInfo[3];
            const remainder = (noOfDrops - i) % dropRepeat;
            const repeats = (noOfDrops - i - remainder) / dropRepeat;
            i = noOfDrops - remainder;
            height += repeats * heightRepeat;
        }
    }
    height += BigInt(chamber.length - 1);
    console.log(height, chamber.length);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
