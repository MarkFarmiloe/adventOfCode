const fs = require("fs");

const countValid = (a, l) => {
    const keys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']; //, 'cid'];
    const items = l.split(/\s+/);
    const obj = items.reduce((o, i) => {
        const [k, v] = i.trim().split(':'); 
        o[k] = v;
        return o;
    }, {});
    const foundKeys = Object.keys(obj);
    return a + (keys.every(k => foundKeys.includes(k)) ? 1 : 0);
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.replace(/\r/g, '').split("\n\n");
    console.log(lines.reduce(countValid, 0));
};

fs.readFile("./input.txt", 'utf8', process);
