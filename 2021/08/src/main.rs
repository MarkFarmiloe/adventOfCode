use std::collections::HashMap;
use std::fs;

fn slice_contents(line: &str) -> (Vec<&str>, Vec<&str>) {
    let x: Vec<&str> = line.trim().split(" | ").collect(); 
    let ins: Vec<&str> = x[0].split(' ').collect();
    let outs: Vec<&str> = x[1].split(' ').collect();
    (ins, outs)
} 

fn unique(a: &str, b: &str) -> String {
    a.chars().filter(|c| !b.contains(*c)).collect()
}

fn both(a: &str, b: &str) -> String {
    a.chars().filter(|c| b.contains(*c)).collect()
}

fn decode_ins(ins: Vec<&str>) {
    let ins2 = ins.sort_by(|a, b|
        match a.len() {
            < b.len() -> 
        }

        a.len().cmp(b.len()));
    let mut wires = HashMap::new();
    wires.insert(String::from("a"), unique(ins[1], ins[0]));
    // wires.insert(String::from("cf"), ins[0]);
    // wires.insert(String::from("bd"), unique(ins[2], ins[0]));
    // wires.insert(String::from("abfg"), both(ins[6], both(ins[7], ins[8])));
    // println!("{:#?", wires);
    // wires.insert(String::from("cde"), unique(ins[9], wires.get(&String::from("abfg"))));
    // // [String.from("oops")]
}

fn main() {
    let filename = "test.txt";
    // let filename = "input.txt";
    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    let lines: Vec<&str> = contents 
        .trim()
        .split('\n')
        .collect();

    let displays: Vec<(Vec<&str>, Vec<&str>)> = lines.iter().map(|l| slice_contents(l)).collect();
    // println!("{:#?}", displays);

    let count = displays.iter().fold(0, |a, display| 
        a + (*display).1.iter().fold(0, |b, out| b + if [2,3,4,7].contains(&out.len()) {1} else {0})
    );
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
    let display = displays[0];
    println!("{:#?}", decode_ins(display.0));
    let count2 = displays.fold(0, |a, (ins, outs)| {
        let digits = decode_ins(ins);
        let number = outs.fold(0, |a, out| {
            a * 10 + digits
        });
        a + number
    });
    println!("{:#?}", count2);
}
