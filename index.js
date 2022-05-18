const { execSync } = require("child_process");
const {performance} = require('perf_hooks');

function runCommand(seed) {
    console.log(seed) 
    console.log(execSync("node ./VerMatrix_gravity.js " + seed + " 5", (error, stdout, stderr) => { 
        if (error) { 
            console.log("error: " + error.message);
            return;
        } else if (stderr) { 
            console.log("stderr: " + stderr)
            return;
        } 
        console.log("stdout: \n" + stdout)
    }).toString())
    console.log("")
}


function run () { 
    let seed = 58319
    const timeArr =[]
    for (let i = 0; i < 100; i++ ) { 
        let startTime = performance.now(); 
        runCommand(++seed)
        let endTime = performance.now(); 
        console.log(`TIME ::: ${endTime - startTime} ms\n\n\n\n`);
        timeArr.push(endTime - startTime);
    }
    const sum = timeArr.reduce((a, b) => a+b, 0); 
    console.log(`Average time ::: ${sum/timeArr.length} ms`)
}


run()