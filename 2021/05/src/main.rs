use std::collections::HashMap;
use std::fs;

#[derive(Debug)]
struct Vent {
    start_x: i32,
    start_y: i32,
    end_x: i32,
    end_y: i32,    
}

impl Vent {
    fn new(line: &str) -> Vent {
        let v:Vec<i32> = 
            line
            .trim()
            .split(&[',', ' ', '-', '>'][..])
            .filter(|s| s != &"")
            .map(|s| s.parse().expect("Not a number"))
            .collect();
        Vent {
            start_x: v[0],
            start_y: v[1],
            end_x: v[2],
            end_y: v[3],    
        }
    }
}

fn get_data() -> Vec<Vent> {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    let lines = contents.split(&['\r', '\n'][..]).filter(|s| s != &"");
    lines.map(|s| Vent::new(s)).collect()
}

fn main() {
    let vents = get_data();
    let mut grid: HashMap<(i32, i32), i32> = HashMap::new();
    for vent in &vents {
        if vent.start_x == vent.end_x {
            let (s, e) = if vent.start_y < vent.end_y {(vent.start_y, 1 + vent.end_y)} else {(vent.end_y, 1 + vent.start_y)};
            for y in s .. e {
                let count = grid.entry((vent.start_x, y)).or_insert(0);
                *count += 1;
            }
        }
        else if vent.start_y == vent.end_y {
            let (s, e) = if vent.start_x < vent.end_x {(vent.start_x, 1 + vent.end_x)} else {(vent.end_x, 1 + vent.start_x)};
            for x in s .. e {
                let count = grid.entry((x, vent.start_y)).or_insert(0);
                *count += 1;
            }
        }
    }
    let danger = grid.values().fold(
        0,
        |c, v| c + if 1 < *v {1} else {0}
    );
    println!("{:#?}", danger);
    for vent in vents.iter().filter(|v| v.start_x != v.end_x && v.start_y != v.end_y) {
        let x_inc = if vent.start_x < vent.end_x {1} else {-1};
        let y_inc = if vent.start_y < vent.end_y {1} else {-1};
        let mut x = vent.start_x;
        let mut y = vent.start_y;
        loop {
            let count = grid.entry((x, y)).or_insert(0);
            *count += 1;
            if x == vent.end_x { break; };
            x += x_inc;
            y += y_inc;
        }
    }
    let danger = grid.values().fold(
        0,
        |c, v| c + if 1 < *v {1} else {0}
    );
    println!("{:#?}", danger);
}
