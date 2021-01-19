const fs = require("fs");

const totalYes = (a, g) => {
    const groupAnswers = {};
    for (const c of g.replace(/\n/g, '')) {
        groupAnswers[c] = 1;
    }
    return a + Object.keys(groupAnswers).length;
}

const allYes = (a, g) => {
    const groupAnswers = {};
    const lines = g.split('\n');
    lines.forEach(l => {
        for (const c of l) {
            groupAnswers[c] = groupAnswers[c] ? groupAnswers[c] + 1 : 1;
        }
    });
    const allYes = Object.values(groupAnswers).reduce((a, g) => a + (g === lines.length), 0);
    return a + allYes;
}

const process = (err, data) => {
    if (err) throw err;
    const groups = data.replace(/\r/g, '').split("\n\n");
    console.log(groups.reduce(totalYes, 0));
    console.log(groups.reduce(allYes, 0));
};

fs.readFile("./input.txt", 'utf8', process);
