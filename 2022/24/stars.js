'use strict';
const fs = require("fs");

const getData = (raw) => {
    const chars = raw.split('\n').map(l => l.split(''));
    const first = chars.shift().reduce((f, c, i) => c !== '#' ? i - 1 : f);
    const last = chars.pop().reduce((l, c, i) => c !== '#' ? i - 1 : l);
    const h = chars.length;
    const w = chars[0].length - 2;
    const b = [];
    for (let row = 0; row < h; row++) {
        for (let col = 1; col <= w; col++) {
            const c = chars[row][col];
            if (c !== '.') {
                switch (c) {
                    case '>':
                        b.push([row, col - 1, 0, 1]);
                        break;
                    case '<':
                        b.push([row, col - 1, 0, -1]);
                        break;
                    case 'v':
                        b.push([row, col - 1, 1, 0]);
                        break;
                    case '^':
                        b.push([row, col - 1, -1, 0]);
                        break;
                    default:
                        throw new Error('OOPS');
                        break;
                }
            }
        }
    }
    return [first, last, h, w, b];
}

const process = (err, data) => {
    if (err) throw err;
    const printBlizzards = () => {
        for (let i = 0; i < height; i++) {
            let s = '';
            for (let j = 0; j < width; j++) {
                const b = blizzards.filter(([br, bc]) => br === i && bc === j);
                switch (b.length) {
                    case 0:
                        s += '.';
                        break;
                    case 1:
                        const [r, c, dr, dc] = b[0];
                        s += (dr === 0) ? (dc === 1 ? '>' : '<') : (dr === 1 ? 'v' : '^'); 
                        break;
                    default:
                        s += b.length;
                        break;
                }
            }
            console.log(s);
        }
    };
    const moveBlizzards = () => {
        blizzards = blizzards.map(([br, bc, dr, dc]) => {
            return (dr === 0) ?
                [br, (bc + width + dc) % width, dr, dc] :
                [(br + height + dr) % height, bc, dr, dc];
        });
    };
    const available = (r, c) => {
        if (r === -1 && c === start) return true;
        if (r === height && c === end) return true;
        if (r < 0 || c < 0 || r >= height || c >= width) return false;
        return !blizzards.some(([br, bc]) => br === r && bc === c);
    };
    const nextPossibles = () => {
        possibles = possibles.reduce((np, [pr, pc]) => {
            if (available(pr, pc)) np.push([pr, pc]);
            if (available(pr + 1, pc)) np.push([pr + 1, pc]);
            if (available(pr - 1, pc)) np.push([pr - 1, pc]);
            if (available(pr, pc + 1)) np.push([pr, pc + 1]);
            if (available(pr, pc - 1)) np.push([pr, pc - 1]);
            return np;
        }, []);
        possibles.sort(([ar, ac], [br, bc]) => ar === br ? ac - bc : ar - br);
        for (let i = possibles.length - 1; i > 0; i--) {
            const p = possibles[i];
            const pp = possibles[i - 1];
            if (p[0] === pp[0] && p[1] === pp[1]) possibles.splice(i, 1);
        }
    };
    let [start, end, height, width, blizzards] = getData(data);
    console.log(start, end, height, width);
    let possibles = [[-1, start]];
    let move = 0;
    while (!possibles.some(p => p[0] === height && p[1] === end)) {
        moveBlizzards();
        nextPossibles();
        move++;
    }
    console.log(move);

    possibles = [[height, end]];
    while (!possibles.some(p => p[0] === -1 && p[1] === start)) {
        moveBlizzards();
        nextPossibles();
        move++;
    }
    console.log(move);

    possibles = [[-1, start]];
    while (!possibles.some(p => p[0] === height && p[1] === end)) {
        moveBlizzards();
        nextPossibles();
        move++;
    }
    console.log(move);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
