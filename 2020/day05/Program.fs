// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, s) -> failwith "Bad Number: " + s

module Seats =
    let getSeatNo (info: string) =
        info.ToCharArray()
        |> List.ofArray
        |> List.fold (fun acc c -> acc * 2 + if c = 'B' || c = 'R' then 1 else 0) 0

// let filePath = "test.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n")
    |> List.ofArray
    |> List.map (fun l -> l.Trim())

[<EntryPoint>]
let main argv =
    let data = fetchData()
    // printfn "%A" data
    let seats =
        data
        |> List.map Seats.getSeatNo
        |> List.sort 
    printfn "%A" (List.max seats)
    // printfn "%A" seats
    let mySeat =
        (seats
        |> List.fold 
            (fun (acc: int list) n ->
                match acc.[0] with 
                | 0 -> [n; 0] 
                | v when v = n - 2 -> [-1; n - 1] 
                | _ -> [n; acc.[1]])
            [0; 0]).[1]

    printfn "%A" (mySeat)

    0 // return an integer exit code
