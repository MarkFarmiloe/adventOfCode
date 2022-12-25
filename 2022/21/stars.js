'use strict';
const fs = require("fs");

const getData = (raw) => {
    const decodeLine = (a, l) => {
        const [key, value] = l.split(': ');
        const parts = value.split(' ');
        a[key] = parts.length > 1 ? parts : parseInt(value);
        return a;
    };
    const lines = raw.split('\n');
    return lines.reduce(decodeLine, {});

}

const doCalc = (monkeys, [left, op, right]) => {
    const l = (typeof left === 'number') ? left : monkeys[left]; 
    const r = (typeof right === 'number') ? right : monkeys[right]; 
    switch (op) {
        case '+':
            return l + r;
        case '-':
            return l - r;
        case '*':
            return l * r;
        case '/':
            return l / r;
        default:
            return l;
    }
}

const process = (err, data) => {
    if (err) throw err;
    let monkeys = getData(data);
    console.log(monkeys);
    while (Object.values(monkeys).some(v => typeof v !== 'number')) {
        Object.keys(monkeys).forEach(key => {
            const value = monkeys[key];
            if (typeof value !== 'number') {
                if (typeof monkeys[value[0]] === 'number' &&
                    typeof monkeys[value[2]] === 'number') {
                        monkeys[key] = doCalc(monkeys, value);
                }
            }
        });
    }
    console.log(monkeys['root']);

    monkeys = getData(data);
    delete monkeys.humn;
    let lastCount;
    do {
        lastCount = Object.values(monkeys).filter(v => typeof v !== 'number').length;
        Object.keys(monkeys).forEach(key => {
            const value = monkeys[key];
            if (typeof value !== 'number') {
                if ((typeof value[0] === 'number' || typeof monkeys[value[0]] === 'number') &&
                    (typeof value[2] === 'number' || typeof monkeys[value[2]] === 'number')) {
                        monkeys[key] = doCalc(monkeys, value);
                } else {
                    if (typeof monkeys[value[0]] === 'number') {
                        monkeys[key] = [monkeys[value[0]], value[1], value[2]];
                    }
                    if (typeof monkeys[value[2]] === 'number') {
                        monkeys[key] = [value[0], value[1], monkeys[value[2]]];
                    }
                }
            }
        });
    } while (Object.values(monkeys).filter(v => typeof v !== 'number').length < lastCount);
    console.log(monkeys);
    const rootValue = monkeys.root;
    let key, value;
    if (typeof rootValue[0] === 'number') {
        key = rootValue[2];
        value = rootValue[0];
    } else {
        key = rootValue[0];
        value = rootValue[2];
    }
    while (key !== 'humn') {
        const [l, o, r] = monkeys[key];
        let lKey = (typeof l !== 'number');
        key = lKey ? l : r;
        switch (o) {
            case '+':
                value -= lKey ? r : l; 
                break;
            case '-':
                value = lKey ? (r + value) : (l - value); 
                break;
            case '*':
                value /= lKey ? r : l; 
                break;
            case '/':
                value = lKey ? (r * value) : (l / value); 
                break;
        }
    }
    console.log(value);
}

const run = 1;
const filename = run === 0 ? "./test.txt" : "./input.txt";

fs.readFile(filename, 'utf8', process);
