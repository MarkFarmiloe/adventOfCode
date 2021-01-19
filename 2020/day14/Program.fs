// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string): Int64 =
    match s |> Int64.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

module Docking =
    let updateMem (mem: (Int64 * Int64) list) (memNo: Int64) (mask: string) (value: Int64): (Int64 * Int64) list =
        let maskedValue: Int64 =
            mask.ToCharArray()
            |> Array.fold
                (fun (valu, d) c ->
                    let newValu =
                        match c with
                        | '0' -> valu
                        | '1' -> valu + d
                        | _ -> valu + (value &&& d)

                    (newValu, d >>> 1))
                (0L, 1L <<< 35)
            |> function
            | (v, _) -> v

        (memNo, maskedValue)
        :: (List.filter (fun (idx, _) -> idx <> memNo) mem)

    let processInstructions (instructions: (string * string) list): (Int64 * Int64) list =
        instructions
        |> List.fold
            (fun (acc, mask) (code, value) ->
                match code with
                | "mask" -> (acc, value)
                | _ -> (updateMem acc (extractNumber code.[4..(code.Length - 2)]) mask (extractNumber value), mask))
            ([], "")
        |> function
        | (mem, _) -> mem

    let updateMaskedMem (mem: Map<Int64, Int64>) (memNo: Int64) (mask: string) (value: Int64): Map<Int64, Int64> =
        let maskedAddresses: Int64 list =
            let mutable baseAddress: Int64 =
                mask.ToCharArray()
                |> Array.fold
                    (fun (address, d) c ->
                        ((match c with
                          | '0' -> address + (memNo &&& d)
                          | '1' -> address + d
                          | _ -> address),
                         d >>> 1))
                    (0L, 1L <<< 35)
                |> function
                | (v, _) -> v

            mask.ToCharArray()
            |> Array.fold
                (fun (addresses, d) c ->
                    ((match c with
                      | 'X' ->
                          addresses
                          |> List.fold (fun acc a -> (a + d) :: acc) addresses
                      | _ -> addresses),
                     d >>> 1))
                ([ baseAddress ], 1L <<< 35)
            |> function
            | (v, _) -> v

        maskedAddresses
        |> List.fold
            (fun mems addr ->
                Map.change
                    addr
                    (function
                    | _ -> Some value)
                    mems)
            mem

    let processInstructionsV2 (instructions: (string * string) list): Map<Int64, Int64> =
        instructions
        |> List.fold
            (fun (acc, mask) (code, value) ->
                match code with
                | "mask" -> (acc, value)
                | _ ->
                    (updateMaskedMem acc (extractNumber code.[4..(code.Length - 2)]) mask (extractNumber value), mask))
            (Map.empty, "")
        |> function
        | (mem, _) -> mem

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
            instr.Trim().Split(" = ")
            |> fun a -> (a.[0], a.[1]))

[<EntryPoint>]
let main argv =
    let instructions = fetchData ()
    // printfn "%A" instructions
    let mem = Docking.processInstructions instructions
    // printfn "%A" mem
    printfn "%A" (mem |> List.sumBy (fun (_, v) -> v))

    let mem2 =
        Docking.processInstructionsV2 instructions
    // printfn "%A" mem
    printfn "%A" (mem2 |> Map.fold (fun acc _ v -> acc + v) 0L)

    0 // return an integer exit code
