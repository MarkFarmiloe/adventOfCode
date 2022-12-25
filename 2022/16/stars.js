'use strict';
const fs = require("fs");

const getData = (raw) => {
    const decodeLine = l => {
        const parts = l.split(/^Valve (..) has flow rate=(\d+); [^A-Z]* (.*)$/);
        const value = {flow: parseInt(parts[2]), links: parts[3].split(', ')};
        return [parts[1], value];
    }
    const lines = raw.split('\n');
    const valves = {};
    lines.forEach(l => {
        const [key, value] = decodeLine(l);
        valves[key] = value;
    });
    return valves;
}

const calcBestScore = (valves, times, currId, availableIds, time) => {
    // console.log(currId, availableIds, time);
    const remainingIds = availableIds.filter(id => id !== currId);
    if (time <= 0) return 0;
    let maxScore = 0;
    remainingIds.forEach(id => {
        const score = calcBestScore(valves, times, id, remainingIds, time - times[currId + id]);
        if (score > maxScore) maxScore = score;
    });
    return maxScore + valves[currId].flow * time;
};

const part1 = (valves, goodIds, times) => {
    let timeLeft = 30;
    return calcBestScore(valves, times, 'AA', goodIds, timeLeft);
};

const part2 = (valves, goodIds, times) => {
    const timeLeft = 26;
    const scores = { '': 0 };
    const calcScore = (key, currId, availableIds, time) => {
        // console.log(currId, availableIds, time);
        const remainingIds = availableIds.filter(id => id !== currId);
        if (time <= 0) return;
        const newKey = key + currId;
        scores[newKey] = scores[key] + valves[currId].flow * time;
        remainingIds.forEach(id => {
            calcScore(newKey, id, remainingIds, time - times[currId + id]);
        });
    };
    const calcScores = (availableIds) => {
        const remainingIds = availableIds.filter(id => id !== 'AA');
        remainingIds.forEach(id => {
            calcScore('', id, remainingIds, timeLeft - times['AA' + id]);
        });
        return scores;
    }
    const myScores = calcScores(goodIds);
    return Object.keys(myScores).reduce((best, key) => {
        const usedIds = [];
        for (let i = 0; i < key.length; i += 2) {
            usedIds.push(key.slice(i, i + 2));
        }
        const eIds = goodIds.filter(id => !usedIds.includes(id));
        const totalScore = myScores[key] + 
            calcBestScore(valves, times,'AA', eIds, timeLeft);
        if (key === 'JJBBCC') console.log(myScores[key], totalScore);
        return best > totalScore ? best : totalScore;
    }, 0);
};

const process = (err, data) => {
    if (err) throw err;
    const valves = getData(data);
    // console.log(valves);
    const times = {};
    const goodIds = ['AA'];
    for (const id of Object.keys(valves)) {
        if (valves[id].flow > 0) goodIds.push(id); 
    };
    goodIds.sort();
    const minDistance = (a, b) => {
        const visited = {};
        visited[a] = 0;
        let distance = 0;
        do {
            const nexts = Object.keys(valves).filter(vid => visited.hasOwnProperty(vid) && visited[vid] === distance);
            for (const next of nexts) {
                for (const l of valves[next].links) {
                    if (l === b) return distance + 1;
                    if (!visited.hasOwnProperty(l)) visited[l] = distance + 1;
                }
            }
            distance++
        } while (true);
    };
    for (let i = 0; i < goodIds.length; i++) {
        const a = goodIds[i];
        for (let j = i + 1; j < goodIds.length; j++) {
            const b = goodIds[j];
            const time = 1 + minDistance(a, b); // include time to open valve
            times[a + b] = time;
            times[b + a] = time;
        }
    }
    console.log(goodIds);
    console.log(times);
    console.log(part1(valves, goodIds, times));
    console.log(part2(valves, goodIds, times));
}

const run = 1;
const filename = run === 0 ? "./test.txt": "./input.txt";

fs.readFile(filename, 'utf8', process);
