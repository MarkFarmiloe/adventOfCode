use std::fs;

fn get_data() -> Vec<i32> {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    contents.trim().split('\n').map(|s| s.trim().parse().expect("Not a number")).collect()
}

fn main() {
    let depths = get_data();
    let (increases, _) = depths.iter().fold((0, &999999), |(a, p), d| if d > p {(a + 1, d)} else {(a, d)});
    println!("{:#?}", increases);
    let (increases, _, _, _) = depths.iter()
        .fold(
            (0, &999999, &999999, &999999), 
            |(a, p1, p2, p3), d| (if d > p1 {a + 1} else {a}, p2, p3, d)
        );
    println!("{:#?}", increases);
}
