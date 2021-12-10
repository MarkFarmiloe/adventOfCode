// use std::collections::HashMap;
use std::fs;

fn extract_in_out(line: &str) -> (Vec<&str>, Vec<&str>) {
    let parts: Vec<&str> = line.split(" | ").collect();
    let ins = parts[0].split(' ').collect();
    let outs = parts[1].split(' ').collect();
    (ins, outs)
}

// const unique = (a, b) => a.split('').filter(c => !b.includes(c)).join('');
fn unique(a: &str, b: &str) -> String { a.chars().filter(|c| !b.contains(c)).join() }
// const both = (a, b) => a.split('').filter(c => b.includes(c)).join('');


fn decode_ins(ins: Vec<&str>) -> Vec<Vec<String>> {
    vec![vec![" ", " "]]
}

fn main() {
    // let filename = "test.txt";
    let filename = "input.txt";
    
    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    
    let lines: Vec<&str> = contents.split('\n').map(|l| l.trim()).collect();
    let displays: Vec<(Vec<&str>, Vec<&str>)> = lines.iter().map(|l| extract_in_out(l)).collect();
    // println!("{:#?}", displays);
    let count = displays.iter().fold(0, |a, (_, outs)| {
        a + outs.iter().fold(0, |b, &s| {
            b + if [2,4,3,7].contains(&s.len()) {1} else {0}
        })
    });
    println!("{:#?}", count);
    // const count2 = lines.reduce((a, [ins, outs]) => {
    //     const digits = decodeIns(ins);
    //     // console.log(digits);
    //     // console.log(outs);
    //     const number = outs.reduce((a, out) => {
    //         return a * 10 + digits.findIndex(d => d === out.split('').sort().join(''));
    //     }, 0);
    //     // console.log(number);
    //     return a + number;
    // }, 0);
    let count2 = displays.fold(0, |a, (ins, outs)| {
        let digits = decode_ins(ins);
        let number = outs.fold(0, |a, out| {
            a * 10 + digits
        });
        a + number
    });
    println!("{:#?}", count2);
}
