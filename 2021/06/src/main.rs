use std::fs;

fn get_data() -> Vec<usize> {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename)
        .expect("failed to read file contents");
    return contents.trim().split(',').map(|s| s.parse::<usize>().expect("Not a number"))
        .fold(vec![0; 9], |mut f, n| {
            f[n] += 1;
            f
        }
    )
}

fn age(mut fish: Vec<usize>) -> Vec<usize> {
    let new_fish = fish[0];
    for i in 0..8 {
        fish[i] = fish[i + 1];
    }
    fish[8] = new_fish;
    fish[6] += new_fish;
    fish
}

fn main() {
    let mut fish = get_data();
    for _ in 0..80 {
        fish = age(fish);
    }
    println!("{:#?}", fish.iter().fold(0, |a, v| a + v));
    for _ in 80..256 {
        fish = age(fish);
    }
    println!("{:#?}", fish.iter().fold(0, |a, v| a + v));
}
