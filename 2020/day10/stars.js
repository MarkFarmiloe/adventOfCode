const fs = require("fs");

const getSubtotal = (c, i, a) => {
    switch (c - 3 - (i === 0 ? -3: a[i-1])) {
        case 0:
            return 1
        case 1:
            return 1
        case 2:
            return 2
        case 3:
            return 4
        case 4:
            return 7
        default:
            return 1000; // error
    } 
}

const distinctWays = (adapters) => {
    const pinchPoints = adapters.filter(
        (c, i, a) => (i === a.length - 1) || a[i+1] - c === 3);
    let firstI = 0;
    const subtotals = pinchPoints.map(getSubtotal);
    return subtotals.reduce((a,s) => a * s, 1);
}

const getJoltCounts = (adapters) => {
    let ones = 0, twos = 0, threes = 1;
    for (let i = 0; i < adapters.length; i++) {
        const j = i - 1;
        const diff = adapters[i] - (j < 0 ? 0 : adapters[j]);
        switch (diff) {
            case 1:
                ones++;
                break;
            case 2:
                twos++;
                break;
            case 3:
                threes++;
                break;
            default:
                twos += 1000;
        }
    }
    return [ones, twos, threes];
}

const decodeLine = (l) => {
    return Number.parseInt(l.trim());
}

const process = (err, data) => {
    if (err) throw err;
    const adapters = data.split("\n").map(decodeLine);
    adapters.sort((a, b) => a - b);
    const [oneJolt, twoJolt, threeJolt] = getJoltCounts(adapters);
    console.log(oneJolt * threeJolt);

    console.log(distinctWays(adapters));
};

fs.readFile("./input.txt", 'utf8', process);
