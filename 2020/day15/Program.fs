// Learn more about F# at http://fsharp.org
open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

module Game =
    let nextNumber (startCount: int) (startNumber: int) (numbers: Map<int, int>) (numberWanted: int): int =

        [ startCount .. (numberWanted - 1) ]
        |> List.fold
            (fun (n, acc) i ->
                match Map.tryFind n acc with
                | None -> (0, (Map.add n i acc))
                | Some v -> ((i - v), Map.change n (fun _ -> Some i) acc))
            (startNumber, numbers)
        |> function
        | (n, _) -> n

    let nextNumberAlt (numbers: int []) (numberWanted: int): int =
        let lasts = [| for i in 1 .. numberWanted -> 0 |]

        let startCount = numbers.Length

        for i = 0 to startCount - 2 do
            let number = numbers.[i]
            lasts.[number] <- i + 1

        let startNumber = numbers.[startCount - 1]

        let mutable answer = startNumber

        [ startCount .. (numberWanted - 1) ]
        |> List.iter
            (fun i ->
                let last = lasts.[answer]
                lasts.[answer] <- i
                answer <- if last = 0 then 0 else i - last)

        answer

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

let fetchData () =
    let file = new IO.StreamReader(filePath)

    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r')
    |> fun s -> s.Split("\n")
    |> List.ofArray
    |> List.map
        (fun instr ->
            instr.Trim().Split(",")
            |> Array.map (fun (s: string) -> extractNumber s))
    |> List.head

[<EntryPoint>]
let main argv =
    let numbers = fetchData ()
    printfn "%A" numbers
    printfn "%A" (Game.nextNumberAlt numbers 2020)
    printfn "%A" (Game.nextNumberAlt numbers 30000000)

    0 // return an integer exit code
