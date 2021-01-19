// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

type Rule =
    | Str of s: string
    | SubRules of sr: int list list

// type Tree =
//     | Node of char * Tree * Tree
//     | Leaf of int

module Monster =
    let parseRuleLines (lines: string): Rule [] =
        lines.Split("\n")
        |> List.ofArray
        |> List.map(
            fun l ->
                l.Split(":")
                |> List.ofArray
                |>  function
                    | (a :: [b]) ->
                        let index = extractNumber a
                        let subRules =
                            b.Trim()
                            |> fun bt ->
                                match bt.[0] with
                                | '"' -> Str (bt.[1..(bt.Length - 1)]) 
                                | _ ->
                                    bt.Split("|")
                                    |> List.ofArray
                                    |> List.map(
                                        fun s ->
                                            s.Trim().Split(" ")
                                            |> List.ofArray
                                            |> List.map(
                                                fun s -> (extractNumber s)
                                            )
                                    )
                                    |> SubRules
                        (index, subRules)
                    | _ -> failwith "Expected two items"
        )
        |> List.sortBy ( fun (i, _) -> i )
        |> fun irs ->
            irs
            |> List.fold (fun a (i, r) -> a.[i] <- r; a ) (Array.zeroCreate (List.last irs |> function | (i, _) -> i + 1))

    let parseMessageLines (lines: string): string list =
        lines.Split("\n")
        |> List.ofArray
        |> List.map( fun l -> l.Trim() )

let fetchData (filePath: string): Rule [] * string list =
    let file = new IO.StreamReader(filePath)

    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r')
    |> fun s -> s.Split("\n\n")
    |> List.ofArray
    |>  function
        | (rs :: [ms]) -> ((Monster.parseRuleLines rs), (Monster.parseMessageLines ms))
        | _ -> failwith "Expected two items"


// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let (rules, messages) = fetchData filePath 
    printfn "%A" rules
    printfn "%A" rules.Length
    printfn "%A" rules.[100..(rules.Length - 1)]
    // let answers =
    //     tokenedLines |> List.map (Parser.evaluate false)

    // printfn "%A" (answers |> List.sum)

    // let answersAdv =
    //     tokenedLines |> List.map (Parser.evaluate true)

    // printfn "%A" (answersAdv |> List.sum)

    0 // return an integer exit code
