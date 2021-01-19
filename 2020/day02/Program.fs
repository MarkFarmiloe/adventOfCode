// Learn more about F# at http://fsharp.org

open System

type PasswordInfo =
    {   Min         : int
        Max         : int
        Char        : char
        Password    : string}

module Passwords =
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
    |> List.map lineToPasswordInfo

[<EntryPoint>]
let main argv =
    let data: PasswordInfo list = fetchData()
    let valids = data |> List.filter Passwords.validation
    printfn "%d" valids.Length
    let valids2 = data |> List.filter Passwords.validation2
    printfn "%d" valids2.Length
    0 // return an integer exit code
