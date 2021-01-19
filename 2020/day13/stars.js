const fs = require("fs");

const getMultiples = (n) => {
    let multiples = [], test = n;
    for (let i = 2; i < Math.floor(Math.sqrt(n)); i++) {
        while (test % i === 0) {
            multiples.push(i);
            test /= i;
        }
    }
    if (test !== 1) multiples.push(test);
    return multiples;
}

const nextInc = (c, d) => {
    let multiples = getMultiples(c);
    for (const n of multiples) {
        if (d % n === 0) d /= n;
    }
    return c * d;
}

const winningTime = (buses) => {
    let [inc, pos] = buses[0]; 
    let t = inc - pos;
    for (let i = 1; i < buses.length; i++) {
        const b = buses[i];
        while((t + b[1]) % b[0]) t += inc;
        inc = nextInc(inc, b[0]);
    } 
    return t;
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.split("\n").map(s => s.trim());
    const [earliest, buses] = [parseInt(lines[0]), lines[1].split(',').map(b => (b === 'x') ? -1 : parseInt(b))];
    
    const bestBus = buses.reduce((a, b) => {
        if (b === -1) return a;
        const wait = b - (earliest % b);
        return (wait < a[0] ? [wait, b] : a);
     } , [Number.MAX_SAFE_INTEGER, 0]);

    console.log(bestBus[0] * bestBus[1]);

    const running = buses.reduce((a,b,i) => {
        if (b !== -1) a.push([b, i]);
        return a;
    }, []).sort((a,b) => b[0] - a[0]);

    console.log(winningTime(running));
    // for (const r of running) {
    //     console.log(r[0], getMultiples(r[0]));
    // }
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
