'use strict';
const fs = require("fs");

const getData = (raw) => {
    const getMonkeyData = m => {
        const lines = m.split('\n');
        const monkeyNo = Number.parseInt(lines[0].split(' ')[1].split(':')[0]);
        const items = lines[1].split(': ')[1].split(',').map(i => Number.parseInt(i.trim()));
        const dests = [
            Number.parseInt(lines[4].split('monkey')[1].trim()),
            Number.parseInt(lines[5].split('monkey')[1].trim())
        ];
        return { monkeyNo, items, dests, count: 0 };
    };
    return raw.split('\n\n').map(m => getMonkeyData(m));
}

const modulos = [[23, 19, 13, 17], [2, 7, 11, 19, 3, 5, 17, 13]];
const ops = [['*19', '+6', '*r', '+3'], ['*3', '*19', '+2', '*r', '+8', '+6', '+7', '+4']]

const processMonkey = (m, monkeys, level, fileNo) => {
    m.count += m.items.length;
    while (m.items.length > 0) {
        const item = m.items.shift();
        if (level === 0) {
            let r = item;
            let newItem = eval('' + item + ops[fileNo][m.monkeyNo]);
            newItem = Math.floor(newItem / 3);
            if (newItem % modulos[fileNo][m.monkeyNo] === 0)
                monkeys[m.dests[0]].items.push(newItem);
            else
                monkeys[m.dests[1]].items.push(newItem);
            // console.log(m, newItem, newItem % modulos[fileNo][m.monkeyNo] === 0);
        } else {
            let newItem = item.map(r => eval('' + r + ops[fileNo][m.monkeyNo]));
            newItem = newItem.map((n, i) => n % modulos[fileNo][i]);
            if (newItem[m.monkeyNo] === 0)
                monkeys[m.dests[0]].items.push(newItem);
            else
                monkeys[m.dests[1]].items.push(newItem);
        }
    }
}

const process = (err, data) => {
    if (err) throw err;
    let fileNo = (fileName === "./test.txt" ? 0 : 1);
    for (let level = 0; level < 2; level++) {
        let monkeys = getData(data);
        if (level === 1) {
            monkeys.forEach(monkey => {
                monkey.items = monkey.items.map(item => {
                    const rems = [];
                    modulos[fileNo].forEach(m => {
                        rems.push(item % m);
                    });
                    return rems;
                });
            });
        }
        let rounds = (level === 0 ? 20 : 10000);
        for (let i = 0; i < rounds; i++) {
            monkeys.forEach(m => processMonkey(m, monkeys, level, fileNo));
        }
        console.log(monkeys.reduce(([a, b], m) => {
            const c = m.count;
            if (c > a) return [c, a];
            if (c > b) return [a, c];
            return [a, b];
        }, [0, 0]));
    }
}

// const fileName = "./test.txt";
const fileName = "./input.txt";

fs.readFile(fileName, 'utf8', process);
