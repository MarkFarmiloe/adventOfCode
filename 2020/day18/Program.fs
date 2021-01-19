// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string): int =
    match s |> Int32.TryParse with
    | (true, num) -> num
    | (false, _) -> failwith ("Bad Number: " + s)

type Token =
    | Number of n: int
    | OpenBracket
    | CloseBracket
    | Op of op: char

// type Tree =
//     | Node of char * Tree * Tree
//     | Leaf of int

module Parser =
    let getTokens (line: string): Token list =
        let mutable tokens = []
        let mutable number = 0

        for i = 0 to line.Length - 1 do
            let next =
                match line.[i] with
                | '(' -> OpenBracket
                | ')' -> CloseBracket
                | '+' -> Op '+'
                | '*' -> Op '*'
                | d -> Number(int d - int '0')

            match next with
            | Number d -> number <- number * 10 + d
            | _ ->
                if number <> 0 then
                    tokens <- Number number :: tokens
                    number <- 0
                else
                    ()

                tokens <- next :: tokens

        if number <> 0 then
            tokens <- Number number :: tokens
            number <- 0
        else
            ()

        List.rev tokens

    let splitOnClosingBracket (tokens: Token List): Token list * Token list =
        tokens
        |> List.fold
            (fun (level, tl1, tl2) token ->
                match level with
                | 0 -> (0, tl1, token :: tl2)
                | _ ->
                    match token with
                    | OpenBracket -> (level + 1, token :: tl1, tl2)
                    | CloseBracket ->
                        match level with
                        | 1 -> (0, tl1, tl2)
                        | _ -> (level - 1, token :: tl1, tl2)
                    | _ -> (level, token :: tl1, tl2))
            (1, [], [])
        |> function
        | (0, tl1, tl2) -> (List.rev tl1, List.rev tl2)
        | _ -> failwith "Matching close bracket not found"

    let rec evaluateLevel (acc: Int64) (adv: bool) (tokens: Token list): Int64 * Token list =
        // printfn "%A" (acc, tokens)

        match tokens with
        | [] -> (acc, [])
        | [ h ] ->
            match h with
            | Op c -> failwith ("Trailing token: Operator " + (string c))
            | OpenBracket -> failwith ("Trailing token: OpenBracket")
            | CloseBracket -> failwith ("Trailing token: CloseBracket")
            | Number n -> failwith ("Trailing token: Number " + (string n))
        | a :: b :: t ->
            match a with
            | Op c ->
                let (n, tail) =
                    match b with
                    | OpenBracket ->
                        let (tl1, tl2) = splitOnClosingBracket t
                        let (v, _) = evaluateLevel 0L adv (Op '+' :: tl1)
                        (v, tl2)
                    | Number num -> (int64 num, t)
                    | _ -> failwith "OOPS"

                match c with
                | '+' -> evaluateLevel (acc + n) adv tail
                | '*' ->
                    if adv then
                        let (v, _) = evaluateLevel n adv tail
                        (acc * v, [])
                    else
                        evaluateLevel (acc * n) adv tail
                | _ -> failwith "Invalid operator"
            | _ -> failwith "Expected operator"

    let evaluate (adv: bool) (tl: Token list): Int64 =
        let (acc, _) = evaluateLevel 0L adv (Op '+' :: tl)
        acc

let fetchData (filePath: string): string list =
    let file = new IO.StreamReader(filePath)

    file.ReadToEnd()
    |> String.filter (fun c -> c <> '\r' && c <> ' ')
    |> fun s -> s.Split("\n")
    |> List.ofArray

// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let lines = fetchData filePath
    let tokenedLines = lines |> List.map Parser.getTokens
    // printfn "%A" tokenedLines

    let answers =
        tokenedLines |> List.map (Parser.evaluate false)

    printfn "%A" (answers |> List.sum)

    let answersAdv =
        tokenedLines |> List.map (Parser.evaluate true)

    printfn "%A" (answersAdv |> List.sum)

    0 // return an integer exit code
