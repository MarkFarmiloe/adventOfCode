'use strict';
const fs = require("fs");

let runNo = 0;

const doCalc = (tokens, result = 0, addPlus = true) => {
    if (addPlus) tokens.unshift('+');
    while (tokens.length > 0) {
        // console.log(result, tokens);
        const op = tokens[0];
        let num = tokens[1];
        tokens = tokens.slice(2);
        // console.log(op, num);
        if (num === '(') {
            let opens = 1;
            let j = 0;
            for (; j < tokens.length; j++) {
                const element = tokens[j];
                opens += element === '(' ? 1 : 0;
                opens -= element === ')' ? 1 : 0;
                if (opens === 0) break;
            }
            num = doCalc(tokens.slice(0, j));
            tokens = tokens.slice(j + 1);
        }
        switch (op) {
            case '+':
                result += num;
                break;
            case '*':
                if (runNo === 0) {
                    result *= num;
                } else {
                    result *= doCalc(tokens, num, false);
                    tokens = [];
                }
                break;
            default:
                console.log('OOPS');
                break;
        }
    }
    return result;
}

const tokeniseLine = (line) => {
    return line.trim().split(' ').reduce((acc, p) => {
        let q = p.trim();
        switch (q) {
            case '+':
                acc.push('+');
                break;
            case '*':
                acc.push('*');
                break;
            default:
                while (q[0] === '(') {
                    acc.push('(');
                    q = q.slice(1)
                }
                acc.push(Number.parseInt(q));
                while (q[q.length - 1] === ')') {
                    acc.push(')');
                    q = q.slice(0, q.length - 1);
                }
                break;
        }
        return acc;
    }, []);
}

const process = (err, data) => {
    if (err) throw err;
    const calcTokens = data.replace(/\r/g, '').split(    "\n")  .map(tokeniseLine);
    for (runNo = 0; runNo < 2; runNo++)      {
        let results = calcTokens.map(t => doCalc([...t]));
          console.log(results); 
        console.log(results.reduce((a, r) => a + r, 0));
    }
};
// console.log(testConversion());

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
