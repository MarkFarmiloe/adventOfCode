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

module Life =
    let tick3 (ticks: int) (startInfo: string list): int [,,] =
        let len = startInfo.[0].Length + 2 + (2 * ticks)
        let offset = len / 2

        let cube = Array3D.zeroCreate len len len

        startInfo
        |> List.iteri
            (fun i s ->
                let start = 0 - (s.Length / 2)

                for j = 0 to s.Length - 1 do
                    if s.[j] = '#' then
                        let x = offset + start + i
                        let y = offset + start + j
                        let z = offset
                        // printfn "%A" (x, y, z)
                        cube.[x, y, z] <- 1
                    else
                        ())

        for _ in [ 1 .. ticks ] do
            let prevCube = Array3D.map (fun e -> e) cube

            for i in [ 1 .. (len - 2) ] do
                for j in [ 1 .. (len - 2) ] do
                    for k in [ 1 .. (len - 2) ] do
                        let curr = prevCube.[i, j, k]

                        let neighbours =
                            let mutable sum = 0

                            for a in [ (i - 1) .. (i + 1) ] do
                                for b in [ (j - 1) .. (j + 1) ] do
                                    for c in [ (k - 1) .. (k + 1) ] do
                                        sum <- sum + prevCube.[a, b, c]

                            sum - curr

                        if curr = 1 then
                            cube.[i, j, k] <-
                                if neighbours < 2 || neighbours > 3 then
                                    0
                                else
                                    1
                        else
                            cube.[i, j, k] <- if neighbours = 3 then 1 else 0

        cube

    let tick4 (ticks: int) (startInfo: string list): int =
        let len = startInfo.[0].Length + 2 + (2 * ticks)
        let offset = len / 2

        let cube = Array4D.zeroCreate len len len len

        startInfo
        |> List.iteri
            (fun i s ->
                let start = 0 - (s.Length / 2)

                for j = 0 to s.Length - 1 do
                    if s.[j] = '#' then
                        let x = offset + start + i
                        let y = offset + start + j
                        let z = offset
                        let w = offset
                        cube.[x, y, z, w] <- 1
                    else
                        ())

        for _ in [ 1 .. ticks ] do
            let prevCube = Array4D.zeroCreate len len len len

            for i in [ 1 .. (len - 2) ] do
                for j in [ 1 .. (len - 2) ] do
                    for k in [ 1 .. (len - 2) ] do
                        for l in [ 1 .. (len - 2) ] do
                            prevCube.[i, j, k, l] <- cube.[i, j, k, l]

            for i in [ 1 .. (len - 2) ] do
                for j in [ 1 .. (len - 2) ] do
                    for k in [ 1 .. (len - 2) ] do
                        for l in [ 1 .. (len - 2) ] do
                            let curr = prevCube.[i, j, k, l]

                            let neighbours =
                                let mutable sum = 0

                                for a in [ (i - 1) .. (i + 1) ] do
                                    for b in [ (j - 1) .. (j + 1) ] do
                                        for c in [ (k - 1) .. (k + 1) ] do
                                            for d in [ (l - 1) .. (l + 1) ] do
                                                sum <- sum + prevCube.[a, b, c, d]

                                sum - curr

                            if curr = 1 then
                                cube.[i, j, k, l] <-
                                    if neighbours < 2 || neighbours > 3 then
                                        0
                                    else
                                        1
                            else
                                cube.[i, j, k, l] <- if neighbours = 3 then 1 else 0

        let mutable alive = 0

        for i in [ 1 .. (len - 2) ] do
            for j in [ 1 .. (len - 2) ] do
                for k in [ 1 .. (len - 2) ] do
                    for l in [ 1 .. (len - 2) ] do
                        alive <- alive + cube.[i, j, k, l]

        alive

let fetchData (filePath: string) =
    let file = new IO.StreamReader(filePath)

    file.ReadToEnd()
    |> fun s -> s.Split("\n")
    |> List.ofArray
    |> List.map (fun row -> row.Trim())


// let filePath = "test.txt"
// let filePath = "test2.txt"
let filePath = "input.txt"

[<EntryPoint>]
let main argv =
    let cube = fetchData filePath
    // printfn "%A" cube
    let d3Cube = cube |> Life.tick3 6
    let mutable alive = 0

    d3Cube
    |> Array3D.iter (fun e -> alive <- alive + e)

    printfn "%A" alive

    let d4Alive = cube |> Life.tick4 6
    printfn "%A" d4Alive

    0 // return an integer exit code
