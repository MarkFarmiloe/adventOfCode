// Learn more about F# at http://fsharp.org

open System

type Instruction =
    {   Type: string
        Value: int
        Visited: bool
    }

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, _) -> failwith ("Bad Number: " + s)

module Game =
    let getCode (line: string): Instruction =
        let parts =
            line.Trim().Split(" ")
            |> List.ofArray // list of content items number & type
            |> List.map(fun s -> s.Trim())
        { Type = parts.[0]; Value = extractNumber parts.[1]; Visited = false }
    let runTilLoop (codes: Instruction []) : int =
        let mutable answer = 0
        let mutable i = 0
        while not codes.[i].Visited do
            codes.[i] <- { codes.[i] with Visited = true }
            match codes.[i].Type with
            | "nop" ->  i <- i + 1
            | "acc" ->  answer <- answer + codes.[i].Value
                        i <- i + 1
            | "jmp" ->  i <- i + codes.[i].Value
            | s ->      failwith ("Bad code type:" + s)
        answer
    let runTilNoLoop (codes: Instruction []) : int =
        let mutable answer = 0
        let mutable i = 0
        let mutable j = -1
        let mutable testCodes = [||]
        while i < codes.Length && j < codes.Length do
            j <- j + 1
            testCodes <- Array.map(fun code -> { code with Visited = false }) codes
            answer <- 0
            i <- 0
            while i < codes.Length && not testCodes.[i].Visited do
                testCodes.[i] <- { testCodes.[i] with Visited = true }
                match testCodes.[i].Type with
                | "nop" ->  if j = i then i <- i + testCodes.[i].Value else i <- i + 1
                | "acc" ->  answer <- answer + testCodes.[i].Value
                            i <- i + 1
                | "jmp" ->  if j = i then i <- i + 1 else i <- i + testCodes.[i].Value
                | s ->      failwith ("Bad code type:" + s)
        answer

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
        |> Array.map Game.getCode
    let value = Game.runTilLoop codes
    printfn "%A" value
    let fixedValue = Game.runTilNoLoop codes
    printfn "%A" fixedValue

    0 // return an integer exit code
