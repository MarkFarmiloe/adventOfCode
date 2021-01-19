'use strict';
const fs = require("fs");

const findLast = (numbers, last) => {
    for (let i = numbers.length - 2; i >= 0; i--) {
        if (numbers[i] === last) return numbers.length - 1 - i;
    }
    return 0;
}

// const nthNumber = (numbers, n) => {
//     // console.log(numbers, n);

//     for (let i = 0; i < n; i++) {
//         numbers.push(findLast(numbers, numbers[numbers.length - 1]))
//         // console.log(numbers);
//     }
//     // console.log(numbers.slice(2000));
//     return numbers[n - 1];
// }

const nthNumber = (numbers, n) => {
    const lookup = numbers.reduce((a, n, i) => {
        a[n] = Object.keys(a).includes(n) ? [i, a[n][0]] : [i, -1] ;
        return a;
    }, {});
    let last = numbers[numbers.length - 1];
    let a, b, c, next;
    for (let i = numbers.length; i < n; i++) {
        [a, b] = lookup[last];
        next = (b === -1) ? 0 : a - b;
        [c, ] = (lookup[next] === undefined) ? [-1, -1] : lookup[next];
        lookup[next] = [i, c];
        last = next;
    }
    return last;
}

const nthNumber2 = (numbers, n) => {
    const lookup = [];
    numbers.forEach((n, i) => lookup[n] = (lookup[n] === undefined) ? [i, -1] : [i, lookup[n][0]] );
    let last = numbers[numbers.length - 1];
    let a, b, c, next;
    for (let i = numbers.length; i < n; i++) {
        [a, b] = lookup[last];
        next = (b === -1) ? 0 : a - b;
        [c, ] = (lookup[next] === undefined) ? [-1, -1] : lookup[next];
        lookup[next] = [i, c];
        last = next;
    }
    return last;
}
function* nNegOnes(n) {
    for (let i = 0; i < n; i++) {
        yield -1;
    }
} 

const nthNumber3 = (numbers, n) => {
    const g1 = nNegOnes(n);
    const lookup1 = new Int32Array(g1);
    const g2 = nNegOnes(n);
    const lookup2 = new Int32Array(g2);
    numbers.forEach((n, i) => {
        lookup2[n] = lookup1[n];
        lookup1[n] = i; 
    });
    let last = numbers[numbers.length - 1];
    let next;
    for (let i = numbers.length; i < n; i++) {
        next = lookup2[last];
        next = (next === -1) ? 0 : lookup1[last] - next;
        lookup2[next] = lookup1[next];
        lookup1[next] = i;
        last = next;
    }
    return last;
}

const process = (err, data) => {
    if (err) throw err;
    const numbers = data.split(',').map(s => Number.parseInt(s.trim()));
    
    console.log(nthNumber3(numbers, 2020));

    console.log(nthNumber3(numbers, 30000000));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
