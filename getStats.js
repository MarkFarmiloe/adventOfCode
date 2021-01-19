const https = require('https');
const schedule = require('node-schedule');
const fs = require('fs');
const readline = require('readline');

const parseDay = (l) => {
    const re = />\s*(\d+)[^>]*>\s*(\d+)[^>]*>[^>]*>\s*(\d+)/;
    const matches = l.match(re);
    return matches.slice(1,4).map(s => Number.parseInt(s)); 
}

const parse = (data) => {
    let pos = data.indexOf('<pre class="stats">');
    let lines = data.slice(pos).split('\n').slice(0, 25).map(parseDay);
    return lines;
}

const filename = (ts) => {
    const day = ts.getDate();
    const hour = ts.getHours();
    return `stats/${day}-${hour}.json`;
}

const job = (timestamp) => {
    https.get('https://adventofcode.com/2020/stats', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    }
    if (error) {
        console.error('1:', error.message);
        // Consume response data to free up memory
        res.resume();
        return;
    }
    console.log(timestamp);
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            // console.log(rawData);
            const results = parse(rawData);
            // console.log(results);
            const resultsString = JSON.stringify(results);
            // console.log(resultsString);
            fs.writeFileSync(filename(timestamp), resultsString);
        } catch (e) {
            console.error(`Got error: ${e.message}`);
        }
    });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
    return '';
}

// const _ = job(new Date());

schedule.scheduleJob('59 * * * *', job);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'press enter to quit> '
});

rl.prompt();

rl.on('line', (line) => {
  rl.close();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
