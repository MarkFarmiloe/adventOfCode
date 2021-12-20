'use strict';
const fs = require("fs");

const getData = (data) => {
    const parts = data
        .trim().replace(/\r/g, '').split('\n\n').map(p => p.trim());
    return [
        parts[0],
        parts[1].split('\n').map(l => l.trim().split(''))
    ];
};

const enhance = (image, iea, second = false) => {
    const height = image.length + 2;
    const width = image[0].length + 2;
    const mtRow = new Array(width);
    for (let i = 0; i < width; i++) {
        mtRow[i] = second? iea[0]: '.';        
    };
    let base = [[...mtRow]].concat(
        image.map(row => second ? [iea[0], ...row, iea[0]]: ['.', ...row, '.'])
    ).concat([[...mtRow]]);
    return base.map((line, row) => {
        return line.map((_, col) => {
            let index = 0;
            for (let i = row-1; i < row+2; i++) {
                for (let j = col-1; j < col+2; j++) {
                    index *= 2;
                    if (i >= 0 && i < height && j >= 0 && j < width) {
                        index += base[i][j] === '#' ? 1: 0;
                    } else if (second) {
                        index += iea[0] === '#' ? 1: 0;
                    }
                }
            }
            return iea[index];
        });
    });
};

const process = (err, data) => {
    if (err) throw err;
    const [iea, image] = getData(data);
    let enhanced = [...image];
    for (let i = 0; i < 2; i++) {
        enhanced = enhance(enhanced, iea, i % 2 === 1);
    }
    console.log(enhanced.reduce((a, row) => 
    a + row.reduce((b, p) => b + (p === '#' ? 1 : 0), 0)
    , 0));
    for (let i = 2; i < 50; i++) {
        enhanced = enhance(enhanced, iea, i % 2 === 1);
    }
    console.log(enhanced.reduce((a, row) => 
    a + row.reduce((b, p) => b + (p === '#' ? 1 : 0), 0)
    , 0));
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
