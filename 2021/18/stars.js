'use strict';
const fs = require("fs");

const getData = (data) => {
    return data
        .trim().replace(/\r/g, '').split('\n')
        .map(l => l.trim());
};

const oneReduction = number => {
// first try to explode
    const digits = '0123456789';
    let count = 0;
    for (let i = 0; i < number.length; i++) {
        if (number[i] === ']') count--;
        else if (number[i] === '[') {
            count++;
            if (count === 5) { //explode
                const left = parseInt(number.slice(i+1));
                const posComma = number.indexOf(',', i);
                const right = parseInt(number.slice(posComma+1));
                const posClose = number.indexOf(']', i);
                let l = number.slice(0, i);
                let r = number.slice(posClose+1);
                for (let j = 0, k = 0; j < r.length; j++) {
                    if (digits.includes(r[j])) {
                        for (k = j+1; k < r.length; k++) {
                            if (!digits.includes(r[k])) break;
                        }
                        r = r.slice(0, j) +
                            (parseInt(r.slice(j)) + right) +
                            r.slice(k);
                        break;
                    }
                }
                for (let j = l.length-1, k = 0; j >= 0; j--) {
                    if (digits.includes(l[j])) {
                        for (k = j-1; k >= 0; k--) {
                            if (!digits.includes(l[k])) break;
                        }
                        j++;
                        k++;
                        l = l.slice(0, k) +
                            (parseInt(l.slice(k)) + left) +
                            l.slice(j);
                        break;
                    }
                }
                number = l + '0' + r;
                return [number, true];
            }
        }
    }
// else try to split
    for (let i = 0; i < number.length; i++) {
        if (digits.includes(number[i])) {
            let d = parseInt(number.slice(i));
            if (d > 9) {
                const left = (d - (d % 2)) / 2;
                const right = d - left;
                for (let j = i+1; j < number.length; j++) {
                    if (!digits.includes(number[j])) {
                        number = number.slice(0, i) +
                            '[' + left + ',' + right + ']' +
                            number.slice(j);
                        return [number, true];
                    }
                }
            }
        }
    }
// else all done
    return [number, false];
}

const reduce = number => {
    let changed;
    do {
        [number, changed] = oneReduction(number);
    } while (changed);
    return number;
};

const magnitude = ([l, r]) => {
    const lv = Array.isArray(l) ? magnitude(l): l;
    const rv = Array.isArray(r) ? magnitude(r): r;
    return 3 * lv + 2 * rv;
}

const process = (err, data) => {
    if (err) throw err;
    const rows = getData(data);    
    const result = rows.reduce((a, r) => {
        const added = '[' + a + ',' + r + ']';
        return reduce(added);
    });
    console.log(magnitude(JSON.parse(result)));
    let max = 0;
    for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
            const v1 = magnitude(JSON.parse(reduce('[' + rows[i] + ',' + rows[j] + ']')));
            const v2 = magnitude(JSON.parse(reduce('[' + rows[j] + ',' + rows[i] + ']')));
            max = max > v1 ? max : v1;
            max = max > v2 ? max : v2;
        }
    }
    console.log(max);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
