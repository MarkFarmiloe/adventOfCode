// Learn more about F# at http://fsharp.org

open System

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, s) -> failwith "Bad Number: " + s

module Groups =
    let getGroupCount (info: string list) =
        info
        |> List.fold (
            fun (acc: int list) s ->
                s.ToCharArray()
                |> List.ofArray
                |> List.fold (
                    fun (acc2: int list) c ->
                        let offset = int c - int 'a'
                        List.mapi (fun i f -> if i = offset then 1 else f) acc2                     
                ) acc
        ) [0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0]
        |> List.sum
    let getGroupCount2 (info: string list) =
        info
        |> List.fold (
            fun (acc: int list) s ->
                s.ToCharArray()
                |> List.ofArray
                |> List.fold (
                    fun (acc2: int list) c ->
                        let offset = int c - int 'a'
                        List.mapi (fun i n -> if i = offset then n + 1 else n) acc2                     
                ) acc
        ) [0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0; 0]
        |> List.filter (fun n -> n = info.Length)
        |> List.length

// let filePath = "test.txt"
let filePath = "input.txt"

let fetchData() =
    let file = new System.IO.StreamReader(filePath)
    let data = 
        file.ReadToEnd() 
        |> String.filter (fun c -> c <> '\r')
    data.Split("\n\n")
    |> List.ofArray
    |> List.map (fun l -> (l.Trim().Split("\n") |> List.ofArray))
    


[<EntryPoint>]
let main argv =
    let groups = fetchData()
    // printfn "%A" data
    let count =
        groups
        |> List.sumBy Groups.getGroupCount
    printfn "%A" (count)
    printfn "%A" (List.sumBy Groups.getGroupCount2 groups)
    0 // return an integer exit code
