// Learn more about F# at http://fsharp.org

open System

type Content =
    {   Type: string
        Count: int
    }

type Bag =
    {   Type: string
        Contents: Content list 
    }

let extractNumber (s: string) =
    match s |> Int32.TryParse with 
    | (true, num) -> num 
    | (false, s) -> failwith "Bad Number: " + s

module Bags =
    let getKeyedContents (bag: string list): Bag=
        let getContents (s: string) =
            s.Trim().Split(",")
            |> List.ofArray // list of content items number & type
            |> List.map(fun c ->
                let parts = 
                    c.Trim().Split(" ")
                    |> List.ofArray
                match parts.[0] with
                | v when v = "no" -> { Type = "Empty"; Count = 0 }
                | v -> { Type = parts.[1].Trim() + " " + parts.[2].Trim(); Count = extractNumber v }
            )  
        { Type = bag.[0].Trim(); Contents = getContents bag.[1] }
    let rec isGoldBag (bags: Bag list) (bag: Bag) = 
        let goldType = "shiny gold"
        bag.Contents
        |> List.exists(fun (content: Content) -> 
                content.Type = goldType ||
                List.find(fun bag -> bag.Type = content.Type) bags |> isGoldBag bags
            )
    let rec bagsIn (bags: Bag list) (bag: Bag) =
        1 +
        (bag.Contents
        |> List.sumBy (fun (c: Content) ->
                c.Count * 
                (List.find(fun (b: Bag) -> b.Type = c.Type) bags
                |> bagsIn bags
                ) : int))

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
    |> List.map (fun l -> (l.Trim().Split(" bags contain ") |> List.ofArray))
    


[<EntryPoint>]
let main argv =
    let bags = 
        List.map (Bags.getKeyedContents >> (fun b -> 
            {   Type = b.Type; 
                Contents = if b.Contents = [{ Type = "Empty"; Count = 0 }] then [] else b.Contents }
                )) (fetchData())
    // printfn "%A" bags
    let goldBags =
        bags
        |> List.filter(fun b -> Bags.isGoldBag bags b)
    printfn "%A" goldBags.Length
    let bagsInGold =
        bags
        |> List.find(fun b -> b.Type = "shiny gold")
        |> Bags.bagsIn bags
    printfn "%A" (bagsInGold - 1)
    0 // return an integer exit code
