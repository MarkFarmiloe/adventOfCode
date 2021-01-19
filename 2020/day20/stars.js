'use strict';
const fs = require("fs");

const parseTileBlock = (tb) => {
    const lines = tb.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const first = lines.shift().trim();
    const id = Number.parseInt(first.slice(first.indexOf(' ') + 1, first.indexOf(':')).trim());
    const tile = lines.reduce((a, l, i) => {
        a[i] = l; 
        return a; 
    }, []);
    return { id: id, tile: tile, matches: [] };
}

const side = (t, edge) => {
    const maxIdx = t.length - 1; 
    let s = '';
    switch (edge) {
        case 0:
            return t[0];
        case 1:
            s = '';
            for (let i = 0; i < t.length; i++) {
                s += t[i][maxIdx];
            }
            return s;
        case 2:
            return reverse(t[maxIdx]);
        case 3:
            s = '';
            for (let i = maxIdx; i >= 0; i--) {
                s += t[i][0];
            }
            return s;
        default:
            console.log('OOPS');
            break;
    }
}

const reverse = (s) => {
    let r = '';
    for (let i = s.length - 1; i >= 0; i--) {
        r += s[i];       
    }
    return r;
}

const findMatchesForTiles = (a, b) => {
    const aTile = a.tile;
    const bTile = b.tile;
    for (let i = 0; i < 4; i++) {
        const aSide = side(aTile, i);
        for (let j = 0; j < 4; j++) {
            const bSide = side(bTile, j);
            if (aSide === bSide ||  aSide === reverse(bSide)) {
                a.matches.push({ side: i, matches: b.id });
                b.matches.push({ side: j, matches: a.id });
            }
        }
    }
}

const findMatches = (tiles) => {
    for (let i = 0; i < tiles.length; i++) {
        const a = tiles[i];
        for (let j = i + 1; j < tiles.length; j++) {
            const b = tiles[j];
            findMatchesForTiles(a, b);
        }
    }
    return tiles;
}

const reoriented = (t, rotate, flipped) => {
    const newT = {...t };
    newT.tile = flipAndRotate(t.tile, flipped, rotate);
    newT.matches = newT.matches.map(m => { 
        let newSide = (flipped && m.side % 2 === 0) ? 2 - m.side : m.side;
        newSide = (newSide + rotate) % 4;
        return { ...m, side: newSide } 
    });
    return newT;
}

const orient = (tile, aboveId, leftId) => {
    const aboveMatch = aboveId ? tile.matches.find(m => m.matches === aboveId) : null;
    const leftMatch = leftId ? tile.matches.find(m => m.matches === leftId) : null;
    let rotate = 0;
    let flipped = false;
    if (aboveMatch) {
        if (leftMatch) {
            flipped = (4 + leftMatch.side - aboveMatch.side) % 4 !== 3;
            rotate = (aboveMatch.side % 2 === 1 ? 4 - aboveMatch.side : (leftMatch.side === 1 ? 2 : 0));
        } else { // left col
            const adjSide = tile.matches.find(m => (m.side + aboveMatch.side) % 2).side;
            flipped = (4 + adjSide - aboveMatch.side) % 4 !== 1;
            rotate = (aboveMatch.side % 2 === 1 ? 4 - aboveMatch.side : (adjSide === 3 ? 2 : 0));
        }
    } else { // top row
        if (leftMatch) {
            const adjSide = tile.matches.find(m => (m.side + leftMatch.side) % 2).side;
            flipped = (4 + leftMatch.side - adjSide) % 4 !== 1;
            rotate = (adjSide % 2 === 1 ? adjSide : (leftMatch.side === 1 ? 2 : 0));
        } else { // top-left corner
            const [l, t] = tile.matches;
            flipped = (4 + l.side - t.side) % 4 !== 3;
            rotate = (t.side % 2 === 1 ? t.side : (l.side === 3 ? 2 : 0));
        }
    }
    return [rotate, flipped];
}

const nextTile = (above, left, tiles) => {
    let tile;
    let rotate = 0;
    let flipped = false;
    const aboveId = above ? above.id : 0;
    const leftId = left ? left.id : 0;
    if (left) {
        tile = tiles.find(t => t.id === left.matches.find(m => m.side === 1).matches);
    } else if (above) {
        tile = tiles.find(t => t.id === above.matches.find(m => m.side === 2).matches);
    } else {
        tile = tiles.filter(t => t.matches.length === 2)[0]; // use first corner tile
    }
    [rotate, flipped] = orient(tile, aboveId, leftId);
    const newTile = reoriented(tile, rotate, flipped);
    return newTile;
}

const buildPatternMatrix = (tiles) => {
    const tilesPerSide = Math.sqrt(tiles.length);
    const matrix = [];
    for (let i = 0; i < tilesPerSide; i++) {
        matrix[i] = [];
        for (let j = 0; j < tilesPerSide; j++) {
            const above = (i === 0) ? null : matrix[i - 1][j];
            const left = (j === 0) ? null : matrix[i][j - 1];
            matrix[i][j] = nextTile(above, left, tiles);
        }
    }
    return matrix;
}

const flipAndRotate = (item, flip, rotate) => {
    let flipped = [];
    if (flip) {
        for (let i = 0; i < item.length; i++) {
            flipped[i] = item[item.length - i - 1];
        }
    } else {
        flipped = [...item];
    }
    switch (rotate) {
        case 0:
            return flipped;
        case 1:
            const rot1 = [];
            for (let i = 0; i < flipped[0].length; i++) {
                let s = '';
                for (let j = 0; j < flipped.length; j++) {
                    s += flipped[flipped.length - j - 1][i];
                }
                rot1[i] = s;
            }
            return rot1;
        case 2:           
            const rot2 = [];
            for (let i = 0; i < flipped.length; i++) {
                rot2[i] = reverse(flipped[flipped.length - i - 1]);
            }
            return rot2;
        case 3:
            const rot3 = [];
            for (let i = 0; i < flipped[0].length; i++) {
                let s = '';
                for (let j = 0; j < flipped.length; j++) {
                    s += flipped[j][flipped[0].length - i - 1];
                }
                rot3[i] = s;
            }
            return rot3;
    }
} 

const markPattern = (pattern, monster) => {
    for (let i = 0; i < 8; i++) {
        const rotate = i % 4;
        const flip = i > rotate;
        const m = flipAndRotate(monster, flip, rotate);
        for (let r = 0; r < pattern.length - m.length + 1; r++) {
            for (let c = 0; c < pattern.length - m[0].length + 1; c++) {
                let found = true;
                for (let mr = 0; mr < m.length && found; mr++) {
                    for (let mc = 0; mc < m[0].length; mc++) {
                        const mBit = m[mr][mc];
                        if (mBit === '#' && pattern[r + mr][c + mc] === '.') {
                            found = false;
                            break;
                        }
                    }
                }
                if (found) {
                    for (let mr = 0; mr < m.length; mr++) {
                        for (let mc = 0; mc < m[0].length; mc++) {
                            const mBit = m[mr][mc];
                            if (mBit === '#') {
                                const str = pattern[r + mr];
                                pattern[r + mr] = str.slice(0, c + mc) + 'O' + str.slice(c+ mc + 1);
                            }
                        }
                    }
                }
            }
        }
    }
    return pattern;
}

const process = (err, data) => {
    if (err) throw err;
    const tileBlocks = data.replace(/\r/g, '').split("\n\n");
    const tiles = tileBlocks.map(parseTileBlock, []);
    const tilesWithMatches = findMatches(tiles);
    const corners = tilesWithMatches.filter(t => t.matches.length === 2);
    console.log(corners.reduce((a,t) => a *= t.id, 1));

    const patternMatrix = buildPatternMatrix(tilesWithMatches);
    const patternGrid = patternMatrix.map(
        r => r.map(
            c => c.tile.reduce(
                (a, r, i) => {
                    if (i > 0 && i < r.length - 1) a.push(r.slice(1, r.length - 1));
                    return a;
            },[])
        ) 
    );
    const pattern = [];
    patternGrid.forEach((r, i) => {
        for (let j = 0; j < 8; j++) {
            pattern[i * 8 + j] = '';
        }
        r.forEach(c => {
            for (let k = 0; k < 8; k++) {
                pattern[i * 8 + k] += c[k];
            }
        });
    });
    const monster = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   '
    ];
    const markedPattern = markPattern(pattern, monster);
    console.log(markedPattern);
    console.log(markedPattern.reduce((a, l) => {
        for (let i = 0; i < l.length; i++) {
            a += l[i] == '#';
        }
        return a;
    }, 0));
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
