const fs = require("fs");

fs.readFile("./input.txt", 'utf8', (err, data) => {
    const lines = data.split("\n");
    const parts = lines.map(l => {
        const i = l.indexOf('-');
        const j = l.indexOf(' ');
        const k = l.indexOf(':');
        const details = {
            min: Number.parseInt(l.slice(0, i)),
            max: Number.parseInt(l.slice(i + 1, j)),
            char: l.slice(j + 1, k).trim(),
            pwd: l.slice(k + 1).trim()
        };
        return details;
    });
    console.log(parts.reduce((a,p) => {
        return a + (goodPwd(p) ? 1: 0);
    }, 0));
});

const goodPwd = ({min, max, char, pwd}) => {
    const re = new RegExp(char, 'g');
    const found = pwd.toString().match(re);
    const count = found ? found.length : 0;
    return (count >= min && count <= max);
};
