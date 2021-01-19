// Learn more about F# at http://fsharp.org

open System

type PasswordInfo =
    {   Min         : int
        Max         : int
        Char        : char
        Password    : string}

module Toboggan =
    let validation (info: PasswordInfo) =
        let count = 
            (info.Password.ToCharArray()
            |> List.ofArray
            |> List.filter(fun c -> c = info.Char)
            ).Length
        (count >= info.Min && count <= info.Max)
    let validation2 (info: PasswordInfo) =
        let first = info.Password.[info.Min - 1] = info.Char
        let second = info.Password.[info.Max - 1] = info.Char
        (first && not second) || (second && not first)

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, s) -> failwith "Bad Number: " + s

let lineToPasswordInfo (line: string) =
    let breaks = [line.IndexOf "-"; line.IndexOf " "; line.IndexOf ":"]
    let min = extractNumber line.[0..(breaks.[0]-1)]
    let max = extractNumber line.[(breaks.[0]+1)..(breaks.[1]-1)]
    let char = line.[(breaks.[1]+1)..(breaks.[2]-1)].Trim().[0]
    let password = line.[(breaks.[2]+1)..].Trim()
    { Min = min; Max = max; Char = char; Password = password }

// let filePath = "test.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    file.ReadToEnd().Split("\n")
    |> List.ofArray 
    |> List.map (fun l -> l.Trim())

let tracePath (data: string list) right down =
    let mutable x = 0
    let mutable y = 0
    let mutable count = 0
    for l in data do
        if y % down = 0 then
            count <- count + (if l.[x] = '#' then 1 else 0)
            x <- (x + right) % l.Length
        y <- y + 1
    count

[<EntryPoint>]
let main argv =
    let data = fetchData()
    // printfn "%A" data
    let treesHit = tracePath data 3 1
    printfn "%A" treesHit
    let hitCounts =
        [ for moves in [ [1;1];[3;1];[5;1];[7;1];[1;2] ] do
            yield tracePath data moves.[0] moves.[1] ]
    // printfn "%A" hitCounts
    let answer = List.fold (fun acc h -> acc * (h |> int64)) (1 |> int64) hitCounts
    printfn "%d" answer

    0 // return an integer exit code
