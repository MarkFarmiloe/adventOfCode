const fs = require("fs");

const manhattan = (instructions) => {
    let d = 1;
    const [n, e] = instructions.reduce((p, [code, v]) => {
        switch (code) {
            case 'F':
                p[0] += (d === 0) ? v : (d === 2 ? -v : 0);
                p[1] += (d === 1) ? v : (d === 3 ? -v : 0);
                break;
            case 'N':
                p[0] += v;
                break;
            case 'S':
                p[0] -= v;
                break;
            case 'E':
                p[1] += v;
                break;
            case 'W':
                p[1] -= v;
                break;
            case 'L':
                d = (d + 4 - (v / 90)) % 4;
                break;
            case 'R':
                d = (d + 4 + (v / 90)) % 4;
                break;
            default:
                console.log('OOPS');
                break;
        }
        return p;
    }, [0, 0]);
    return Math.abs(n) + Math.abs(e);
}

const rotate = (n,e,a) => {
    const r = (4 + a) % 4;
    switch (r) {
        case 0:
            return [n, e];
        case 1:
            return [-e, n];
        case 2:
            return [-n, -e];
        case 3:
            return [e, -n];
        default:
            console.log('OOPS');
            return [n, e];
    }
}

const manhattan2 = (instructions) => {
    let wn = 1, we = 10;
    let d = 1;
    const [n, e] = instructions.reduce((p, [code, v]) => {
        switch (code) {
            case 'F':
                p[0] += wn * v;
                p[1] += we * v;
                break;
            case 'N':
                wn += v;
                break;
            case 'S':
                wn -= v;
                break;
            case 'E':
                we += v;
                break;
            case 'W':
                we -= v;
                break;
            case 'L':
                [wn, we] = rotate(wn, we, -v / 90); 
                break;
            case 'R':
                [wn, we] = rotate(wn, we, v / 90); 
                break;
            default:
                console.log('OOPS');
                break;
        }
        return p;
    }, [0, 0]);
    return Math.abs(n) + Math.abs(e);
}

const decodeLine = (l) => {
    return [l[0], Number.parseInt(l.trim().slice(1))];
}

const process = (err, data) => {
    if (err) throw err;
    const instructions = data.split("\n").map(decodeLine);

    console.log(manhattan(instructions));

    console.log(manhattan2(instructions));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
