const fs = require("fs");
const { moveMessagePortToContext } = require("worker_threads");

const numRange = (test, min, max) => {
    const val = Number.parseInt(test);
    const passed = val && val >= min && val <= max;
    return passed;        
}

const testHeight =(test) => {
    const matches = test.trim().match(/^(\d*)(cm|in)$/);
    if (matches && matches[2] === 'cm') return numRange(matches[1], 150, 193);
    if (matches && matches[2] === 'in') return numRange(matches[1], 59, 76);
    return false;
};

const isColour = (test) => {
    return test.match(/^#[0-9a-f]{6,6}$/) !== null;
}

const eyeColours = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const validate = (test) => {
    return test &&
        test['byr'] && numRange(test['byr'], 1920, 2002) &&
        test['iyr'] && numRange(test['iyr'], 2010, 2020) &&
        test['eyr'] && numRange(test['eyr'], 2020, 2030) &&
        test['hgt'] && testHeight(test['hgt']) &&
        test['hcl'] && isColour(test['hcl']) &&
        test['ecl'] && eyeColours.includes(test['ecl'].trim()) &&
        test['pid'] && test['pid'].trim().match(/^\d{9,9}$/) !== null;
};

const countValid = (a, l) => {
    const items = l.trim().split(/\s+/);
    const obj = items.reduce((o, i) => {
        const [k, v] = i.trim().split(':'); 
        o[k] = v;
        return o;
    }, {});
    return a + (validate(obj) ? 1 : 0);
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.replace(/\r/g, '').split("\n\n");
    console.log(lines.reduce(countValid, 0));
};

fs.readFile("./input.txt", 'utf8', process);
