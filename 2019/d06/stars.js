'use strict';
const fs = require("fs");

const decodeOpCode = (opCode) => {
    const op = opCode % 100;
    opCode = (opCode - op) / 100;
    const modes = [];
    for (let i = 0; i < 3; i++) {
        modes[i] = opCode % 10;
        opCode = (opCode - modes[i]) / 10;
    }
    return [op, modes];
}

const exerciseCodes = (codes, noun, verb, input) => {
    const c = [...codes];
    c[1] = noun;
    c[2] = verb;
    for (let i = 0; ; ) {
        const opCode = c[i++];
        const [op, modes] = decodeOpCode(opCode);
        console.log(`${i}: ${opCode} -> ${op} ${modes[0]} ${modes[1]} ${modes[2]}`);
        let a, b, d;
        switch (op) {
            case 1:
                [a, b, d] = c.slice(i, i + 3);
                c[d] = (modes[0] ? a : c[a]) + (modes[1] ? b : c[b]);
                if (modes[2]) console.log('OOPS1');
                i += 3;
                break;
            case 2:
                [a, b, d] = c.slice(i, i + 3);
                c[d] = (modes[0] ? a : c[a]) * (modes[1] ? b : c[b]);
                if (modes[2]) console.log('OOPS2');
                i += 3;
                break;
            case 3:
                d = c[i++]
                c[d] = input;
                if (modes[0] || modes[1] || modes[2]) console.log('OOPS3');
                break;
            case 4:
                d = c[i++]
                console.log((modes[0] ? d : c[d] ));
                if (modes[1] || modes[2]) console.log('OOPS4');
                break;
            case 5:
                [a, b] = c.slice(i, i + 2);
                if (modes[2]) console.log('OOPS5');
                if ((modes[0] ? a : c[a]) !== 0) {
                    i = (modes[1] ? b : c[b]);
                } else {
                    i += 2;
                }
                break;
            case 6:
                [a, b] = c.slice(i, i + 2);
                if (modes[2]) console.log('OOPS6');
                if ((modes[0] ? a : c[a]) === 0) {
                    i = (modes[1] ? b : c[b]);
                } else {
                    i += 2;
                }
                break;
            case 7:
                [a, b, d] = c.slice(i, i + 3);
                if (modes[2]) console.log('OOPS7');
                c[d] = ((modes[0] ? a : c[a]) < (modes[1] ? b : c[b])) ? 1 : 0;
                i += 3;
                break;
            case 8:
                [a, b, d] = c.slice(i, i + 3);
                if (modes[2]) console.log('OOPS8');
                c[d] = ((modes[0] ? a : c[a]) === (modes[1] ? b : c[b])) ? 1 : 0;
                i += 3;
                break;
            case 99:
                return c[0];
            default:
                console.log('OOPS!');
                return;
        }
    }
    return -1;
}

const process = (err, data) => {
    if (err) throw err;
    const codes = data.replace(/\r/g, '').split(",").map(n => Number.parseInt(n));
    console.log(exerciseCodes(codes, ...codes.slice(1, 3), 1));
    console.log(exerciseCodes(codes, ...codes.slice(1, 3), 5));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
