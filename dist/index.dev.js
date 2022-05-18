"use strict";

var _require = require("child_process"),
    execSync = _require.execSync;

var _require2 = require('perf_hooks'),
    performance = _require2.performance;

function runCommand(seed) {
  console.log(seed);
  console.log(execSync("node ./VerMatrix_gravity.js " + seed + " 5", function (error, stdout, stderr) {
    if (error) {
      console.log("error: " + error.message);
      return;
    } else if (stderr) {
      console.log("stderr: " + stderr);
      return;
    }

    console.log("stdout: \n" + stdout);
  }).toString());
  console.log("");
}

function run() {
  var seed = 58319;
  var timeArr = [];

  for (var i = 0; i < 100; i++) {
    var startTime = performance.now();
    runCommand(++seed);
    var endTime = performance.now();
    console.log("TIME ::: ".concat(endTime - startTime, " ms\n\n\n\n"));
    timeArr.push(endTime - startTime);
  }

  var sum = timeArr.reduce(function (a, b) {
    return a + b;
  }, 0);
  console.log("Average time ::: ".concat(sum / timeArr.length, " ms"));
}

run();