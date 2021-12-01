// Learn more about F# at http://fsharp.org
open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

let fetchData (filePath: string) =
    let file = new IO.StreamReader(filePath)
    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r')
    |> fun s -> s.Split("\n")
    |> List.ofArray
    |> List.map extractNumber 

let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let depths = fetchData filePath
    let (count, _) = List.fold (fun (c, p) v -> if v > p then (c + 1, v) else (c, v) ) (-1, -1) depths 
    printfn "%A" count
    let (count2, _, _, _) = 
        List.fold (fun (c, p1, p2, p3) v -> 
            if v > p1 then (c + 1, p2, p3, v) else (c, p2, p3, v) 
        ) (-3, -1, -1, -1) depths 
    printfn "%A" count2

    0 // return an integer exit code
