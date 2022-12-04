'use strict';
const fs = require("fs");

const process = (err, data) => {
    if (err) throw err;
    const elfLines = data.split('\n\n').map(b => b.split('\n'));
    const totals = elfLines.map(e => e.reduce((a,l) => a + Number.parseInt(l), 0));
    console.log(totals.reduce((t,e) => t = t > e ? t : e, 0));
    console.log(totals.reduce(([t1, t2, t3],e) => {
        return t3 >= e ? [t1, t2, t3] :
            t2 >= e ? [t1, t2, e] : 
            t1 >= e ? [t1, e, t2] : [e, t1, t2]; 
    }, [0, 0, 0]).reduce((t, x) => t + x, 0));
}

fs.readFile("./input.txt", 'utf8', process);
