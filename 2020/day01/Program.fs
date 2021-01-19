// Learn more about F# at http://fsharp.org

open System

module Expenses =
    let twoTotalling2020 (numbers: int array) =
        numbers
        |> Array.filter(
            fun n -> 
                (numbers 
                    |> Array.filter(fun m -> m + n = 2020)
                ).Length > 0
        )
    let threeTotalling2020 (numbers: int array) =
        numbers
        |> Array.filter(
            fun n -> 
                (numbers 
                |> Array.filter(
                    fun m -> 
                        (numbers
                        |> Array.filter(fun l -> l + m + n = 2020)
                        ).Length > 0
                ) 
                ).Length > 0 
        )

// let filePath = "test.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    file.ReadToEnd().Split("\n") 
    |> Array.map Int32.TryParse 
    |> Array.filter(function 
        | (b, _) -> b
    ) 
    |> Array.map (function
        | (_, num) -> num
    )

[<EntryPoint>]
let main argv =
    let data = fetchData()

    let answers = Expenses.twoTotalling2020 data
    printfn $"%d{answers.[0]} %d{answers.[1]}"
    printfn $"%d{answers.[0] * answers.[1]}"
    let answers2 = Expenses.threeTotalling2020 data
    printfn $"%d{answers2.[0]} %d{answers2.[1]} %d{answers2.[2]}"
    printfn $"%d{answers2.[0] * answers2.[1] * answers2.[2]}"
    0 // return an integer exit code
