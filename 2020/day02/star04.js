const fs = require("fs");

fs.readFile("./input.txt", 'utf8', (err, data) => {
    const lines = data.split("\n");
    const parts = lines.map(l => {
        const i = l.indexOf('-');
        const j = l.indexOf(' ');
        const k = l.indexOf(':');
        const details = {
            first: Number.parseInt(l.slice(0, i)),
            second: Number.parseInt(l.slice(i + 1, j)),
            char: l.slice(j + 1, k).trim(),
            pwd: l.slice(k + 1).trim()
        };
        return details;
    });
    console.log(parts.reduce((a,p) => {
        return a + (goodPwd(p) ? 1: 0);
    }, 0));
});

const goodPwd = ({first, second, char, pwd}) => {
    return (
        (pwd[first - 1] === char ? 1 : 0) +
        (pwd[second - 1] === char ? 1 : 0)
    ) === 1;
};
