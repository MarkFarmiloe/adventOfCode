use std::fs;

fn get_data() -> (usize, Vec<u32>) {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    let raw_positions: Vec<u32> = 
        contents
        .trim().split(',')
        .map(|s| s.parse().expect("Not a number"))
        .collect();
    let max = 1 + raw_positions.iter()
        .fold(0usize, |max, p| if max > (*p as usize) {max} else {*p as usize});
    ( raw_positions.len(),
        raw_positions
        .iter()
        .fold(vec![0; max], 
            |mut p, n| {
                p[*n as usize] += 1;
                p
            }
        )
    )
}

fn sum_to(n: usize) -> u32 {
    (n * (n + 1) / 2) as u32
}

fn main() {
    let (len, positions) = get_data();
    let (_, pivot) = positions.iter().enumerate()
        .fold((0u32, 0u32), |(s, v), (i, pc)| 
            if s * 2 < len as u32 {(pc + s as u32, i as u32)} else {(s, v)});
    let fuel = positions.iter().enumerate()
        .fold(0, |a, (i, p)| a + p * (if pivot > i as u32 {pivot - i as u32} else {i as u32 - pivot}));
    println!("{:#?}", fuel);    

    let mut min_fuel = 999999999u32;
    for i in 0..positions.len() {
        let fuel = positions.iter().enumerate()
            .fold(0, |a, (j, pc)| a + pc * sum_to(if i > j {i - j} else {j - i}));
        if min_fuel > fuel {min_fuel = fuel};
    }
    println!("{:#?}", min_fuel);    
}
