'use strict';
const fs = require("fs");

const decodeRuleText = (txt) => {
    const t = txt.trim();
    console.log(t);
    if (t[0] ==='"') return t.slice(1 ,t.length - 1);
    return t.split(' ').map(s => Number.parseInt(s));
}

const decodeRuleLine = (rules, l) => {
    const [indexText, ruleText] = l.trim().split(':');
    const index = Number.parseInt(indexText.trim());
    if (ruleText.trim()[0] === '"')
        rules[index] = [ruleText.trim().slice(1, ruleText.trim().length - 1)];
    else
        rules[index] = ruleText.split('|').map(decodeRuleText);
    return rules;
}

const decodeRule = (rule, rules) => {
    // console.log(rule);
    if (rule.length === 1 && typeof rule[0] === "string") return rule[0];
    if (rule.length === 1) {
        return rule[0].reduce((t, sr) => t + decodeRule(rules[sr], rules), '');
    } else {
        return '(' + 
            rule[0].reduce((t, sr) => t + decodeRule(rules[sr], rules), '') +
            '|' +
            rule[1].reduce((t, sr) => t + decodeRule(rules[sr], rules), '') +
            ')';
    }
}

const matchMessage = (msg, rule) => {
    return rule.test(msg);
}

const simplify = (rules) => {
    let loops = rules.reduce((a, r, i) => {
        if (r[0].includes(i) || r[1] && r[1].includes(i)) a.push(i);
        return a;
    }, []);
    let singles = rules.reduce((a, r, i) => {
        if (r.length === 1 && typeof r[0] === 'string') {
            a.push([r[0], i]);
        }
        return a;
    }, []);
    console.log(loops);
    let changed = true;
    let j = 0;
    while (changed && j < 88) {
        // console.log('s: ', singles);
        changed = false;
        j++;
        rules.forEach((r, i) => {
            const origR = [...r];
            if (!loops.includes(i) && singles.findIndex(s => s[1] === i) === -1) {
                // console.log(i);
                if (r.every((sr) => sr.every((j) => singles.findIndex(s => s[1] === j) !== -1))) {
                    changed = true;
                    if (r.length === 1) {
                        rules[i] = [r[0].reduce((a, j) => a += singles.find(s => s[1] === j)[0], '')];
                    } else {
                        rules[i] = ['(' + r[0].reduce((a, j) => a += singles.find(s => s[1] === j)[0], '') +
                            '|' + r[1].reduce((a, j) => a += singles.find(s => s[1] === j)[0], '') +
                            ')'];
                    }
                // console.log(r, rules[i], i);
                }
            }
        });
        singles = rules.reduce((a, r, i) => {
            if (r.length === 1 && typeof r[0] === 'string') {
                a.push([r[0], i]);
            }
            return a;
        }, []);
        // console.log(rules);
    }
    return rules;
}

// const wildcard = (rule, rules) => {
//     if (rule.length === 1 && typeof rule[0] === "string") return rule[0];
    
//     if (rule.length === 1) {
//         return rule[0].reduce((t, sr) => t + wildcard(rules[sr], rules), '');
//     } else {
//         return '(' + 
//             rule[0].reduce((t, sr) => t + wildcard(rules[sr], rules), '') +
//             '|' +
//             rule[1].reduce((t, sr) => t + wildcard(rules[sr], rules), '') +
//             ')';
//     }

// }

const process = (err, data) => {
    if (err) throw err;
    const [ruleLines, msgs] = data.replace(/\r/g, '').split("\n\n");
    const rules = ruleLines.split('\n').reduce(decodeRuleLine, []);
    const messages = msgs.split('\n').map(l => l.trim());
    console.log(rules);
    console.log(rules.length);
    const simplifiedRules = simplify(rules);
    console.log('---');
    console.log(simplifiedRules);
    console.log(simplifiedRules.slice(99));
    console.log('---');
    console.log(simplifiedRules[0]);
    const matched = messages.reduce((a, m) => {
        if (matchMessage(m, new RegExp('^' + simplifiedRules[0] + '$'))) a.push(m);
        return a;
    }, []);
    console.log(matched.length);
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
