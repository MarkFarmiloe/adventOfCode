// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string) : int =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, _) -> failwith ("Bad Number: " + s)

module Bus =
    let getBestBus (earliest: int) (ids: (int*int) list) : int*int =
        ids
        |> List.fold (
            fun (t, i) (id, _) ->
                let time = (id - (earliest % id)) % id
                if t = 0 || t > time then (time, id) else (t, i) 
        ) (0, 0)
    let getCompetitionAnswer (earliest: int) (ids: (int*int) list) : Int64 =
        let rec gcf (a: Int64) (b: Int64) : Int64 =
            match a - b with
            | 0L -> a
            | v when v = a -> 0L
            | v when v = -b -> 0L 
            | v when v > 0L -> gcf ((a - 1L) % b + 1L) b
            | v -> gcf a ((b - 1L) % a + 1L)
        ids
        |> List.fold (
            fun (ts, lcm) (id, pos) ->
                let id64 = int64 id
                let pos64 = int64 pos
                let gcf = gcf lcm id64
                let newTs = 
                    [0L..(id64 - 1L)]
                    |> List.fold (
                        fun acc k ->
                            match (pos64 + acc + lcm * k) % id64 with
                            | 0L -> acc + lcm * k
                            | _ -> acc
                    ) ts
                let newLcm = lcm * id64 / gcf
                (newTs, newLcm)
        ) ((int64 earliest), 1L)
        |>  function
            | (a, _) -> a

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

let fetchData() : int*((int*int) list) =
    let file = new IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n")
    |> List.ofArray
    |>  function
        | a :: b :: _ -> 
            (   extractNumber (a.Trim()), 
                b.Trim().Split(",")
                |> List.ofArray
                |> List.fold (
                    fun (acc, i) s ->
                        match s with
                        | "x" -> (acc, i + 1)
                        | n -> (((extractNumber (n.Trim())), i) :: acc, i + 1)
                ) ([], 0)
            )
        | _ -> (0, ([], 0))
    |>  function
        | (time, (ids, _)) -> (time, ids)

[<EntryPoint>]
let main argv =
    let ((earliest, ids): int*((int*int) list)) = 
        fetchData()
    let (time, id) = Bus.getBestBus earliest ids
    printfn "%A" (time * id)
    // printfn "%A" ids
    let timestamp = Bus.getCompetitionAnswer earliest ids
    printfn "%A" timestamp

    0 // return an integer exit code
