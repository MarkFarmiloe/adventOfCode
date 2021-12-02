// Learn more about F# at http://fsharp.org
open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

let extractInstruction (s: string): (string * Int32) =
    s
    |> fun s -> s.Split(' ')
    |> List.ofArray
    |> fun a -> 
        match a with
        | b :: c :: [] -> (b, (extractNumber c))
        | _ -> failwith ("Bad Instruction") 

let fetchData (filePath: string) =
    let file = new IO.StreamReader(filePath)
    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r')
    |> fun s -> s.Split("\n")
    |> List.ofArray
    |> List.map extractInstruction 

let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let instructions = fetchData filePath
    let (h, v) = 
        List.fold (fun (h, v) (d, q) ->
            match d with
            | "forward" -> (h + q, v)
            | "down" -> (h, v + q)
            | "up" -> (h, v - q)
            | _ -> failwith("Bad direction: " + d)
        ) (0, 0) instructions
    printfn "%A" (h * v)
    let (h2, v2, _) = 
        List.fold (fun (h, v, a) (d, q) ->
            match d with
            | "forward" -> (h + q, v + (q * a), a)
            | "down" -> (h, v, a + q)
            | "up" -> (h, v, a - q)
            | _ -> failwith("Bad direction: " + d)
        ) (0, 0, 0) instructions
    printfn "%A" (h2 * v2)

    0 // return an integer exit code
