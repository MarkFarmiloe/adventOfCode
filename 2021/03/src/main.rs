use std::fs;

fn get_data() -> Vec<Vec<usize>> {
    // let filename = "test.txt";
    let filename = "input.txt";

    let contents = fs::read_to_string(filename).expect("failed to read file contents");
    contents
        .trim()
        .split('\n')
        .map(|s| s.trim().chars().map(|c| match c { '0' => 0, _ => 1, }).collect())
        .collect()
}

fn get_mcbs(diags: &Vec<Vec<usize>>) -> Vec<usize> {
    diags.iter().fold(
        vec!(0; diags[0].len()),
        |mut a, bits| {
            for i in 0..bits.len() {
                a[i] += bits[i];
            }
            a
        }
    ).iter()
    .map(|b| if b * 2 < diags.len() {0} else {1})
    .collect()
}

fn get_mcb(diags: &Vec<&Vec<usize>>, bit_pos: usize) -> usize {
    let count = diags.iter().fold(
        0,
        |a, bits| {
            a + bits[bit_pos]
        }
    );
    if 2 * count < diags.len() 
        {0} 
    else 
        {1}
}

fn get_base_10(bits: &Vec<usize>, invert: bool) -> usize {
    bits.iter().fold(
        0,
        |a, b| a * 2 + if invert {1 - b} else {*b}
    )
}

fn main() {
    let diags = get_data();
    let mcbs = get_mcbs(&diags);
    let (g, e) = (get_base_10(&mcbs, false), get_base_10(&mcbs, true));
    println!("{:#?}", g * e);
    let len = diags[0].len();
    let mut ogrv: Vec<_> = diags.iter().map(|x| x).collect();
    let mut ogr: usize = 0;
    for i in 0..len {
        let mcb = get_mcb(&ogrv, i);
        ogrv = ogrv.iter().filter(|&bits| bits[i] == mcb).map(|&x| x).collect();
        if ogrv.len() == 1 { 
            ogr = get_base_10(&ogrv[0], false);
            break; 
        }
    }
    let mut csrv: Vec<_> = diags.iter().map(|x| x).collect();
    let mut csr: usize = 0;
    for i in 0..len {
        let mcb = get_mcb(&csrv, i);
        csrv = csrv.iter().filter(|&bits| bits[i] != mcb).map(|&x| x).collect();
        if csrv.len() == 1 { 
            csr = get_base_10(&csrv[0], false);
            break; 
        }
    }
    println!("{:#?}", ogr * csr);
}
