// Learn more about F# at http://fsharp.org

open System

type Instruction =
    {   Type: string
        Value: int
        Visited: bool
    }

let extractNumber (s: string) : Int64 =
    match s |> Int64.TryParse with 
    | (true, num) -> num 
    | (false, _) -> failwith ("Bad Number: " + s)

module Port =
    let checkValid (index: int) (preamble: int) (numbers: Int64 []) : bool =
        let target = numbers.[index]
        let mutable result = false
        for i = index - preamble to index - 2 do
            for j = i + 1 to index - 1 do
                result <- result || numbers.[i] + numbers.[j] = target
        result
    let getFailure (preamble: int) (codes: Int64 []) : Int64 =
        let mutable result : Int64 = -1L
        for i = preamble to codes.Length - 1 do
            result <- if result = -1L && not (checkValid i preamble codes) then codes.[i] else result
        result
    let getWeakness (target: Int64) (preamble: int) (codes: Int64 []) : Int64 =
        let mutable res = None
        let mutable i = 0
        while (Option.isNone res && i < codes.Length) do
            let mutable j = i
            let mutable total = 0L
            while (total < target && j < codes.Length) do
                total <- total + codes.[j]
                j <- j + 1
            res <- if total = target then Some (i, j - 1) else None
            i <- i + 1 
        match res with
        | Some (i, j) -> Array.min codes.[i..j] + Array.max codes.[i..j]
        | None -> -1L


// let filePath = "test.txt"
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
    let codes = 
        fetchData()
        |> Array.map extractNumber
    // printfn "%A" codes
    let failedAt = codes |> Port.getFailure 25
    printfn "%A" failedAt
    let weakness = codes |> Port.getWeakness failedAt 25 
    printfn "%A" weakness

    0 // return an integer exit code
