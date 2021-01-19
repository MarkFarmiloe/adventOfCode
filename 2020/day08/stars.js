const fs = require("fs");

const getLastAccValue = (lines) => {
    const visited = [];
    let acc = 0, i = 0;
    for (; !visited.includes(i) && i < lines.length; i++) {
        const [code, value] = lines[i];
        visited.push(i);
        switch (code) {
            case 'acc':
                acc += value;
                break;
            case 'jmp':
                i += value -1;
            default:
                break;
        }
    }
    return [acc, i];
}

const getCorrectedAccValue = (lines) => {
    let i = -1, xLines = [], acc = 0, lastCodeLine = -1;
    while (lastCodeLine < lines.length) {
        [xLines, i] = getNextChange(lines, i);
        [acc, lastCodeLine] = getLastAccValue(xLines);
    }
    return acc;
}

const getNextChange = (lines, i = -1) => {
    for (i++; i < lines.length; i++) {
        const [code, value] = lines[i];
        if (code === 'acc') continue;
        const newItem = [(code === 'nop' ? 'jmp' : 'nop'), value];
        const xLines = lines.map((l,ind) => (ind === i) ? newItem : l);
        return [xLines, i];
    }
}

const decodeLine = (l) => {
    const parts = l.trim().split(' ');
    return [parts[0], Number.parseInt(parts[1])];
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.split("\n").map(decodeLine);

    console.log(getLastAccValue(lines)[0]);

    console.log(getCorrectedAccValue(lines));
};

fs.readFile("./input.txt", 'utf8', process);
