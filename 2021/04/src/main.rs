use std::fs;

#[derive(Debug)]
struct Board {
    board: [[u32; 5]; 5],
}

impl Board {
    fn new(lines: &[&str]) -> Board {
        Board {
            board: [[0u32; 5]; 5],
        }
    }
}

fn get_data() -> (Vec<u32>, Vec<Board>) {
    let filename = "test.txt";
    // let filename = "input.txt";

    let contents = fs::read_to_string(filename).expect("failed to read file contents");
    let lines: Vec<&str> = contents
        .trim()
        .split('\n')
        .map(|s| s)
        .collect();
    let draws: Vec<u32> = lines[0].split(',').map(|s| s.trim().parse().expect("bad number")).collect();
    let i = 2;
    let mut boards: Vec<Board> = Vec::new();
    while i < lines.len() {
        boards.push(Board::new(&lines[i..i+5]));
    }
    // let boards = lines[1..].iter().enumerate().fold(vec![],
    //     |mut a, (i, l)| {
    //         let index = i % 6;
    //         if index == 0 {
    //             a
    //         } else {
    //             let row = get_board_row(l);
    //             if index == 1 {
    //                 let mut board = [[0; 5]; 5];
    //                 board[0] = row;
    //                 a.push(board);
    //                 a
    //             } else {
    //                 let mut board = a.pop().expect("missing board");
    //                 board[index - 1] = row;
    //                 a.push(board);
    //                 a
    //             }
    //         }
    //     });
    (draws, boards)
}

fn run_bingo(draws: &Vec<i32>, init_boards: &Vec<[[i32; 5]; 5]>, loser: bool) -> (u32, [[i32; 5]; 5]) {
    let mut boards: Vec<[[i32; 5]; 5]> = 
        init_boards.clone();
    println!("{:#?}", boards);
    for draw in draws {
        boards = boards.iter().map(|&board| {
            for i in 0..5 {
                for j in 0..5 {
                    if board[i][j] == *draw { board[i][j] = -1 - board[i][j]; }
                }
            }
            &board
        }).collect();
    }
    
    (0, [[0; 5]; 5])
}

// const runBingo = (draws, boards, loser) => {
//     for (let i = 0; i < draws.length; i++) {
//         const ball = draws[i];
//         boards = boards.map(board => {
//             return board.map(row => {
//                 return row.map(n => n === ball ? -1 - n : n)
//             })
//         });
//         if (loser) {
//             if (boards.length > 1) boards = boards.filter(board => !isWinner(board));
//             else if (boards.length === 1 && isWinner(boards[0])) return [ball, boards[0]];
//         } else {
//             for (let j = 0; j < boards.length; j++) {
//                 const board = boards[j];
//                 if (isWinner(board)) return [ball, board];
//             }
//         }
//     }
//     return [0, []];
// };

fn get_board_row(l: &str) -> [u32; 5] {
    [
        l[..2].trim().parse().expect("Bad number"),
        l[3..5].trim().parse().expect("Bad number"),
        l[6..8].trim().parse().expect("Bad number"),
        l[9..11].trim().parse().expect("Bad number"),
        l[12..].trim().parse().expect("Bad number"),
    ]
}

fn main() {
    let (draws, boards) = get_data();
    println!("{:#?}", draws);
    println!("{:#?}", boards);
}
