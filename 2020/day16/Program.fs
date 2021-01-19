// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

type Constraint =
    { Name: string
      Ranges: int list list
      Pos: int }

module Tickets =
    let validRanges (constraints: Constraint list): int list list =
        constraints
        |> List.fold (fun acc c -> c.Ranges |> List.fold (fun acc r -> r :: acc) acc) []

    let getTicketScanErrorRate (constraints: Constraint list) (tickets: int list list): int =
        tickets
        |> List.fold
            (fun acc numbers ->
                numbers
                |> List.fold
                    (fun acc number ->
                        match (validRanges constraints)
                              |> List.exists (fun r -> number >= r.[0] && number <= r.[1]) with
                        | true -> acc
                        | false -> acc + number)
                    acc)
            0

    let getConstraintsWithPositions (constraints: Constraint list) (tickets: int list list) =
        let validTickets =
            tickets
            |> List.filter
                (fun numbers ->
                    numbers
                    |> List.fold
                        (fun acc number ->
                            match (validRanges constraints)
                                  |> List.exists (fun r -> number >= r.[0] && number <= r.[1]) with
                            | true -> acc
                            | false -> false)
                        true)

        let fieldValues =
            validTickets
            |> List.fold
                (fun (acc: (int list) []) t ->
                    List.iteri (fun i n -> acc.[i] <- n :: acc.[i]) t
                    acc)
                (Array.create (validTickets.[0].Length) [])

        let validPositions: string list [] =
            fieldValues
            |> Array.map
                (fun fvs ->
                    constraints
                    |> List.fold
                        (fun acc c ->
                            match (fvs
                                   |> List.forall
                                       (fun n ->
                                           c.Ranges
                                           |> List.exists
                                               (fun r ->
                                                   match r with
                                                   | min :: max :: _ -> n >= min && n <= max
                                                   | _ -> false))) with
                            | true -> c.Name :: acc
                            | false -> acc)
                        [])

        let rec normaliseFieldPositions (fieldPositions: string list []) (constraints: Constraint list) =
            let fieldPos: int =
                fieldPositions
                |> Array.findIndex (fun p -> p.Length = 1)

            let fieldName = fieldPositions.[fieldPos].[0]

            let newFps =
                fieldPositions
                |> Array.map (fun fp -> fp |> List.filter (fun n -> n <> fieldName))

            let newCs =
                constraints
                |> List.map
                    (fun c ->
                        match c.Name with
                        | n when n = fieldName -> { c with Pos = fieldPos }
                        | _ -> c)

            match newFps |> Array.sumBy (fun fp -> fp.Length) with
            | 0 -> newCs
            | _ -> normaliseFieldPositions newFps newCs

        normaliseFieldPositions validPositions constraints

let fetchData (filePath: string): Constraint list * int list list =
    let getConstraints (c: string): Constraint list =
        let getRanges (rs: string []): int list list =
            rs
            |> List.ofArray
            |> List.map
                (fun s ->
                    s.Split("-")
                    |> List.ofArray
                    |> function
                    | []
                    | [ _ ] -> failwith "Oops"
                    | min :: max :: _ ->
                        [ extractNumber (min.Trim())
                          extractNumber (max.Trim()) ])

        c.Split("\n")
        |> List.ofArray
        |> List.map
            (fun s ->
                s.Split(":")
                |> List.ofArray
                |> function
                | []
                | [ _ ] -> failwith "oops"
                | h :: t :: _ ->
                    { Name = h.Trim()
                      Ranges = (getRanges (t.Split(" or ")))
                      Pos = -1 })

    let getTickets (ts: string list): int list list =
        ts
        |> List.fold
            (fun acc s ->
                match acc with
                | "" -> s
                | _ -> acc + "\n" + s)
            ""
        |> fun s -> s.Split("\n") |> List.ofArray
        |> List.filter (fun t -> Array.contains t.[0] ("0123456789".ToCharArray()))
        |> List.map
            (fun s ->
                s.Split(",")
                |> List.ofArray
                |> List.map (fun s -> extractNumber (s.Trim())))

    let file = new IO.StreamReader(filePath)

    let (cs, ts) =
        file.ReadToEnd()
        |> String.filter (fun c -> c <> '\r')
        |> fun s -> s.Split("\n\n")
        |> List.ofArray
        |> function
        | [] -> failwith "OOPS"
        | h :: t -> (h, t)

    ((getConstraints cs), (getTickets ts))

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let (constraints, tickets) = fetchData filePath
    printfn "%A" (Tickets.getTicketScanErrorRate constraints tickets)

    let constraintsWithPositions =
        Tickets.getConstraintsWithPositions constraints tickets
    // printfn "%A" constraintsWithPositions
    let validationCode =
        let myTicket = tickets.[0]

        constraintsWithPositions
        |> List.fold
            (fun acc c ->
                match c.Name with
                | n when n.StartsWith("departure") -> acc * (int64 myTicket.[c.Pos])
                | _ -> acc)
            1L

    printfn "%A" validationCode

    0 // return an integer exit code
