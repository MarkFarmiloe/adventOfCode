use std::fs;

#[derive(Debug)]
enum Direction {
    Forward(u32),
    Down(u32),
    Up(u32),
}

fn get_data() -> Vec<Direction> {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename).expect("failed to read file contents");
    contents
        .trim()
        .split('\n')
        .map(|s| s.trim())
        .map(|l| {
            let parts: Vec<&str> = l.trim().split(' ').collect();
            let value = parts[1].parse().expect("Not a number");
            match parts[0] {
                "forward" => Direction::Forward(value),
                "down" => Direction::Down(value),
                "up" => Direction::Up(value),
                _ => Direction::Up(0)
            }
        }).collect()
}

fn main() {
    let directions = get_data();
//    println!("{:#?}", directions);
    let (x, y) = directions.iter().fold(
        (0, 0), 
        |(x, y), d| match d {
            Direction::Forward(v) => (x + v, y), 
            Direction::Down(v) => (x, y + v), 
            Direction::Up(v) => (x, y - v)
        } 
    );
    println!("{:#?}", x * y);
    let (x, y, _) = directions.iter().fold(
        (0, 0, 0), 
        |(x, y, a), d| match d {
            Direction::Forward(v) => (x + v, y + (a * v), a), 
            Direction::Down(v) => (x, y, a + v), 
            Direction::Up(v) => (x, y, a - v)
        } 
    );
    println!("{:#?}", x * y);
}
