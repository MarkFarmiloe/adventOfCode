// Learn more about F# at http://fsharp.org
open System

let extractDigits (s: string) =
    s
    |> fun s -> s.Trim()
    |> Seq.toList
    |> List.map(fun d -> 
        match d with
        | '0' -> 0
        | '1' -> 1
        | _ -> failwith ("Bad bit")
    )

let fetchData (filePath: string) =
    let file = new IO.StreamReader(filePath)
    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r')
    |> fun s -> s.Split("\n")
    |> List.ofArray
    |> List.map extractDigits 

let filePath = "input.txt"

let getMCD (lli: int list list, index: int): int =
    let length = List.length lli
    let count = 
        List.fold 
            (fun c (row: int list) -> c + row.Item(index)) 
            0 
            lli
    if 2 * count < length then 0 else 1

[<EntryPoint>]
let main argv =
    let diags = fetchData filePath
    let length = List.length diags
    let width = List.length (List.head diags)
    let counts = 
        List.fold 
            (fun c r -> List.map2 (+) c r) 
            (List.init width (fun _ -> 0)) 
            diags
    let (gamma, epsilon) = 
        List.fold
            (fun (g, e) c -> if 2 * c < length then (2 * g, 2 * e + 1) else (2 * g + 1, 2 * e))
            (0, 0)
            counts
    printfn "%A" (gamma, epsilon, gamma * epsilon)

    let firstG = if gamma > epsilon then 1 else 0
    let mutable o2 = List.filter (fun r -> (List.head r) = firstG) diags
    let mutable co2 = List.filter (fun r -> List.head r <> firstG) diags
    let mutable i = 1
    while (List.length o2 > 1) do
        let mcd = getMCD(o2, i)
        o2 <- List.filter (fun r -> r.Item(i) = mcd) o2
        i <- i + 1
    i <- 1
    while (List.length co2 > 1) do
        let mcd = getMCD(co2, i)
        co2 <- List.filter (fun r -> r.Item(i) <> mcd) co2
        i <- i + 1

    let o2v = List.fold (fun a b -> a * 2 + b) 0 (List.head o2)
    let co2v = List.fold (fun a b -> a * 2 + b) 0 (List.head co2)
    printfn "%A" (o2v, co2v, o2v * co2v)

    0 // return an integer exit code
