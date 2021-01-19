const fs = require("fs");

const decodeLine = (l) => {
    return Number.parseInt(l.trim());
}

const checkValid = (codes, ind) => {
    const t = codes[ind];
    const preamble = codes.slice(ind-25,ind);
    const valid = preamble.filter((c,i,a) => {
        for (let j = i + 1; j < a.length; j++) {
            if (c + a[j] === t) return true;
        }
        return false;
    });
    return valid.length !== 0;
}

const getFirstNonValid = (codes) => {
    for (let i = 25; i < codes.length; i++) {
        if (!checkValid(codes, i)) return codes[i];
    }
    return -1;
}

const getEncWeakness = (codes, test) => {
    for (let i = 0; i < codes.length; i++) {
        for (let j = i, k = 0; j < codes.length; j++) {
            k += codes[j];
            if (k === test) {
                let min = test, max = 0;
                for (let n = i; n <= j; n++) {
                    const e = codes[n];
                    max = (e > max) ? e : max;
                    min = (e < min) ? e : min;
                }
                return min + max;
            } 
            if (k > test) break;
        }
    }
    return 0;
}

const process = (err, data) => {
    if (err) throw err;
    const codes = data.split("\n").map(decodeLine);
    const firstInvalid = getFirstNonValid(codes);
    console.log(firstInvalid);

    console.log(getEncWeakness(codes, firstInvalid));
};

fs.readFile("./input.txt", 'utf8', process);
