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

module Seating =
    let getNextState (maxVisible: int) (adjacent: bool) (seats: string list) : string list =
        let lastRow = seats.Length - 1
        let lastCol = seats.[0].Length - 1
        let getOccupied (i: int) (j: int) (prevSeats: string list) : int =
            let mutable result = 0
            for (dx, dy) in [(-1,-1);(0,-1);(1,-1);(1,0);(1,1);(0,1);(-1,1);(-1,0)] do
                let mutable k = 1
                let mutable found = None
                while   i + (k * dy) >= 0 && i + (k * dy) <= lastRow &&
                        j + (k * dx) >= 0 && j + (k * dx) <= lastCol && found = None do
                    found <-
                        match prevSeats.[i + (k * dy)].[j + (k * dx)] with
                        | '#' -> Some 1
                        | 'L' -> Some 0
                        | _ -> if adjacent then Some 0 else None 
                    k <- k + 1
                result <- result + 
                    match found with
                    | Some v -> v
                    | None -> 0
            result
        let mutable newSeats = []
        for i = lastRow downto 0 do
            let mutable row = ""
            for j in [0..lastCol] do
                // printfn "%A" (i, j, seats.[i])
                let occupied = getOccupied i j seats
                row <- row + 
                    match seats.[i].[j] with
                    | '#' -> if occupied > maxVisible then "L" else "#"
                    | 'L' -> if occupied > 0 then "L" else "#"
                    | _ -> "."
            // printfn "%A" (i, seats.[i], row)
            newSeats <- row :: newSeats
        newSeats
    let getStableState (maxVisible: int) (adjacent: bool) (seats: string list) =
        let mutable prevSeats = seats // |> List.map (id)
        let mutable newSeats = []
        let mutable stable = false
        while not stable do
            newSeats <- getNextState maxVisible adjacent prevSeats
            // printfn "%A" newSeats
            stable <- newSeats = prevSeats
            prevSeats <- newSeats
        newSeats

    // let getNextStateOld (seats: string list) =
    //     let blankRow = String.init seats.[0].Length (fun i -> ".")
    //     (blankRow :: seats) @ [blankRow]
    //     |> List.windowed 3
    //     |> List.map (fun rows3 ->
    //         let mutable row = ""
    //         let lastCol = rows3.[1].Length - 1
    //         for i = 0 to lastCol do
    //             let neigbours = 
    //                 match i with
    //                 | 0 -> (rows3.[0].[0..1] + rows3.[1].[1..1] + rows3.[2].[0..1]).ToCharArray() 
    //                 | j when j = lastCol -> (rows3.[0].[(j-1)..j] + rows3.[1].[j-1..j-1] + rows3.[2].[(j-1)..j]).ToCharArray()
    //                 | _ -> (rows3.[0].[(i-1)..(i+1)] + rows3.[1].[i-1..i-1] + rows3.[1].[i+1..i+1] + rows3.[2].[(i-1)..(i+1)]).ToCharArray() 
    //                 |> List.ofArray
    //                 |> List.sumBy(fun c -> if c = '#' then 1 else 0) 
    //             row <- row +
    //                 match rows3.[1].[i] with
    //                 | 'L' -> if neigbours = 0 then "#" else "L"
    //                 | '#' -> if neigbours > 3 then "L" else "#"
    //                 | _ -> "."
    //         row        
    //     )
    // let getStableStateOld (seats: string list) =
    //     let mutable prevSeats = seats |> List.map (id)
    //     let mutable newSeats = []
    //     let mutable stable = false
    //     while not stable do
    //         newSeats <- getNextState prevSeats
    //         // printfn "%A" newSeats
    //         stable <- newSeats = prevSeats
    //         prevSeats <- newSeats
    //     newSeats

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n")
    |> List.ofArray

[<EntryPoint>]
let main argv =
    let seats = 
        fetchData()
    // printfn "%A" seats
    let stableSeats = seats |> Seating.getStableState 3 true
    // printfn "%A" stableSeats
    printfn "%A" (stableSeats |> List.sumBy (fun s -> s.ToCharArray() |> Array.sumBy (fun c -> if c = '#' then 1 else 0)))
    let stableSeats = seats |> Seating.getStableState 4 false
    printfn "%A" (stableSeats |> List.sumBy (fun s -> s.ToCharArray() |> Array.sumBy (fun c -> if c = '#' then 1 else 0)))

    0 // return an integer exit code
