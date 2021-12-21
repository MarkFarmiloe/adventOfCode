'use strict';

const toKey = (aPos, bPos, aVal, bVal) => {
    return ((aPos * 10 + bPos) * 100 + aVal) * 100 + bVal;
}

const fromKey = key => {
    const bVal = key % 100;
    key = (key - bVal) / 100;
    const aVal = key % 100;
    key = (key - aVal) / 100;
    const bPos = key % 10;
    const aPos = (key - bPos) / 10;
    return [aPos, bPos, aVal, bVal];
}

const dirac = (a, b) => {
    let data = {};
    // zero-based!
    data[toKey(a-1, b-1, 0, 0)] = 1;
    let aWins = 0, bWins = 0;
    let nextPlayer = 'a';
    const hits = [0,0,0,1,3,6,7,6,3,1];
    while (Object.keys(data).length > 0) {
        data = Object.entries(data).reduce((a, [k, count]) => {
            const [aPos, bPos, aVal, bVal] = fromKey(k);
            for (let i = 3; i < 10; i++) {
                const newCount = count * hits[i];
                if (nextPlayer === 'a') {
                    const pos = (aPos + i) % 10;
                    const val = aVal + pos + 1; // pos is zero-based!
                    if (val > 20) {
                        aWins += newCount;
                    } else {
                        const key = toKey(pos, bPos, val, bVal);
                        a[key] = a[key] ? a[key] + newCount : newCount;        
                    }
                } else {
                    const pos = (bPos + i) % 10;
                    const val = bVal + pos + 1; // pos is zero-based!
                    if (val > 20) {
                        bWins += newCount;
                    } else {
                        const key = toKey(aPos, pos, aVal, val);
                        a[key] = a[key] ? a[key] + newCount : newCount;        
                    }
                }           
            }
            return a;
        }, {});
        nextPlayer = nextPlayer === 'a' ? 'b' : 'a';
    }
    return [aWins, bWins];
};

const deterministic = (a, b) => {
    let [aPos, bPos] = [a, b];
    let rolls = 0, aScore = 0, bScore = 0;
    let next = 'a';
    while (aScore < 1000 && bScore < 1000) {
        let move = 1 + (rolls++ % 100);
        move += 1 + (rolls++ % 100);
        move += 1 + (rolls++ % 100);
        if (next === 'a') {
            aPos = ((aPos - 1 + move) % 10) + 1;
            aScore += aPos;
            next = 'b';
        } else {
            bPos = ((bPos - 1 + move) % 10) + 1;
            bScore += bPos;
            next = 'a';
        }
    }
    return rolls * (aScore < bScore ? aScore : bScore);
}

console.log(deterministic(4, 8));
console.log(dirac(4, 8));
console.log();
console.log(deterministic(3, 7));
console.log(dirac(3, 7));
