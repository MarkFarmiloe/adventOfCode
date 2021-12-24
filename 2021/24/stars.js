'use strict';

const isValid = (a,b,c,e,f,g,i) => {
    const d = (c+8) - 11;
    if (d < 1 || d > 9) return false;
    const h = (g+2) - 7; 
    if (h < 1 || h > 9) return false;
    const j = (i+4) - 6;
    if (j < 1 || j > 9) return false;
    let z = ((((a+6) * 26 + (b+12)) * 26) + (e+7))* 26 + (f+12); 
    const k = (z % 26) - 10;
    if (k < 1 || k > 9) return false;
    z = (z - (z % 26)) / 26;
    const l = (z % 26) - 15;
    if (l < 1 || l > 9) return false;
    z = (z - (z % 26)) / 26;
    const m = (z % 26) - 9;
    if (m < 1 || m > 9) return false;
    z = (z - (z % 26)) / 26;
    const n = (z % 26);
    if (n < 1 || n > 9) return false;
    z = (z - (z % 26)) / 26;
    if (z === 0) return (
        (((((((((((a * 10 + b) * 10 + c) * 10 + d) * 10 + e) * 10 + f) * 10 + g) * 10 + h) * 10 + i) * 10 + j) * 10 + k) * 10 + l) * 10 + m) * 10 + n;
    return false;
}

const findFirst = desc => {
    if (desc) {
        for (let a = 9; a > 0; a--) {
            for (let b = 9; b > 0; b--) {
                for (let c = 9; c > 0; c--) {
                    for (let e = 9; e > 0; e--) {
                        for (let f = 9; f > 0; f--) {
                            for (let g = 9; g > 0; g--) {
                                for (let i = 9; i > 0; i--) {
                                    const number = isValid(a,b,c,e,f,g,i);
                                    if (number) {
                                        return number;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        for (let a = 1; a < 10; a++) {
            for (let b = 1; b < 10; b++) {
                for (let c = 1; c < 10; c++) {
                    for (let e = 1; e < 10; e++) {
                        for (let f = 1; f < 10; f++) {
                            for (let g = 1; g < 10; g++) {
                                for (let i = 1; i < 10; i++) {
                                    const number = isValid(a,b,c,e,f,g,i);
                                    if (number) {
                                        return number;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const process = () => {
    console.log(findFirst(true));
    console.log(findFirst(false));
}

process();
