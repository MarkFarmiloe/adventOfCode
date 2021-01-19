// Learn more about F# at http://fsharp.org

open System

type Instruction =
    {   Type: string
        Value: int
        Visited: bool
    }

let extractNumber (s: string) : int =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, _) -> failwith ("Bad Number: " + s)

module Adapter =
    let get1s2s3s (ratings: int []) : int =
        let mutable ones = if ratings.[0] = 1 then 1 else 0
        let mutable twos = if ratings.[0] = 2 then 1 else 0
        let mutable threes = if ratings.[0] = 3 then 2 else 1 // final step is from max to built-in adapter
        for i = 1 to ratings.Length - 1 do
            ones <- ones + if ratings.[i] - ratings.[i - 1] = 1 then 1 else 0
            twos <- twos + if ratings.[i] - ratings.[i - 1] = 2 then 1 else 0
            threes <- threes + if ratings.[i] - ratings.[i - 1] = 3 then 1 else 0
        // printfn "%A" (ones, twos, threes)
        ones * threes
    let getArrangements (ratings: int []) =
        let steps = 
            0 :: (ratings |> List.ofArray)
            |> List.pairwise
            |> List.map(fun (a, b) -> b - a) 
        let runs = 
            steps
            |> List.fold (fun (acc, curr) step ->
                match step with
                | 3 -> ((match curr with | [] -> acc | c -> c :: acc), [])
                | v -> (acc, v :: curr)
            ) ([], [])
            |>  function
                | (acc, []) -> acc
                | (acc, curr) -> curr :: acc
        // printfn "%A" (runs |> List.maxBy (fun run -> run.Length))
        runs
        |> List.fold (fun acc run ->
            acc * 
            match run.Length with
            | 1 -> 1L
            | 2 -> 2L
            | 3 -> 4L
            | 4 -> 7L
            | _ -> failwith "not handled"
        ) 1L

// let filePth = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n")

[<EntryPoint>]
let main argv =
    let ratings = 
        fetchData()
        |> Array.map extractNumber
        |> Array.sort
    // printfn "%A" ratings
    let onesXthrees = ratings |> Adapter.get1s2s3s
    printfn "%A" onesXthrees
    let arrangements = ratings |> Adapter.getArrangements
    printfn "%A" arrangements

    0 // return an integer exit code
