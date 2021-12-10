'use strict';
const fs = require("fs");
const { decode } = require("punycode");

const getData = (data) => {
    return data.trim().replace(/\r/g, '').split('\n').map(l => l.trim());
};

const errorScores = {')': 3, ']': 57, '}': 1197, '>': 25137};
const completionScores = {'(': 1, '[': 2, '{': 3, '<': 4};
const opening = {')': '(', ']': '[', '}': '{', '>': '<'};

const getScore = line => {
    const stack = [];
    for (const c of line) {
        switch (c) {
            case '(':
            case '[':
            case '{':
            case '<':
                stack.push(c);
                break;
            case ')':
            case ']':
            case '}':
            case '>':
                const d = stack.pop();
                if (d !== opening[c]) {
                    return errorScores[c];
                }
                break;
            default:
                console.log("OOPS 1");
                break;
        }
    }
    // line incomplete, but not corrupted
    let completionScore = 0;
    while (stack.length) {
        const c = stack.pop();
        completionScore = 5 * completionScore + completionScores[c];
    }
    return -completionScore;       
};

const process = (err, data) => {
    if (err) throw err;
    const lines = getData(data);
    const [errorScore, completionScores] = lines.reduce(([error, completions], l) => {
        const score = getScore(l);
        if (score > 0) error += score; else completions.push(-score);
        return [error, completions];
    }, [0, []]);
    console.log(errorScore);
    completionScores.sort((a, b) => a - b);
    console.log(completionScores[(completionScores.length - 1) / 2]);
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
