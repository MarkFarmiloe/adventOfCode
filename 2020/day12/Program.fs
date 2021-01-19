// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string) : int =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, _) -> failwith ("Bad Number: " + s)

module Navigation =
    let getManhattan (moves: (char*int) list) : int =
        let navShip ((code, amount): char*int) ((e, n, dir): int*int*int) : (int*int*int) =
            let newPos = 
                match code with
                | 'N' -> (e, n + amount)
                | 'S' -> (e, n - amount)
                | 'E' -> (e + amount, n)
                | 'W' -> (e - amount, n)
                | 'F' -> 
                    match dir with
                    | 0 -> (e + amount, n)
                    | 1 -> (e, n - amount)
                    | 2 -> (e - amount, n)
                    | _ -> (e, n + amount)
                | _ -> (e, n)
            let newDir =
                match code with
                | 'L' -> (4 + dir - (amount / 90)) % 4
                | 'R' -> (4 + dir + (amount / 90)) % 4
                | _ -> dir
            match newPos with
            | (e, n) -> (e, n, newDir)
        moves
        |> List.fold(
            fun pos move ->
                navShip move pos
        ) (0, 0, 0)
        |>  function
            | (a, b, _) -> abs a + abs b

    let getManhattan2 (moves: (char*int) list) : int =
        let navShip ((code, amount): char*int) ((e, n): int*int) ((we, wn): int*int) : (int*int)*(int*int) =
            let rotateWP (angle: int) ((we, wn): int*int) : int*int =
                let rot: int = (4 + (angle / 90)) % 4
                match rot with
                | 1 -> (wn, -we)
                | 2 -> (-we, -wn)
                | 3 -> (-wn, we)
                | _ -> (we, wn)
            let newWP = 
                match code with
                | 'N' -> (we, wn + amount)
                | 'S' -> (we, wn - amount)
                | 'E' -> (we + amount, wn)
                | 'W' -> (we - amount, wn)
                | 'L' -> rotateWP -amount (we, wn)
                | 'R' -> rotateWP amount (we, wn)
                | _ -> (we, wn)
            let newPos =
                match code with
                | 'F' -> (e + amount * we, n + amount * wn)
                | _ -> (e, n)
            (newPos, newWP)
        moves
        |> List.fold(
            fun (pos, wp) move ->
                navShip move pos wp
        ) ((0, 0), (10, 1))
        |>  function
            | ((a, b), _) -> abs a + abs b

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

let fetchData() : (char*int) list =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n")
    |> List.ofArray
    |> List.map (
        fun s -> 
            s.Trim()
            |> fun t -> (t.[0], (extractNumber t.[1..(t.Length - 1)]))
    )

[<EntryPoint>]
let main argv =
    let navs : (char*int) list = 
        fetchData()
    let mDist = Navigation.getManhattan navs
    printfn "%A" mDist
    let mDist2 = Navigation.getManhattan2 navs
    printfn "%A" mDist2

    0 // return an integer exit code
