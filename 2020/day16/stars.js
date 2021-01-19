'use strict';
const fs = require("fs");

const valid = (rules, n) => {
    for (let i = 0; i < rules.length; i++) {
        const values = rules[i].values;
        for (let j = 0; j < values.length; j++) {
            const [min, max] = values[j];
            if (n >= min && n <= max) return true;
        }
    }
    return false;
}

const scanErrorRate = (r, t) => {
    let invalids = [];
    let validTkts = [];
    t.forEach(tkt => {
        let validTkt = true;
        tkt.forEach(n => {
            if (!valid(r, n)) {
                validTkt = false;
                invalids.push(n); 
            }
        });
        if (validTkt) validTkts.push(tkt);
    });
    return [invalids.reduce((a, n) => a + n, 0), validTkts];
}

const decodeTicket = (l) => {
    return l.trim().split(",").map(n => Number.parseInt(n));
}

const decodeRuleLine = (l) => {
    const rv = l.trim().split(":");
    const vs = rv[1].split("or").map(v => {
        return v.trim().split("-").map(t => Number.parseInt(t.trim()));
    });
    return {text: rv[0].trim(), values: vs}; //, pos: []};
}

const process = (err, data) => {
    if (err) throw err;
    const parts = data.replace(/\r/g, '').split("\n\n");
    const rules = parts[0].split("\n").map(decodeRuleLine);
    const myTicket = decodeTicket(parts[1].split("\n")[1]);
    const otherTickets = parts[2].split("\n").slice(1).map(decodeTicket);
    const [errorRate, validTickets] = scanErrorRate(rules, otherTickets);
    console.log(errorRate);
    validTickets.push(myTicket);
    let fieldValues = rules.map(r => new Set());
    fieldValues = validTickets.reduce((a, t) => {
        t.forEach((v, i) => a[i].add(v));
        return a;
    }, fieldValues);
    let rulePositions = rules.map(r => {
        const positions = [];
        const [[a,b],[c,d]] = r.values;
        fieldValues.forEach((f, i) => {
            let valid = true;
            for (let v of f) {
                if ((v >= a && v <= b) || (v >= c && v <= d)) continue;
                valid = false;
                break;
            }
            if (valid) positions.push(i);
        });
        return positions;
    });
    let singles = rulePositions.reduce((a, p, i) => {
        if (p.length === 1) {
            a.push([p[0], i]);
        }
        return a;
    }, []);
    while (singles.length > 0) {
        singles.forEach(([p, i]) => {
            rules[i].pos = p;
            rulePositions = rulePositions.map(r => r.filter(n => n !== p));
        });
        singles = rulePositions.reduce((a, p, i) => {
            if (p.length === 1) {
                a.push([p[0], i]);
            }
            return a;
        }, []);
    }
    console.log(rules.reduce((a, r) => {
        if (r.text.startsWith('departure')) return a * myTicket[r.pos]; 
        return a;
    }, 1));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
