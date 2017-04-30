const Benchmark = require("benchmark-async");
const here = require("../out/traceloc").here;
const fs = require("fs");

let outFile;
if (process.argv.length == 3) {
    outFile = process.argv[2];
}

// Increment Function used as a baseline for performance
// gives an idea on how fast the machine is that ran
// this code.
function inc(value) {
    return value + 1;
}

// Test how speed of here()
function incHereLine(value) {
    return value + here().line;
}

// Create and run the benchmark
const suite = new Benchmark.Suite();

suite.add('incHereLine', () => {
    incHereLine(12.0);
})
.add('inc', () =>{
    inc(13.0);
})
.on('cycle', (event) => {
    console.log(`${event.target}`);
})
.on('complete', () => {
    //console.log(`suite=${JSON.stringify(suite, null, "\t")}`);
    let rme = suite[0].stats.rme;
    let hz = suite[0].hz;
    let inchz = suite[1].hz;
    let jsonDate = (new Date()).toJSON();
    let data = { "ts": jsonDate, "hz": hz, "rme": rme, "inchz": inchz};
    let jsonData = JSON.stringify(data);
    console.log(`data: ${jsonData}`);
    if (outFile) {
        fs.appendFile(outFile, `${jsonData}\n`, (err) => {
            if (err) {
                console.log(`Failed appending to ${outFile} err=${err}`);
            }
        });
    }
})
.run({'async': true});
