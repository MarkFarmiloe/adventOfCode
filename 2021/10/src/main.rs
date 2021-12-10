use std::collections::HashMap;
use std::fs;
// const errorScores = {')': 3, ']': 57, '}': 1197, '>': 25137};
// const completionScores = {'(': 1, '[': 2, '{': 3, '<': 4};
// const opening = {')': '(', ']': '[', '}': '{', '>': '<'};

fn get_score(line: &str) -> i64 {
    let opening_info = HashMap::from([('(', 1), ('[', 2), ('{', 3), ('<', 4)]);
    let closing_info: HashMap<char, (char, i64)> = HashMap::from([
        (')', ('(', 3)),
        (']', ('[', 57)),
        ('}', ('{', 1197)),
        ('>', ('<', 25137)),
    ]);
    
    let mut stack: Vec<char> = Vec::new();
    let mut result: i64 = 0;
    for c in line.chars() {
        match c {
            '(' | '[' | '{' | '<' => stack.push(c),
            ')' | ']' | '}' | '>' => {
                    let d = stack.pop().expect("Bad char");
                    if d != closing_info[&c].0 { result = closing_info[&c].1; }
                },
            x => println!("OOPS {}", x),
        };
        if result > 0 { break; }
    }
    if result == 0 {
        result = -stack.iter().rfold(0, |a, &c| a * 5 + opening_info[&c]);
    }
    result
}

fn main() {
    // let filename = "test.txt";
    let filename = "input.txt";
    
    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    
        let lines: Vec<&str> = contents.split('\n').map(|l| l.trim()).collect();
    let (error_score, mut completion_scores) = lines.iter().fold((0, Vec::new()),
        |(mut e, mut c), l| {
        let score = get_score(l);
        if score > 0 {
            e += score;
        } else {
            c.push(-score);
        }
        (e, c)
    });
    println!("{:#?}", error_score);
    completion_scores.sort();
    println!("{:#?}", completion_scores[(completion_scores.len() - 1) / 2]);
}
