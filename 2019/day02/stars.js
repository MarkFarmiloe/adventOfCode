'use strict';
const fs = require("fs");

const exerciseCodes = (codes, noun, verb) => {
    const c = [...codes];
    c[1] = noun;
    c[2] = verb;
    for (let i = 0; ; i += 4) {
        const [op, a, b, d] = c.slice(i, i + 4);
        switch (op) {
            case 1:
                c[d] = c[a] + c[b];
                break;
            case 2:
                c[d] = c[a] * c[b];
                break;
            case 99:
                return c[0];
            default:
                console.log('OOPS');
                break;
        }
    }
    return -1;
}

const process = (err, data) => {
    if (err) throw err;
    const codes = data.replace(/\r/g, '').split(",").map(n => Number.parseInt(n));
    console.log(exerciseCodes(codes, 12, 2));
    for (let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb++) {
            if (exerciseCodes(codes, noun, verb) === 19690720) {
                console.log(noun, verb);
                return;
            }
        }
    }
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
