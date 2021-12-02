'use strict';
const fs = require("fs");

const getInstructions = (data) => {
    return data
        .trim()
        .split('\n')
        .map(l => {
            const [d, v] = l.trim().split(' ');
            return [d.trim(), Number.parseInt(v.trim())];
        });
};

const directions = ["forward", "down", "up"];
const process = (err, data) => {
    if (err) throw err;
    const instructions = getInstructions(data);
    const [h, v] = instructions.reduce(([h, v], [d, q]) => {
        switch (d) {
            case "forward":
                return [h + q, v];
            case "down":
                return [h, v + q];
            case "up":
                if (v < q) console.log("Flying!!");
                return [h, v - q];
            default:
                console.log("Bad direction: " + d);
        }
    }, [0, 0]);
    console.log(h, v, h * v);
// next star
    const [h2, v2, _] = instructions.reduce(([h, v, a], [d, q]) => {
        switch (d) {
            case "forward":
                return [h + q, v + (q * a), a];
            case "down":
                return [h, v, a + q];
            case "up":
                return [h, v, a - q];
            default:
                console.log("Bad direction: " + d);
        }
    }, [0, 0, 0]);
    console.log(h2, v2, h2 * v2);
}

fs.readFile("./input.txt", 'utf8', process);
