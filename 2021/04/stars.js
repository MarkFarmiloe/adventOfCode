'use strict';
const fs = require("fs");

const getData = (data) => {
    const lines = data.trim().split('\n');
    // console.log(lines);
    return lines.reduce(
        ([draws, boards], l, i) => {
            if (i === 0) {
                return [l.trim().split(',').map(d => Number.parseInt(d)), []];
            }
            switch (i % 6) {
                case 1:
                    return [draws, boards];
                case 2:
                    const board = [getBoardRow(l)];
                    boards.push(board);
                    return [draws, boards];
                case 3:
                case 4:
                case 5:
                case 0:
                    boards[boards.length - 1].push(getBoardRow(l));
                    return [draws, boards];
            }
            return [draws, boards];
        }, 
        [[], []]
    );
};

const getBoardRow = l => {
    return [
        Number.parseInt(l.slice(0, 2).trim()),
        Number.parseInt(l.slice(3, 5).trim()),
        Number.parseInt(l.slice(6, 8).trim()),
        Number.parseInt(l.slice(9, 11).trim()),
        Number.parseInt(l.slice(12, 14).trim())
    ];
}

const runBingo = (draws, boards, loser) => {
    for (let i = 0; i < draws.length; i++) {
        const ball = draws[i];
        boards = boards.map(board => {
            return board.map(row => {
                return row.map(n => n === ball ? -1 - n : n)
            })
        });
        if (loser) {
            if (boards.length > 1) boards = boards.filter(board => !isWinner(board));
            else if (boards.length === 1 && isWinner(boards[0])) return [ball, boards[0]];
        } else {
            for (let j = 0; j < boards.length; j++) {
                const board = boards[j];
                if (isWinner(board)) return [ball, board];
            }
        }
    }
    return [0, []];
};

const isWinner = board => {
    const cols = [1, 1, 1, 1, 1];
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        let winner = 1;
        for (let j = 0; j < row.length; j++) {
            const n = row[j];
            if (n >= 0) {
                winner = 0;
                cols[j] = 0;
            }
        }
        if (winner === 1) return true;
    }
    for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        if (col === 1) return true;
    }
    return false;
}

const winningScore = (ball, board) => {
    const boardValue = board.reduce(
        (acc, row) => {
            return acc + row.reduce(
                (acc2, n) => acc2 + (n > 0 ? n : 0),
                0
            );
        },
        0
    );
    return ball * boardValue;
};

const process = (err, data) => {
    if (err) throw err;
    const [draws, boards] = getData(data);
    const [ball, board] = runBingo(draws, boards, 0);
    console.log(winningScore(ball, board)); 
    const [ball1, board1] = runBingo(draws, boards, 1);
    console.log(winningScore(ball1, board1)); 
}

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
