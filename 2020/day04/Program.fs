// Learn more about F# at http://fsharp.org

open System

type PassportInfo =
    {   Byr         : int option
        Iyr         : int option
        Eyr         : int option
        Hgt         : string option
        Hcl         : string option
        Ecl         : string option
        Pid         : string option
        Cid         : string option}

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, s) -> failwith "Bad Number: " + s

module Passport =
    let validation (info: PassportInfo) =
        let invalid = 
            info.Byr = None
            || info.Iyr = None
            || info.Eyr = None
            || info.Hgt = None
            || info.Hcl = None
            || info.Ecl = None
            || info.Pid = None
        not invalid
    let validation2 (info: PassportInfo) =
        let isNumber (s: string) =
            match Int32.TryParse s with
            | (true, _) -> true
            | _ -> false
        let isHexNumber (s: string) =
            s.ToCharArray()
            |> Array.forall(fun c -> (Array.exists (fun d -> d = c) ("0123456789abcdef".ToCharArray())))
        let validHgt (s: string) =
            match s with
            | v when v.EndsWith("cm") -> extractNumber v.[..(v.Length - 3)] |> fun x -> x >= 150 && x <= 193
            | v when v.EndsWith("in") -> extractNumber v.[..(v.Length - 3)] |> fun x -> x >= 59 && x <= 76
            | _ -> false   
        let validHcl (s: string) =
            match s with
            | v when v.[0] = '#' && v.Length = 7 -> isHexNumber v.[1..]
            | _ -> false
        let validEcl (s: string) =
            let good = [ "amb"; "blu"; "brn"; "gry"; "grn"; "hzl"; "oth" ]
            List.exists (fun item -> item = s) good
        let validPid (s: string) =
            match s with
            | v when v.Length = 9 -> isNumber v
            | _ -> false
        let valid = 
            match info.Byr with | Some v -> v >= 1920 && v <= 2002 | None -> false
            && match info.Iyr with | Some v -> v >= 2010 && v <= 2020 | None -> false
            && match info.Eyr with | Some v -> v >= 2020 && v <= 2030 | None -> false
            && match info.Hgt with | Some v -> validHgt v | None -> false
            && match info.Hcl with | Some v -> validHcl v | None -> false
            && match info.Ecl with | Some v -> validEcl v | None -> false
            && match info.Pid with | Some v -> validPid v | None -> false
        valid

let lineToPassportInfo (line: string) =
    let parts =
        line.Split(' ')
        |> List.ofArray
        |> List.map (fun b -> b.Split(':') |> List.ofArray)
    let pi =
        parts
        |> List.fold(
            fun acc elem -> 
                let acc =
                    match elem with
                    | "byr" :: [v]  -> {acc with Byr = Some (extractNumber v)}
                    | "iyr" :: [v]  -> {acc with Iyr = Some (extractNumber v)}
                    | "eyr" :: [v]  -> {acc with Eyr = Some (extractNumber v)}
                    | "hgt" :: [v] -> {acc with Hgt = Some v}
                    | "hcl" :: [v]  -> {acc with Hcl = Some v}
                    | "ecl" :: [v]  -> {acc with Ecl = Some v}
                    | "pid" :: [v]  -> {acc with Pid = Some v}
                    | "cid" :: [v]  -> {acc with Cid = Some v}
                    | key :: [value] -> failwith $"Invalid key: {key} ({value}" 
                    | _ -> acc
                acc) 
            { Byr = None; Iyr = None; Eyr = None; Hgt = None; Hcl = None; Ecl = None; Pid = None; Cid = None }
    pi

// let filePath = "test.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n\n")
    |> List.ofArray
    |> List.map ((fun l -> l.Trim().Replace('\n', ' ')) >> lineToPassportInfo)


[<EntryPoint>]
let main argv =
    let data = fetchData()
    // printfn "%A" data
    let valid =
        data
        |> List.filter Passport.validation
    printfn "%A" valid.Length
    let valid2 =
        valid
        |> List.filter Passport.validation2
    printfn "%A" valid2.Length
    0 // return an integer exit code
